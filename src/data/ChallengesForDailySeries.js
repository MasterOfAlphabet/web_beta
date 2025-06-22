// Save as verify-challenges.js
const fs = require('fs');

function countChallenges(modulesJson) {
  return modulesJson.modules.map(module => {
    const counts = {
      module: module.name,
      Rookie: module.levels.Rookie?.length || 0,
      Racer: module.levels.Racer?.length || 0,
      Master: module.levels.Master?.length || 0,
      Prodigy: module.levels.Prodigy?.length || 0,
      Wizard: module.levels.Wizard?.length || 0,
      get Total() { return this.Rookie + this.Racer + this.Master + this.Prodigy + this.Wizard; }
    };
    return counts;
  });
}

// Usage: 
// 1. Save your JSON as 'challenges.json'
// 2. Run: node verify-challenges.js
fs.readFile('ChallengesForDailySeries.json', 'utf8', (err, data) => {
  if (err) throw err;
  const results = countChallenges(JSON.parse(data));
  console.table(results);
  console.log('\nTOTALS VALIDATION:');
  console.table({
    'Total Challenges': results.reduce((sum, m) => sum + m.Total, 0),
    'Expected Modules': 8,
    'Actual Modules': results.length
  });
});