const fs = require("fs");
const path = require("path");
const JSON5 = require("json5");

const SOURCE_DIR = "./DWMSChallenges";
const OUTPUT_DIR = "./output";

const defaultUsage = {
  learn: true,
  practice: true,
  test: true,
  battle: true,
  challenge: true,
  competition: true
};

const classGroups = {
  "Class I-II": "I-II",
  "Class I/II": "I-II",
  "Class III-V": "III-V",
  "Class VI-X": "VI-X"
};

const idCounters = {};

function getCounter(classGroup, module, category, difficulty) {
  idCounters[classGroup] ??= {};
  idCounters[classGroup][module] ??= {};
  idCounters[classGroup][module][category] ??= {};
  idCounters[classGroup][module][category][difficulty] ??= 0;

  return ++idCounters[classGroup][module][category][difficulty];
}

function normalizeQuestion(q, educator) {
  const rawGroup = q.classGroup || "Class I-II";
  const classGroup = classGroups[rawGroup] || "I-II";
  const module = q.module || "Spelling";
  const category = (q.category || "Dictation").replace(/ /g, "");
  const difficulty = q.difficultyLevel || "Rookie";
  const counter = getCounter(classGroup, module, category, difficulty);
  const questionId = `${classGroup}_${module}_${category}_${difficulty}_${String(counter).padStart(5, "0")}`;
  const now = new Date().toISOString();

  return {
    questionId,
    questionText: q.questionText || "",
    questionType: q.questionType || "text",
    questionFormat: q.questionFormat || "multiple-choice",
    answerType: "text",
    options: q.options || [],
    shuffleOptions: q.shuffleOptions !== false,
    correctAnswer: q.correctAnswer || "",
    hint: q.hint || "",
    explanation: q.explanation || "",
    mediaType: q.mediaType || "text",
    mediaUrl: q.mediaUrl || null,
    points: q.points || 10,
    difficulty,
    module,
    category,
    usage: defaultUsage,
    educatorId: educator,
    createdAt: now,
    lastUpdatedAt: [now]
  };
}

function processAll() {
  const files = fs.readdirSync(SOURCE_DIR);
  const grouped = { "I-II": [], "III-V": [], "VI-X": [] };

  files.forEach((filename) => {
    if (filename.endsWith(".txt")) {
      const educator = path.basename(filename).split("_").pop().replace(".txt", "").toLowerCase();
      const content = fs.readFileSync(path.join(SOURCE_DIR, filename), "utf-8");
      let parsed;

      try {
        parsed = JSON5.parse(content);
      } catch (err) {
        console.error(`❌ Error parsing ${filename}:`, err.message);
        return;
      }

      const questions = parsed.dailyChallenges || parsed;

      questions.forEach((q) => {
        const normalized = normalizeQuestion(q, educator);
        const group = normalized.questionId.split("_")[0];
        grouped[group]?.push(normalized);
      });
    }
  });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  Object.entries(grouped).forEach(([group, questions]) => {
    const filePath = path.join(OUTPUT_DIR, `MegaQuestionBank_${group}.json`);
    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf-8");
    console.log(`✅ Saved ${questions.length} questions → ${filePath}`);
  });
}

processAll();
