import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { initializeServerFirebase } from '@/firebase/server-init';
import * as admin from 'firebase-admin';

/**
 * JVZoo IPN (Instant Payment Notification) Webhook
 * 
 * JVZoo sends a POST request to this URL when a purchase is made.
 * We verify the request is genuine using SHA1 hash, then activate the user's Premium plan.
 * 
 * IPN URL to set in JVZoo: https://www.auraanalyticspro.com/api/jvzoo
 */

// Verifies the JVZoo IPN hash to make sure it's a genuine request
function verifyJVZooIPN(params: Record<string, string>, secretKey: string): boolean {
  // JVZoo verification: SHA1 hash of (secretkey + cpemail + cporderid + cpprice + cpproduct)
  const stringToHash =
    secretKey +
    (params.cpemail || '') +
    (params.cporderid || '') +
    (params.cpprice || '') +
    (params.cpproduct || '');

  const computedHash = createHash('sha1').update(stringToHash).digest('hex').toUpperCase();
  const receivedHash = (params.cverify || '').toUpperCase();

  return computedHash === receivedHash;
}

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.JVZOO_SECRET_KEY;
    if (!secretKey || secretKey === 'YOUR_JVZOO_SECRET_KEY_HERE') {
      console.error('[JVZoo IPN] Secret key not configured in .env');
      return NextResponse.json({ error: 'Not configured' }, { status: 500 });
    }

    // Parse the form-encoded body from JVZoo
    const body = await request.text();
    const params: Record<string, string> = {};
    body.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });

    console.log('[JVZoo IPN] Received notification:', {
      transtype: params.transtype,
      email: params.cpemail,
      product: params.cpproduct,
      orderid: params.cporderid,
    });

    // 1. Verify the request is genuine from JVZoo
    const isValid = verifyJVZooIPN(params, secretKey);
    if (!isValid) {
      console.error('[JVZoo IPN] Hash verification FAILED. Possible fraud attempt.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // 2. Only process completed sales (not refunds, chargebacks, etc.)
    // transtype = 'SALE' for new sales, 'RFND' for refunds, 'CGBK' for chargebacks
    const transType = params.transtype || '';
    if (transType !== 'SALE') {
      console.log(`[JVZoo IPN] Ignoring non-sale transaction type: ${transType}`);
      return NextResponse.json({ message: 'Ignored non-sale event' }, { status: 200 });
    }

    const buyerEmail = params.cpemail;
    if (!buyerEmail) {
      console.error('[JVZoo IPN] No buyer email received.');
      return NextResponse.json({ error: 'No email' }, { status: 400 });
    }

    // 3. Find or create user in Firebase by email
    const { firestore, auth } = initializeServerFirebase();
    let userId: string | null = null;
    let userExists = false;

    try {
      const userRecord = await auth.getUserByEmail(buyerEmail);
      userId = userRecord.uid;
      userExists = true;
      console.log(`[JVZoo IPN] Found existing user: ${userId}`);
    } catch {
      // User doesn't have an account yet - log but don't fail
      // They will need to register on the site; we'll queue the activation
      console.log(`[JVZoo IPN] No existing user found for email: ${buyerEmail}. Will store pending activation.`);
    }

    const planName = 'Premium';
    const orderId = params.cporderid || '';
    const amount = params.cpprice || '0';
    const affiliateId = params.cpaffemail || null; // JVZoo affiliate email if applicable

    if (userExists && userId) {
      // Activate Premium for existing user
      const userDocRef = firestore.collection('users').doc(userId);

      await firestore.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists) throw new Error('User document not found');

        const userData = userDoc.data() || {};
        const startDate = admin.firestore.Timestamp.now();
        const endDate = new admin.firestore.Timestamp(
          startDate.seconds + 30 * 24 * 60 * 60, // 30 days
          startDate.nanoseconds
        );

        const referredBy = userData.referredBy;
        const shouldAwardCommission = referredBy && !userData.affiliateCommissionPaid;

        transaction.update(userDocRef, {
          plan: planName,
          analysisCount: 0,
          lastAnalysisDate: null,
          planStartDate: startDate,
          planEndDate: endDate,
          jvzooOrderId: orderId,
          affiliateCommissionPaid: shouldAwardCommission ? true : (userData.affiliateCommissionPaid || false),
        });

        // Award internal affiliate commission if user was referred via AURA's own affiliate system
        if (shouldAwardCommission) {
          const referrerDocRef = firestore.collection('users').doc(referredBy);
          const commission = 10.00; // $10 for Premium referral
          transaction.update(referrerDocRef, {
            activeReferrals: admin.firestore.FieldValue.increment(1),
            totalEarnings: admin.firestore.FieldValue.increment(commission),
            pendingEarnings: admin.firestore.FieldValue.increment(commission),
          });
        }
      });

      // Log the JVZoo sale
      await firestore.collection('jvzooSales').add({
        orderId,
        email: buyerEmail,
        userId,
        amount: parseFloat(amount) / 100, // JVZoo sends price in cents
        plan: planName,
        affiliateEmail: affiliateId,
        status: 'activated',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`[JVZoo IPN] ✅ Premium activated for user ${userId} (${buyerEmail})`);
    } else {
      // User not registered yet - store a pending JVZoo activation
      // When they register, we can check this collection and auto-activate
      await firestore.collection('jvzooSales').add({
        orderId,
        email: buyerEmail,
        userId: null,
        amount: parseFloat(amount) / 100,
        plan: planName,
        affiliateEmail: affiliateId,
        status: 'pending_registration', // Will be activated when user registers
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`[JVZoo IPN] ⏳ Sale logged as pending. User ${buyerEmail} needs to register.`);
    }

    // JVZoo expects a 200 OK response
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('[JVZoo IPN] Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET handler for testing that the endpoint is live
export async function GET() {
  return NextResponse.json({
    status: 'JVZoo IPN endpoint is active',
    url: 'https://www.auraanalyticspro.com/api/jvzoo',
    configured: !!process.env.JVZOO_SECRET_KEY && process.env.JVZOO_SECRET_KEY !== 'YOUR_JVZOO_SECRET_KEY_HERE',
  });
}
