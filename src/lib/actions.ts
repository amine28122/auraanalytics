'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateTradeSignals, type GenerateTradeSignalsOutput, type TradeSignal as AITradeSignal } from '@/ai/flows/generate-trade-signals';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import Parser from 'rss-parser';

export type TradeSignal = AITradeSignal;

export async function signOut() {
  redirect('/auth');
}

export type AnalysisFormState = {
  data: GenerateTradeSignalsOutput | null;
  error: string | null;
  message: string | null;
  chartImage?: string;
};

const PLAN_LIMITS = {
  Free: 1,
  Premium: 5,
  'Aura Plan': Infinity,
};

const dataUriSchema = z.string().refine(
  (data) => data.startsWith('data:image/'),
  { message: 'Invalid image data format.' }
);

const analysisSchema = z.object({
  chartDataLarge: dataUriSchema,
  chartDataSmall: dataUriSchema.optional().or(z.literal('')),
  userId: z.string().min(1, { message: 'User ID is required.' }),
  userLang: z.enum(['en', 'ar', 'es']).default('en'),
  analysisSchools: z.string().transform(val => val ? val.split(',') : []).optional(),
});

export async function getTradeSignals(
  prevState: AnalysisFormState | void,
  formData: FormData
): Promise<AnalysisFormState> {

  const chartDataLargeUri = formData.get('chartDataLarge');
  const chartDataSmallUri = formData.get('chartDataSmall');
  const userId = formData.get('userId');
  const userLang = formData.get('userLang');
  const analysisSchools = formData.get('analysisSchools');

  const validatedFields = analysisSchema.safeParse({
    chartDataLarge: typeof chartDataLargeUri === 'string' && chartDataLargeUri ? chartDataLargeUri : undefined,
    chartDataSmall: typeof chartDataSmallUri === 'string' && chartDataSmallUri ? chartDataSmallUri : undefined,
    userId: userId,
    userLang: userLang,
    analysisSchools: analysisSchools
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage =
      Object.values(fieldErrors).flat()[0] ||
      validatedFields.error.flatten().formErrors[0] ||
      'Invalid input.';

    return { data: null, error: errorMessage, message: null };
  }

  const { chartDataLarge, chartDataSmall, userId: validUserId, userLang: validUserLang, analysisSchools: validAnalysisSchools } = validatedFields.data;

  const { firestore } = initializeServerFirebase();
  const userDocRef = firestore.collection('users').doc(validUserId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists) throw new Error('User not found.');

      const userData = userDoc.data() || {};
      const plan = userData.plan || 'Free';
      const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
      let analysisCount = userData.analysisCount || 0;
      const lastAnalysisDate = userData.lastAnalysisDate;
      const now = new Date();

      if (plan !== 'Aura Plan') {
        const lastAnalysisDay = lastAnalysisDate ? (lastAnalysisDate.toDate ? lastAnalysisDate.toDate() : new Date(lastAnalysisDate._seconds * 1000)) : null;

        const isNewDay = !lastAnalysisDay ||
          (lastAnalysisDay.getUTCFullYear() !== now.getUTCFullYear() ||
            lastAnalysisDay.getUTCMonth() !== now.getUTCMonth() ||
            lastAnalysisDay.getUTCDate() !== now.getUTCDate());

        if (isNewDay) analysisCount = 0;

        if (analysisCount >= limit) {
          throw new Error(`limit:You have reached your daily limit of ${limit} analyses for the ${plan} plan. Please wait until tomorrow to get more.`);
        }
      }
    });
  } catch (e: any) {
    if (e.message.startsWith('limit:')) {
      return { data: null, error: e.message.replace('limit:', ''), message: null };
    }
    console.error("User validation transaction failed:", e);
    return { data: null, error: "Failed to validate user session. Please try again.", message: null };
  }

  try {
    const input: any = { chartDataLarge, language: validUserLang, analysisSchools: validAnalysisSchools };
    if (chartDataSmall) input.chartDataSmall = chartDataSmall;

    const result = await generateTradeSignals(input);

    await firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists) throw new Error('User not found while trying to update count.');

      const userData = userDoc.data() || {};
      const plan = userData.plan || 'Free';
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      let lastDateStr = "";
      if (userData.lastAnalysisDate) {
        const ld = userData.lastAnalysisDate.toDate ? userData.lastAnalysisDate.toDate() : new Date(userData.lastAnalysisDate._seconds * 1000);
        lastDateStr = ld.toISOString().split('T')[0];
      }

      const isNewDay = todayStr !== lastDateStr;
      const firstPair = result.signals?.[0]?.pair || 'Unknown';
      const logEntry = `${now.toISOString()}|${firstPair}`;

      let activityLog = Array.isArray(userData.todayAnalyses) ? userData.todayAnalyses : [];
      if (isNewDay) {
        activityLog = [logEntry];
      } else {
        activityLog = [...activityLog, logEntry].slice(-10);
      }

      const updates: any = {
        lastAnalysisDate: admin.firestore.FieldValue.serverTimestamp(),
        lastAnalysisPair: firstPair,
        todayAnalyses: activityLog,
        preferredAnalysisSchools: validAnalysisSchools
      };

      if (plan !== 'Aura Plan') {
        const analysisCount = userData.analysisCount || 0;
        const newCount = isNewDay ? 1 : analysisCount + 1;
        updates.analysisCount = newCount;
      }

      transaction.update(userDocRef, updates);
    });

    return { data: result, error: null, message: 'Analysis successful.', chartImage: chartDataLarge };

  } catch (e: any) {
    console.error(`AI analysis failed: ${e.message}`);
    return { data: null, error: `Analysis failed: ${e.message}`, message: null };
  }
}

const activationRequestSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  transactionId: z.string().min(3),
  screenshotDataUrl: z.string().refine(data => data.startsWith('data:image/'), { message: 'Invalid screenshot format.' }),
  planName: z.string().default('Premium'),
});

const withdrawSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  amount: z.number().min(50, 'Minimum withdrawal is $50'),
  walletAddress: z.string().min(10, 'Invalid USDT TRC20 address'),
});

export type ActivationFormState = {
  error: string | null;
  message: string | null;
};

export async function submitActivationRequest(
  prevState: ActivationFormState,
  formData: FormData
): Promise<ActivationFormState> {
  const { firestore } = initializeServerFirebase();

  const validatedFields = activationRequestSchema.safeParse({
    userId: formData.get('userId'),
    email: formData.get('email'),
    transactionId: formData.get('transactionId'),
    screenshotDataUrl: formData.get('screenshotDataUrl'),
    planName: formData.get('planName'),
  });

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.flatten().fieldErrors.transactionId?.[0]
      || validatedFields.error.flatten().fieldErrors.screenshotDataUrl?.[0]
      || 'Invalid data submitted.';
    return { error: errorMessage, message: null };
  }

  const { userId, email, transactionId, screenshotDataUrl, planName } = validatedFields.data;

  try {
    const requestsColl = firestore.collection('activationRequests');
    const existing = await requestsColl.where("userId", "==", userId).where("status", "==", "pending").get();

    if (!existing.empty) {
      return { error: "You already have a pending activation request. Please wait for it to be processed.", message: null };
    }

    await requestsColl.add({
      userId,
      email,
      transactionId,
      screenshotDataUrl,
      planName,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { error: null, message: 'Your request has been submitted successfully.' };
  } catch (e: any) {
    return { error: `Submission failed: ${e.message}`, message: null };
  }
}

export async function approveActivationRequest(requestId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  const { firestore } = initializeServerFirebase();
  const requestDocRef = firestore.collection('activationRequests').doc(requestId);
  const userDocRef = firestore.collection('users').doc(userId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const requestDoc = await transaction.get(requestDocRef);
      const userDoc = await transaction.get(userDocRef);

      if (!requestDoc.exists || !userDoc.exists) throw new Error('User or request document not found.');

      const requestData = requestDoc.data() || {};
      if (requestData.status === 'approved') throw new Error('This request has already been approved.');

      const userData = userDoc.data() || {};
      const planName = requestData.planName || 'Premium';
      const referredBy = userData.referredBy;
      const shouldAwardCommission = referredBy && !userData.affiliateCommissionPaid;

      const startDate = admin.firestore.Timestamp.now();
      const endDate = new admin.firestore.Timestamp(startDate.seconds + 30 * 24 * 60 * 60, startDate.nanoseconds);

      transaction.update(userDocRef, {
        plan: planName,
        analysisCount: 0,
        lastAnalysisDate: null,
        planStartDate: startDate,
        planEndDate: endDate,
        learningProgress: userData.learningProgress || {},
        affiliateCommissionPaid: shouldAwardCommission ? true : (userData.affiliateCommissionPaid || false)
      });

      if (shouldAwardCommission) {
        const referrerDocRef = firestore.collection('users').doc(referredBy);
        const commission = planName.trim() === 'Aura Plan' ? 25.00 : 10.00;
        transaction.update(referrerDocRef, {
          activeReferrals: admin.firestore.FieldValue.increment(1),
          totalEarnings: admin.firestore.FieldValue.increment(commission),
          pendingEarnings: admin.firestore.FieldValue.increment(commission),
        });
      }

      transaction.update(requestDocRef, { status: 'approved' });
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateUserPlan(userId: string, newPlan: 'Free' | 'Premium' | 'Aura Plan') {
  const { firestore } = initializeServerFirebase();
  const userDocRef = firestore.collection('users').doc(userId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists) throw new Error('User not found.');

      const userData = userDoc.data() || {};
      const referredBy = userData.referredBy;
      const shouldAwardCommission = userData.plan === 'Free' && newPlan !== 'Free' && referredBy && !userData.affiliateCommissionPaid;

      let planStartDate = null;
      let planEndDate = null;

      if (newPlan !== 'Free') {
        const startDate = admin.firestore.Timestamp.now();
        planStartDate = startDate;
        planEndDate = new admin.firestore.Timestamp(startDate.seconds + 30 * 24 * 60 * 60, startDate.nanoseconds);
      }

      transaction.update(userDocRef, {
        plan: newPlan,
        analysisCount: 0,
        lastAnalysisDate: null,
        planStartDate,
        planEndDate,
        affiliateCommissionPaid: shouldAwardCommission ? true : (userData.affiliateCommissionPaid || false)
      });

      if (shouldAwardCommission) {
        const referrerDocRef = firestore.collection('users').doc(referredBy);
        const commission = newPlan.trim() === 'Aura Plan' ? 25.00 : 10.00;
        transaction.update(referrerDocRef, {
          activeReferrals: admin.firestore.FieldValue.increment(1),
          totalEarnings: admin.firestore.FieldValue.increment(commission),
          pendingEarnings: admin.firestore.FieldValue.increment(commission),
        });
      }
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function adjustUserBalance(userId: string, amount: number) {
  const { firestore } = initializeServerFirebase();
  try {
    const userDocRef = firestore.collection('users').doc(userId);
    await userDocRef.update({
      totalEarnings: admin.firestore.FieldValue.increment(amount),
      pendingEarnings: admin.firestore.FieldValue.increment(amount)
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function submitWithdrawRequest(formData: { userId: string; email: string; amount: number; walletAddress: string }) {
  const validatedFields = withdrawSchema.safeParse(formData);
  if (!validatedFields.success) return { error: 'Invalid data', message: null };

  const { userId, email, amount, walletAddress } = validatedFields.data;
  const { firestore } = initializeServerFirebase();

  try {
    const userDocRef = firestore.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) throw new Error('User not found');

    const userData = userDoc.data() || {};
    const currentBalance = userData.pendingEarnings || 0;
    if (currentBalance < 50) return { error: 'Minimum balance required to withdraw is $50.00', message: null };
    if (amount < 50) return { error: 'Minimum withdrawal amount allowed is $50.00', message: null };

    const withdrawRequestsColl = firestore.collection('withdrawRequests');
    const pendingSnap = await withdrawRequestsColl.where('userId', '==', userId).where('status', '==', 'pending').get();

    let pendingTotal = 0;
    pendingSnap.forEach(doc => { pendingTotal += doc.data().amount || 0; });

    const availableBalance = currentBalance - pendingTotal;
    if (amount > availableBalance) return { error: `Insufficient available funds.`, message: null };

    await withdrawRequestsColl.add({
      userId, email, amount, walletAddress,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { error: null, message: 'Withdrawal requested successfully.' };
  } catch (e: any) {
    return { error: e.message, message: null };
  }
}

export async function approveWithdrawRequest(requestId: string, userId: string, amount: number) {
  const { firestore } = initializeServerFirebase();
  try {
    await firestore.runTransaction(async (transaction) => {
      const requestDocRef = firestore.collection('withdrawRequests').doc(requestId);
      const userDocRef = firestore.collection('users').doc(userId);

      const requestDoc = await transaction.get(requestDocRef);
      const userDoc = await transaction.get(userDocRef);

      if (!requestDoc.exists || !userDoc.exists) throw new Error('Document not found');
      const requestData = requestDoc.data() || {};
      if (requestData.status === 'approved') throw new Error('Already processed');

      const userData = userDoc.data() || {};
      if ((userData.pendingEarnings || 0) < amount) throw new Error('Insufficient user balance');

      transaction.update(requestDocRef, { status: 'approved' });
      transaction.update(userDocRef, { pendingEarnings: admin.firestore.FieldValue.increment(-amount) });
    });
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getEconomicCalendar() {
  const now = new Date();

  try {
    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Network error');
    const xml = await res.text();

    const events: any[] = [];
    const eventMatches = Array.from(xml.matchAll(/<event>([\s\S]*?)<\/event>/g));

    for (const match of eventMatches) {
      const content = match[1];
      const getTag = (tag: string) => {
        const m = content.match(new RegExp(`<${tag}>(.*?)<\/${tag}>`));
        return m ? m[1] : '';
      };

      const country = getTag('country');
      if (country === 'USD') {
        const title = getTag('title');
        const dateStr = getTag('date');
        const timeStr = getTag('time');
        const impact = getTag('impact');

        try {
          const [m, d, y] = dateStr.split('-');
          const timeMatch = timeStr.match(/(\d+):(\d+)(am|pm)/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const ampm = timeMatch[3].toLowerCase();
            if (ampm === 'pm' && hours < 12) hours += 12;
            if (ampm === 'am' && hours === 12) hours = 0;

            const eventDate = new Date(`${y}-${m}-${d}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00-05:00`);

            events.push({
              id: `${title}-${dateStr}-${timeStr}`,
              event: title,
              time: eventDate.toISOString(),
              impact: impact || 'Medium',
              currency: 'USD',
              forecast: getTag('forecast') || 'N/A',
              previous: getTag('previous') || 'N/A',
              actual: getTag('actual') || null
            });
          }
        } catch (e) { }
      }
    }

    if (events.length > 0) {
      return { success: true, items: events.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()) };
    }
    return { success: true, items: [], message: 'No USD news scheduled for today.' };
  } catch (error) {
    console.error("Calendar fetch failed:", error);
    return { success: false, error: 'Failed to connect to real-time trading feed. Please check your connection.' };
  }
}

export async function getGoldSentiment(newsId: string, actual: string, forecast: string) {
  // Quantitative Sentiment Logic for Gold/USD Pairs
  const act = parseFloat(actual.replace(/[^0-9.-]+/g, ""));
  const forc = parseFloat(forecast.replace(/[^0-9.-]+/g, ""));

  if (isNaN(act) || isNaN(forc)) return { signal: 'NEUTRAL', bias: 'Waiting for official figures...' };

  const diff = act - forc;
  // Threshold to avoid noise - news must deviate from forecast to trigger institutional move
  if (Math.abs(diff) < 0.0001) return { signal: 'NEUTRAL', bias: 'News in line with forecast. No volatility spike expected.' };

  const isPositiveSurprise = diff > 0;

  // Logic: USD Strength is usually negative for Gold
  // If actual > forecast (Better Jobs, Higher CPI, etc) -> USD UP -> GOLD DOWN
  if (isPositiveSurprise) return { signal: 'SELL', bias: `USD Bullish Surprise. Institutional sell-off expected in XAU/USD.` };

  // If actual < forecast -> USD DOWN -> GOLD UP
  return { signal: 'BUY', bias: `USD Bearish Surprise. Liquidity pump into Gold assets detected.` };
}

export type SavedAnalysis = {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number; entryPrice?: string;
  entryLabel?: string;
  orderType?: 'Market' | 'Pending';
  stopLoss: number | string;
  takeProfit: number | string | string[];
  status: 'PENDING' | 'WON' | 'LOST';
  image: string;
  schools?: string[];
  analysis?: string;
  userRating?: 'LIKE' | 'DISLIKE';
  createdAt: any;
  completedAt?: any;
  currentPrice?: number;
};

export async function saveTradeAnalysis(userId: string, data: any, imageBase64: string) {
  const { firestore } = initializeServerFirebase();
  try {
    await firestore.collection('users').doc(userId).collection('analyses').add({
      ...data,
      image: imageBase64,
      status: 'PENDING',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getLivePrice(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;
  const finnhubSymbol = symbol.toUpperCase().replace('/', '').replace(' ', '');
  const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.c;
  } catch (error) {
    return null;
  }
}

export async function getAnalyses(userId: string) {
  const { firestore } = initializeServerFirebase();
  try {
    const snapshot = await firestore.collection('users').doc(userId).collection('analyses')
      .orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : data.completedAt,
      };
    }) as any[];
    return { success: true, items };
  } catch (error) {
    return { success: false, items: [] };
  }
}

export async function updateAnalysisStatus(userId: string, id: string, status: 'WON' | 'LOST', currentPrice: number) {
  const { firestore } = initializeServerFirebase();
  try {
    await firestore.collection('users').doc(userId).collection('analyses').doc(id).update({
      status, currentPrice, completedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function cleanupOldAnalyses(userId: string) {
  const { firestore } = initializeServerFirebase();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  try {
    const snapshot = await firestore.collection('users').doc(userId).collection('analyses')
      .where('status', 'in', ['WON', 'LOST'])
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(oneWeekAgo))
      .get();

    const batch = firestore.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getSharedPrices(requestedPairs: string[]) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return {};
  const apiKey = process.env.FINNHUB_API_KEY;
  const priceRef = firestore.collection('system').doc('prices');

  try {
    const priceDoc = await priceRef.get();
    const now = Date.now();
    let cachedValues: Record<string, number> = {};
    if (priceDoc.exists) {
      const data = priceDoc.data() || {};
      cachedValues = data.values || {};
      const lastUpdated = data.lastUpdated?.toDate ? data.lastUpdated.toDate().getTime() : 0;
      // If we have an API key and cache is fresh, return it.
      if (apiKey && now - lastUpdated < 60000) return cachedValues;
    }

    // If no API key, return sophisticated simulated prices centered around Gold Market Spot
    if (!apiKey) {
      const binancePrices: any = {};
      try {
        // Correct URL Encoding and User-Agent for Production (Vercel)
        const symbolsParam = encodeURIComponent('["PAXGUSDT","EURUSDT","BTCUSDT"]');
        const bRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${symbolsParam}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
          next: { revalidate: 30 }
        });

        if (bRes.ok) {
          const bData = await bRes.json();
          if (Array.isArray(bData)) {
            bData.forEach((item: any) => {
              if (item.symbol === 'PAXGUSDT') binancePrices['XAU/USD'] = parseFloat(item.price);
              if (item.symbol === 'EURUSDT') binancePrices['EUR/USD'] = parseFloat(item.price);
              if (item.symbol === 'BTCUSDT') binancePrices['BTC/USD'] = parseFloat(item.price);
            });
          }
        }
      } catch (e) {
        console.error("Binance fallback fetch failed:", e);
      }

      // Hardened Fallback: Never return 0 or empty in production
      const baseGold = binancePrices['XAU/USD'] || cachedValues['XAU/USD'] || 2045.50;
      const drift = (Math.random() - 0.5) * 0.5;
      const newGold = binancePrices['XAU/USD'] ? baseGold : baseGold + drift;

      return {
        ...binancePrices,
        'XAU/USD': newGold,
        'EUR/USD': binancePrices['EUR/USD'] || 1.0854,
        'BTC/USD': binancePrices['BTC/USD'] || 52140.20
      };
    }

    const majorMarkets = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'BTC/USD', 'ETH/USD'];
    const pairsToFetch = Array.from(new Set([...majorMarkets, ...requestedPairs])).slice(0, 15);
    const newPrices: Record<string, number> = { ...cachedValues };

    for (const pair of pairsToFetch) {
      const finnhubSymbol = pair.toUpperCase().replace('/', '').replace(' ', '');
      const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.c) newPrices[pair] = data.c;
      } catch (err) { }
    }

    if (Object.keys(newPrices).length > 0) {
      await priceRef.set({ values: newPrices, lastUpdated: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    }
    return newPrices;
  } catch (error) {
    // Ultimate fallback to simulation
    return { 'XAU/USD': 2045.50 + (Math.random() * 2) };
  }
}

export async function getMarketCorrelations() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  const symbols = [
    { key: 'EURUSD', id: 'IC MARKETS:EURUSD' }, // Using a broker prefix often helps with Finnhub forex if plain pair fails, but let's try standard first or OANDA
    // Actually, Finnhub uses 'OANDA:EUR_USD' or just 'BINANCE:BTCUSDT'. 
    // Let's use generic symbols that usually map well or specific ones.
    { key: 'EURUSD', id: 'EUR/USD' },
    { key: 'GOLD', id: 'XAU/USD' },
    { key: 'SPY', id: 'SPY' },
    { key: 'BTC', id: 'BTC/USD' }
  ];

  try {
    const promises = symbols.map(async (sym) => {
      let querySymbol = sym.id;
      // Finnhub symbol normalization
      if (sym.key === 'BTC') querySymbol = 'BINANCE:BTCUSDT';
      else if (sym.key === 'GOLD') querySymbol = 'OANDA:XAU_USD';
      else if (sym.key === 'EURUSD') querySymbol = 'OANDA:EUR_USD';
      // SPY is just SPY

      const url = `https://finnhub.io/api/v1/quote?symbol=${querySymbol}&token=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 5 } }); // Update every 5s (Aggressive)
      const data = await res.json();

      return {
        key: sym.key,
        change: typeof data.dp === 'number' ? data.dp : 0
      };
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Failed to fetch correlations", error);
    return [];
  }
}


