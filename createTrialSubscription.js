const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require("./serviceAccountKey.json"); // ← make sure this exists

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createTrialSubscriptionForUser(uid) {
  if (!uid) {
    console.error("❌ You must provide a user UID.");
    return;
  }

  const subscriptionRef = db.doc(`students/${uid}/subscription/current`);

  const subscriptionDoc = {
    subscriptionType: "trial",
    subscriptionStatus: "active",
    startDate: admin.firestore.FieldValue.serverTimestamp(),
    endDate: null,
    promotionalOfferUsed: false,
    promoCodeUsed: null,
    signupSource: "manual-script",
    paymentVerified: false,
    transactionId: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    await subscriptionRef.set(subscriptionDoc);
    console.log(`✅ Subscription record created for UID: ${uid}`);
  } catch (err) {
    console.error("❌ Failed to create subscription:", err.message);
  }
}

// Replace this with the real user UID
const uid = "JbViAySjfRTUdpek492GO5BRat82";

createTrialSubscriptionForUser(uid);
