const fs = require('fs');
const { emojiMap } = require('./EmojiMap.js');

function updateGameDataEmojis(gameData) {
  const updatedData = JSON.parse(JSON.stringify(gameData));

  for (const gradeLevel in updatedData.ListenAndMatchGameData) {
    for (const difficulty in updatedData.ListenAndMatchGameData[gradeLevel]) {
      for (const category in updatedData.ListenAndMatchGameData[gradeLevel][difficulty]) {
        const items = updatedData.ListenAndMatchGameData[gradeLevel][difficulty][category];
        
        items.forEach(item => {
          let foundEmoji = null;
          
          if (emojiMap[item.name.toLowerCase()]) {
            foundEmoji = emojiMap[item.name.toLowerCase()];
          }
          else if (item.answer && emojiMap[item.answer.toLowerCase()]) {
            foundEmoji = emojiMap[item.answer.toLowerCase()];
          }
          else if (emojiMap[category.toLowerCase()]) {
            foundEmoji = emojiMap[category.toLowerCase()];
          }
          else {
            const words = item.name.toLowerCase().split(/\s+/);
            for (const word of words) {
              if (emojiMap[word]) {
                foundEmoji = emojiMap[word];
                break;
              }
            }
          }
          
          item.emoji = foundEmoji || item.emoji || '❓';
        });
      }
    }
  }

  return updatedData;
}

// Main execution
try {
  // 1. Read input file
  const rawData = fs.readFileSync('ListenAndMatchGameData.json', 'utf8');
  const gameData = JSON.parse(rawData);

  // 2. Process the data
  const updatedData = updateGameDataEmojis(gameData);

  // 3. Save to new file
  fs.writeFileSync('ListenAndMatchGameData_updated.json', JSON.stringify(updatedData, null, 2));
  
  console.log('✅ Success! Updated data saved to ListenAndMatchGameData_updated.json');
} catch (error) {
  console.error('❌ Error:', error.message);
}