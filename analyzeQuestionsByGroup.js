const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("❌ Please provide a JSON file path.");
  console.error("Usage: node analyzeQuestionsByGroup.js ./output/MegaQuestionBank_I-II.json");
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(path.resolve(filePath), "utf-8");
  const data = JSON.parse(rawData);

  if (!Array.isArray(data)) {
    throw new Error("The JSON root must be an array of questions.");
  }

  const counts = {
    module: {},
    moduleCategory: {},
    moduleCategoryDifficulty: {}
  };

  data.forEach(q => {
    const { module, category, difficulty } = q;

    // Count by module
    counts.module[module] = (counts.module[module] || 0) + 1;

    // Count by module + category
    const mcKey = `${module} > ${category}`;
    counts.moduleCategory[mcKey] = (counts.moduleCategory[mcKey] || 0) + 1;

    // Count by module + category + difficulty
    const mcdKey = `${module} > ${category} > ${difficulty}`;
    counts.moduleCategoryDifficulty[mcdKey] = (counts.moduleCategoryDifficulty[mcdKey] || 0) + 1;
  });

  // Output results
  console.log(`✅ Total Questions: ${data.length}\n`);

  console.log("📘 Questions per Module:");
  Object.entries(counts.module).forEach(([mod, count]) => {
    console.log(`  ${mod}: ${count}`);
  });

  console.log("\n📗 Questions per Module + Category:");
  Object.entries(counts.moduleCategory).forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`);
  });

  console.log("\n📙 Questions per Module + Category + Difficulty:");
  Object.entries(counts.moduleCategoryDifficulty).forEach(([key, count]) => {
    console.log(`  ${key}: ${count}`);
  });

} catch (err) {
  console.error("❌ Error:", err.message);
}
