'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateTradeSignals, type GenerateTradeSignalsOutput, type TradeSignal as AITradeSignal } from '@/ai/flows/generate-trade-signals';
import { initializeServerFirebase } from '@/firebase/server-init';
import { getFirestore, doc, getDoc, updateDoc, setDoc, serverTimestamp, runTransaction, collection, addDoc, Timestamp, query, where, getDocs, increment, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Parser from 'rss-parser';

export type TradeSignal = AITradeSignal;

export async function signOut() {
  // This is a placeholder. Client-side will handle actual sign out.
  redirect('/auth');
}

export type AnalysisFormState = {
  data: GenerateTradeSignalsOutput | null;
  error: string | null;
  message: string | null;
  chartImage?: string; // Main chart image
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

    return {
      data: null,
      error: errorMessage,
      message: null,
    };
  }

  const { chartDataLarge, chartDataSmall, userId: validUserId, userLang: validUserLang, analysisSchools: validAnalysisSchools } = validatedFields.data;

  const { firestore } = initializeServerFirebase();
  if (!firestore) {
    return { data: null, error: 'Database service is not available.', message: null };
  }

  const userDocRef = doc(firestore, 'users', validUserId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found.');
      }

      const userData = userDoc.data();
      const plan = userData.plan || 'Free';
      const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];
      let analysisCount = userData.analysisCount || 0;
      const lastAnalysisDate = userData.lastAnalysisDate;
      const now = new Date();

      if (plan !== 'Aura Plan') {
        const lastAnalysisDay = lastAnalysisDate ? new Date(lastAnalysisDate.seconds * 1000) : null;

        const isNewDay = !lastAnalysisDay ||
          (lastAnalysisDay.getUTCFullYear() !== now.getUTCFullYear() ||
            lastAnalysisDay.getUTCMonth() !== now.getUTCMonth() ||
            lastAnalysisDay.getUTCDate() !== now.getUTCDate());

        if (isNewDay) {
          analysisCount = 0; // Reset count
        }

        if (analysisCount >= limit) {
          throw new Error(`limit:You have reached your daily limit of ${limit} analyses for the ${plan} plan. Please wait until tomorrow to get more.`);
        }
      }
    });
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('An unknown error occurred during validation.');
    if (error.message.startsWith('limit:')) {
      return { data: null, error: error.message.replace('limit:', ''), message: null };
    }
    console.error("User validation transaction failed:", error);
    return { data: null, error: "Failed to validate user session. Please try again.", message: null };
  }

  try {
    const input: {
      chartDataLarge: string;
      chartDataSmall?: string;
      language: 'en' | 'ar' | 'es';
      analysisSchools?: string[];
    } = { chartDataLarge, language: validUserLang, analysisSchools: validAnalysisSchools };

    if (chartDataSmall) {
      input.chartDataSmall = chartDataSmall;
    }

    const result = await generateTradeSignals(input);

    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found while trying to update count.');
      }
      const userData = userDoc.data();
      const plan = userData.plan || 'Free';

      if (plan !== 'Aura Plan') {
        let analysisCount = userData.analysisCount || 0;
        const lastAnalysisDate = userData.lastAnalysisDate;
        const now = new Date();
        const lastAnalysisDay = lastAnalysisDate ? new Date(lastAnalysisDate.seconds * 1000) : null;
        const isNewDay = !lastAnalysisDay || (lastAnalysisDay.getUTCFullYear() !== now.getUTCFullYear() || lastAnalysisDay.getUTCMonth() !== now.getUTCMonth() || lastAnalysisDay.getUTCDate() !== now.getUTCDate());
        const newCount = isNewDay ? 1 : analysisCount + 1;

        transaction.update(userDocRef, {
          analysisCount: newCount,
          lastAnalysisDate: serverTimestamp(),
          preferredAnalysisSchools: validAnalysisSchools
        });
      }
    });

    return { data: result, error: null, message: 'Analysis successful.', chartImage: chartDataLarge };

  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('An unknown error occurred during AI generation.');
    console.error(`AI analysis failed: ${error.message}`);

    return { data: null, error: `Analysis failed: ${error.message}`, message: null };
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
  if (!firestore) {
    return { error: 'Database service is not available.', message: null };
  }

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
    const requestsCollection = collection(firestore, 'activationRequests');

    const q = query(requestsCollection, where("userId", "==", userId), where("status", "==", "pending"));
    const existingRequests = await getDocs(q);

    if (!existingRequests.empty) {
      return { error: "You already have a pending activation request. Please wait for it to be processed.", message: null };
    }

    await addDoc(requestsCollection, {
      userId,
      email,
      transactionId,
      screenshotDataUrl,
      planName,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { error: null, message: 'Your request has been submitted successfully.' };

  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error("Activation Request Error:", error);
    return { error: `Submission failed: ${error}`, message: null };
  }
}

export async function approveActivationRequest(requestId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { success: false, error: 'Database not available' };

  const requestDocRef = doc(firestore, 'activationRequests', requestId);
  const userDocRef = doc(firestore, 'users', userId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const requestDoc = await transaction.get(requestDocRef);
      const userDoc = await transaction.get(userDocRef);

      if (!requestDoc.exists() || !userDoc.exists()) {
        throw new Error('User or request document not found.');
      }

      const requestData = requestDoc.data();
      if (requestData.status === 'approved') {
        throw new Error('This request has already been approved.');
      }

      const userData = userDoc.data();
      const planName = requestData.planName || 'Premium';
      const referredBy = userData.referredBy;

      let referrerDoc = null;
      if (referredBy) {
        const referrerDocRef = doc(firestore, 'users', referredBy);
        referrerDoc = await transaction.get(referrerDocRef);
      }

      const startDate = Timestamp.now();
      const endDate = new Timestamp(startDate.seconds + 30 * 24 * 60 * 60, startDate.nanoseconds);

      // --- ALL WRITES START HERE ---

      transaction.update(userDocRef, {
        plan: planName,
        analysisCount: 0,
        lastAnalysisDate: null,
        planStartDate: startDate,
        planEndDate: endDate,
        learningProgress: userData.learningProgress || {},
      });

      if (referrerDoc && referrerDoc.exists()) {
        const normalizedPlan = planName.trim();
        const commission = normalizedPlan === 'Aura Plan' ? 25.00 : 10.00;

        console.log(`[Approve] Awarding $${commission} to referrer ${referredBy}`);

        transaction.update(referrerDoc.ref, {
          activeReferrals: increment(1),
          totalEarnings: increment(commission),
          pendingEarnings: increment(commission),
        });
      }

      transaction.update(requestDocRef, {
        status: 'approved',
      });
    });
    return { success: true };
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error };
  }
}

export async function updateUserPlan(userId: string, newPlan: 'Free' | 'Premium' | 'Aura Plan') {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { success: false, error: 'Database not available' };

  const userDocRef = doc(firestore, 'users', userId);

  try {
    await runTransaction(firestore, async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists()) {
        throw new Error('User not found.');
      }

      const userData = userDoc.data();
      const referredBy = userData.referredBy;

      let referrerDoc = null;
      if (userData.plan === 'Free' && newPlan !== 'Free' && referredBy) {
        const referrerDocRef = doc(firestore, 'users', referredBy);
        referrerDoc = await transaction.get(referrerDocRef);
      }

      // Determine dates
      let planStartDate = null;
      let planEndDate = null;

      if (newPlan !== 'Free') {
        const startDate = Timestamp.now();
        const duration = 30 * 24 * 60 * 60; // 30 days
        const endDate = new Timestamp(startDate.seconds + duration, startDate.nanoseconds);
        planStartDate = startDate;
        planEndDate = endDate;
      }

      // --- ALL WRITES START HERE ---

      // Update User
      transaction.update(userDocRef, {
        plan: newPlan,
        analysisCount: 0,
        lastAnalysisDate: null,
        planStartDate,
        planEndDate,
      });

      // Affiliate Commission logic (only if upgrading from Free to something paid)
      if (referrerDoc && referrerDoc.exists()) {
        const normalizedPlan = newPlan.trim();
        const commission = normalizedPlan === 'Aura Plan' ? 25.00 : 10.00;

        console.log(`[ManualUpdate] Awarding $${commission} to referrer ${referredBy}`);

        transaction.update(referrerDoc.ref, {
          activeReferrals: increment(1),
          totalEarnings: increment(commission),
          pendingEarnings: increment(commission),
        });
      }
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function submitWithdrawRequest(formData: { userId: string; email: string; amount: number; walletAddress: string }) {
  const validatedFields = withdrawSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.amount?.[0] || 'Invalid data', message: null };
  }

  const { userId, email, amount, walletAddress } = validatedFields.data;
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { error: 'Database unavailable', message: null };

  try {
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) throw new Error('User not found');
    const userData = userDoc.data();
    const currentBalance = userData.pendingEarnings || 0;

    // 1. Check if the current total balance is at least $50
    if (currentBalance < 50) {
      return { error: 'Minimum balance required to withdraw is $50.00', message: null };
    }

    // 2. Check if the requested amount is at least $50
    if (amount < 50) {
      return { error: 'Minimum withdrawal amount allowed is $50.00', message: null };
    }

    // 3. Calculate already reserved (pending) funds
    const withdrawRequestsRef = collection(firestore, 'withdrawRequests');
    const q = query(withdrawRequestsRef, where('userId', '==', userId), where('status', '==', 'pending'));
    const pendingSnap = await getDocs(q);

    let pendingTotal = 0;
    pendingSnap.forEach(doc => {
      pendingTotal += doc.data().amount || 0;
    });

    const availableBalance = currentBalance - pendingTotal;

    // 4. Check if the requested amount exceeds the available balance
    if (amount > availableBalance) {
      return {
        error: `Insufficient available funds. Your current balance is $${currentBalance.toFixed(2)}, but you have $${pendingTotal.toFixed(2)} in pending requests.`,
        message: null
      };
    }

    await addDoc(withdrawRequestsRef, {
      userId,
      email,
      amount,
      walletAddress,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { error: null, message: 'Withdrawal requested successfully.' };
  } catch (e: any) {
    return { error: e.message, message: null };
  }
}

export async function approveWithdrawRequest(requestId: string, userId: string, amount: number) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { success: false, error: 'Database unavailable' };

  try {
    await runTransaction(firestore, async (transaction) => {
      const requestDocRef = doc(firestore, 'withdrawRequests', requestId);
      const userDocRef = doc(firestore, 'users', userId);

      const requestDoc = await transaction.get(requestDocRef);
      const userDoc = await transaction.get(userDocRef);

      if (!requestDoc.exists() || !userDoc.exists()) {
        throw new Error('Document not found');
      }

      const requestData = requestDoc.data();
      if (requestData.status === 'approved') {
        throw new Error('This withdrawal has already been processed.');
      }

      const userData = userDoc.data();
      const currentPending = userData.pendingEarnings || 0;

      if (currentPending < amount) {
        throw new Error('Insufficient user balance for this approval');
      }

      transaction.update(requestDocRef, { status: 'approved' });
      transaction.update(userDocRef, {
        pendingEarnings: increment(-amount)
      });
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getNews(lang: 'en' | 'ar' | 'es') {
  const parser = new Parser();
  // DailyForex doesn't seem to have a specific Spanish RSS easily accessible in the same format, 
  // so we'll fallback to English for Spanish or use another source if available.
  const feedUrl = lang === 'ar'
    ? 'https://arab.dailyforex.com/rss/arab/forexnews.xml'
    : 'https://www.dailyforex.com/rss/forexnews.xml';

  try {
    const feed = await parser.parseURL(feedUrl);
    return {
      success: true,
      items: feed.items.map(item => {
        // Aggressive image extraction
        let imageUrl = '';

        // 1. Check enclosure
        if (item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        }

        // 2. Check media:content (common in professional feeds)
        if (!imageUrl && (item as any)['media:content']?.['$']?.url) {
          imageUrl = (item as any)['media:content']['$'].url;
        }

        // 3. Fallback to regex on content/description
        const contentString = (item.content || '') + (item.description || '') + (item as any)['content:encoded'] || '';
        if (!imageUrl && contentString) {
          const imgMatch = contentString.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) imageUrl = imgMatch[1];
        }

        return {
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          contentSnippet: item.contentSnippet || '',
          isoDate: item.isoDate || '',
          imageUrl: imageUrl,
        };
      })
    };
  } catch (error) {
    console.error('RSS Fetch error:', error);
    return { success: false, error: 'Failed to fetch news feed.' };
  }
}

export type SavedAnalysis = {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  status: 'PENDING' | 'WON' | 'LOST';
  image: string; // Base64
  createdAt: Timestamp;
  completedAt?: Timestamp;
  currentPrice?: number;
};

export async function saveTradeAnalysis(userId: string, data: any, imageBase64: string) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { success: false };

  try {
    const analysisRef = collection(firestore, 'users', userId, 'analyses');
    await addDoc(analysisRef, {
      ...data,
      image: imageBase64,
      status: 'PENDING',
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Save analysis error:", error);
    return { success: false };
  }
}

export async function getLivePrice(symbol: string) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  // Map to Finnhub symbols (e.g., Gold is XAUUSD)
  const finnhubSymbol = symbol.toUpperCase().replace('/', '').replace(' ', '');
  const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.c; // Current price
  } catch (error) {
    console.error("Finnhub error:", error);
    return null;
  }
}

export async function getAnalyses(userId: string) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { success: false, items: [] };

  try {
    const q = query(
      collection(firestore, 'users', userId, 'analyses'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toJSON ? data.createdAt.toJSON() : data.createdAt,
        completedAt: data.completedAt?.toJSON ? data.completedAt.toJSON() : data.completedAt,
      };
    }) as SavedAnalysis[];

    return { success: true, items };
  } catch (error) {
    console.error("Get analyses error:", error);
    return { success: false, items: [] };
  }
}

export async function updateAnalysisStatus(userId: string, id: string, status: 'WON' | 'LOST', currentPrice: number) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return { success: false };

  try {
    const docRef = doc(firestore, 'users', userId, 'analyses', id);
    await updateDoc(docRef, {
      status,
      currentPrice,
      completedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Update analysis error:", error);
    return { success: false };
  }
}

export async function cleanupOldAnalyses(userId: string) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const q = query(
      collection(firestore, 'users', userId, 'analyses'),
      where('status', 'in', ['WON', 'LOST']),
      where('createdAt', '<', Timestamp.fromDate(oneWeekAgo))
    );

    const snapshot = await getDocs(q);
    const batch = runTransaction(firestore, async (transaction) => {
      snapshot.forEach((doc) => {
        transaction.delete(doc.ref);
      });
    });
    return { success: true };
  } catch (error) {
    console.error("Cleanup error:", error);
    return { success: false };
  }
}

export async function getSharedPrices(requestedPairs: string[]) {
  const { firestore } = initializeServerFirebase();
  if (!firestore) return {};

  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return {};

  const priceRef = doc(firestore, 'system', 'prices');

  try {
    // 1. Try to get cached prices
    const priceDoc = await getDoc(priceRef);
    const now = Date.now();
    let cachedValues: Record<string, number> = {};

    if (priceDoc.exists()) {
      const data = priceDoc.data();
      cachedValues = data.values || {};
      const lastUpdated = data.lastUpdated?.toMillis() || 0;

      // If prices are less than 60 seconds old, return cached data
      if (now - lastUpdated < 60000) {
        return cachedValues;
      }
    }

    // 2. Prices are stale or don't exist, fetch fresh data for top markets
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
      } catch (err) {
        console.error(`Error fetching ${pair}:`, err);
      }
      if (pairsToFetch.length > 5) await new Promise(r => setTimeout(r, 100));
    }

    // 3. Update the global cache for everyone
    if (Object.keys(newPrices).length > 0) {
      await setDoc(priceRef, {
        values: newPrices,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    }

    return newPrices;
  } catch (error) {
    console.error("Shared price error:", error);
    return {};
  }
}
