const fs = require('fs');

const data = require('./ListenAndMatchGameData.json');

const structuredWords = {};

// Use your actual root key
const rootKey = 'ListenAndMatchGameData';

for (const group in data[rootKey]) {
  if (!structuredWords[group]) structuredWords[group] = {};
  for (const level in data[rootKey][group]) {
    if (!structuredWords[group][level]) structuredWords[group][level] = {};
    for (const category in data[rootKey][group][level]) {
      const items = data[rootKey][group][level][category];
      if (!Array.isArray(items)) continue;

      // Just extract answer / word
      structuredWords[group][level][category] = items
        .map(item => item.answer || '')
        .filter(word => word); // skip empty
    }
  }
}

// Write JSON version
fs.writeFileSync(
  './ListenAndMatch_WordStructure.json',
  JSON.stringify(structuredWords, null, 2)
);

// Write JS export version
const exportJS = `export const ListenAndMatch_WordStructure = ${JSON.stringify(structuredWords, null, 2)};`;
fs.writeFileSync('./ListenAndMatch_WordStructure.js', exportJS);

console.log('✅ Structured word bank saved as JSON & JS export!');
