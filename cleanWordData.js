const fs = require('fs');
const readline = require('readline');
const { stringify } = require('csv-stringify');

// Setup user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main function
async function cleanWordData() {
  try {
    const data = fs.readFileSync('WordOfTheDayData.json', 'utf8');
    const wordData = JSON.parse(data);
    const duplicatesFound = {};
    let totalDuplicates = 0;
    const csvRows = [['Word', 'Class Group', 'Difficulty', 'Category', 'Action Taken']];

    // Process each class group
    for (const classGroup in wordData) {
      const uniqueWords = new Map();
      const cleanedEntries = [];
      let groupDuplicates = 0;

      for (const wordObj of wordData[classGroup]) {
        const lowerWord = wordObj.word.toLowerCase();
        
        if (uniqueWords.has(lowerWord)) {
          // Found duplicate
          totalDuplicates++;
          groupDuplicates++;
          
          if (!duplicatesFound[lowerWord]) {
            duplicatesFound[lowerWord] = [];
          }
          
          const existingEntry = uniqueWords.get(lowerWord);
          duplicatesFound[lowerWord].push({
            classGroup,
            difficulty: wordObj.difficultyLevel,
            category: wordObj.category,
            action: 'pending'
          });

          // Interactive prompt
          console.log(`\n⚠️  Duplicate found: "${wordObj.word}"`);
          console.log(`Existing (kept):`);
          console.log(`  - ${existingEntry.classGroup} (${existingEntry.difficulty}, ${existingEntry.category})`);
          console.log(`New (duplicate):`);
          console.log(`  - ${classGroup} (${wordObj.difficultyLevel}, ${wordObj.category})`);

          const answer = await askQuestion(
            `Choose action:\n` +
            `1. Keep existing\n` +
            `2. Replace with new\n` +
            `3. Merge metadata\n` +
            `Enter choice (1-3): `
          );

          let actionTaken;
          switch(answer) {
            case '2':
              // Replace with new entry
              const index = cleanedEntries.findIndex(w => w.word.toLowerCase() === lowerWord);
              cleanedEntries[index] = wordObj;
              actionTaken = 'Replaced with new entry';
              break;
            case '3':
              // Merge metadata (example: combine categories)
              const mergedEntry = uniqueWords.get(lowerWord);
              mergedEntry.category = `${mergedEntry.category}|${wordObj.category}`;
              if (wordObj.synonyms && !mergedEntry.synonyms.includes(wordObj.synonyms)) {
                mergedEntry.synonyms = `${mergedEntry.synonyms}, ${wordObj.synonyms}`;
              }
              actionTaken = 'Merged metadata';
              break;
            default:
              // Keep existing (default)
              actionTaken = 'Kept existing entry';
          }

          // Update CSV row
          csvRows.push([
            wordObj.word,
            classGroup,
            wordObj.difficultyLevel,
            wordObj.category,
            actionTaken
          ]);

        } else {
          // First occurrence
          uniqueWords.set(lowerWord, { ...wordObj, classGroup });
          cleanedEntries.push(wordObj);
        }
      }

      wordData[classGroup] = cleanedEntries;
      console.log(`\nRemoved ${groupDuplicates} duplicates from ${classGroup}`);
    }

    // Generate reports
    generateReports(wordData, duplicatesFound, totalDuplicates, csvRows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    rl.close();
  }
}

// Helper functions
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function generateReports(wordData, duplicatesFound, totalDuplicates, csvRows) {
  // 1. Console Report
  console.log('\n=== CLEANING REPORT ===');
  console.log(`Total duplicates processed: ${totalDuplicates}\n`);
  
  for (const [word, entries] of Object.entries(duplicatesFound)) {
    console.log(`"${word}" actions:`);
    entries.forEach(entry => {
      console.log(`  - ${entry.classGroup}: ${entry.action || 'kept existing'}`);
    });
  }

  // 2. Save cleaned JSON
  fs.writeFileSync(
    'WordOfTheDayData_Cleaned.json',
    JSON.stringify(wordData, null, 2)
  );

  // 3. Save CSV report
  stringify(csvRows, (err, csvOutput) => {
    fs.writeFileSync('duplicates_report.csv', csvOutput);
    console.log('\nCSV report saved: duplicates_report.csv');
  });

  // 4. Summary
  console.log('\n=== FINAL COUNTS ===');
  const originalData = JSON.parse(fs.readFileSync('WordOfTheDayData.json', 'utf8'));
  for (const classGroup in originalData) {
    console.log(
      `${classGroup}: ${originalData[classGroup].length} → ${wordData[classGroup].length} words`
    );
  }
}

// Run the script
cleanWordData();