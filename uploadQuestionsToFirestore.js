const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// 🔐 Load credentials
const serviceAccount = require("./serviceAccountKey.json");

// 🧠 Initialize Firestore
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// === CONFIGURATION ===
const inputFolder = "./output"; // where the MegaQuestionBank JSONs are
const files = [
  "MegaQuestionBank_I-II.json",
  "MegaQuestionBank_III-V.json",
  "MegaQuestionBank_VI-X.json"
];

async function uploadQuestionsFromFile(fileName) {
  const classGroup = fileName.split("_")[1].replace(".json", "");
  const collectionName = `mega_question_bank_${classGroup}`;
  const filePath = path.join(inputFolder, fileName);

  console.log(`\n📂 Processing ${fileName} into collection: ${collectionName}`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  let questions = [];
  try {
    questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`❌ Failed to parse ${fileName}: ${err.message}`);
    return;
  }

  const batch = db.batch();
  const collectionRef = db.collection(collectionName);
  let count = 0;

  for (const q of questions) {
    const docRef = collectionRef.doc(q.questionId);
    batch.set(docRef, q, { merge: true }); // ✅ append/update only
    count++;

    if (count % 500 === 0) {
      console.log(`🚚 Uploading batch of 500...`);
      await batch.commit();
    }
  }

  console.log(`🚀 Committing final batch (${count})...`);
  await batch.commit();

  console.log(`✅ Uploaded ${count} questions to "${collectionName}"`);
}

async function main() {
  console.log("🧠 Starting Firestore Question Uploader");

  for (const file of files) {
    await uploadQuestionsFromFile(file);
  }

  console.log("🎉 All done.");
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
});
