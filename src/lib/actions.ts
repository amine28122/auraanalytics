'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { generateTradeSignals, type GenerateTradeSignalsOutput, type TradeSignal as AITradeSignal } from '@/ai/flows/generate-trade-signals';
import { initializeServerFirebase } from '@/firebase/server-init';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp, runTransaction, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

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
        });
      }
    });
    
    return { data: result, error: null, message: 'Analysis successful.', chartImage: chartDataLarge };

  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error('An unknown error occurred during AI generation.');
    console.error(`AI analysis failed: ${error.message}`);
    
    return { data: null, error: `Analysis failed: The service is currently overloaded. Please try again in a moment.`, message: null };
  }
}


const activationRequestSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  transactionId: z.string().min(5, 'Transaction ID is too short.'),
  screenshotDataUrl: z.string().refine(data => data.startsWith('data:image/'), { message: 'Invalid screenshot format.' }),
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
  });

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.flatten().fieldErrors.transactionId?.[0] 
      || validatedFields.error.flatten().fieldErrors.screenshotDataUrl?.[0]
      || 'Invalid data submitted.';
    return { error: errorMessage, message: null };
  }
  
  const { userId, email, transactionId, screenshotDataUrl } = validatedFields.data;

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
      
      const startDate = Timestamp.now();
      const endDate = new Timestamp(startDate.seconds + 30 * 24 * 60 * 60, startDate.nanoseconds);

      transaction.update(userDocRef, {
        plan: 'Premium',
        analysisCount: 0,
        lastAnalysisDate: null,
        planStartDate: startDate,
        planEndDate: endDate,
        learningProgress: userDoc.data().learningProgress || {},
      });

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
