const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const data = require('./DailyChallengesForSpelling.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportAsSingleDocument() {
  try {
    const docRef = db.collection('MoAChallenges').doc('DWMSChallenges');
    await docRef.set({ questions: data.questions });
    console.log('Successfully exported as single document!');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    admin.app().delete();
  }
}

exportAsSingleDocument();