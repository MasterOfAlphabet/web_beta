/**
 * ✅ FINAL SCRIPT: Upload DWMSChallenges with per-category numbering
 * Firestore path: MoAChallenges > DWMSChallenges > [each question as doc]
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// ✅ Load Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Load your JSON data
const filePath = path.join(__dirname, "DWMSChallenges_Spelling.json");
const rawData = fs.readFileSync(filePath);
const questions = JSON.parse(rawData);

// ✅ Top-level Firestore collection
const challengesCollection = db.collection("MoAChallenges").doc("DWMSChallenges").collection("Questions");

// ✅ Counters for each category
const categoryCounters = {};

(async () => {
  console.log(`🚀 Uploading ${questions.length} DWMSChallenges with per-category IDs...`);

  for (const q of questions) {
    const moduleName = "Spelling";
    const category = q.category || "General";

    // Start category counter at 1 if new
    if (!categoryCounters[category]) {
      categoryCounters[category] = 1;
    }

    // Build unique ID
    const id = `${moduleName}_${category}_${categoryCounters[category]}`;

    const docData = {
      ...q,
      id: id,
      moduleName: moduleName,
      isPublished: false,
      datePublished: [],
      challengeTypesUsed: [],
      publishedCount: 0,
    };

    try {
      await challengesCollection.doc(id).set(docData);
      console.log(`✅ Uploaded: ${id}`);
    } catch (err) {
      console.error(`❌ Failed: ${id}`, err);
    }

    // Increment the category counter
    categoryCounters[category]++;
  }

  console.log("✅ All new DWMSChallenges uploaded with correct IDs!");
  process.exit(0);
})();
