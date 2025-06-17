const fs = require('fs');

// Read the JSON file
fs.readFile('WordOfTheDayData.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const wordData = JSON.parse(data);
        
        // 1. Count by class group only
        const classGroupCounts = {};
        for (const classGroup in wordData) {
            classGroupCounts[classGroup] = wordData[classGroup].length;
        }

        // 2. Count by class group + difficulty level
        const classGroupDifficultyCounts = {};
        for (const classGroup in wordData) {
            classGroupDifficultyCounts[classGroup] = {};
            wordData[classGroup].forEach(word => {
                const level = word.difficultyLevel;
                classGroupDifficultyCounts[classGroup][level] = 
                    (classGroupDifficultyCounts[classGroup][level] || 0) + 1;
            });
        }

        // 3. Count by class group + difficulty level + category
        const classGroupDifficultyCategoryCounts = {};
        for (const classGroup in wordData) {
            classGroupDifficultyCategoryCounts[classGroup] = {};
            wordData[classGroup].forEach(word => {
                const level = word.difficultyLevel;
                const category = word.category;
                
                if (!classGroupDifficultyCategoryCounts[classGroup][level]) {
                    classGroupDifficultyCategoryCounts[classGroup][level] = {};
                }
                
                classGroupDifficultyCategoryCounts[classGroup][level][category] = 
                    (classGroupDifficultyCategoryCounts[classGroup][level][category] || 0) + 1;
            });
        }

        // Display the results
        console.log('1. Word Count by Class Group:');
        console.log('----------------------------');
        for (const [group, count] of Object.entries(classGroupCounts)) {
            console.log(`${group}: ${count} words`);
        }

        console.log('\n2. Word Count by Class Group + Difficulty Level:');
        console.log('-----------------------------------------------');
        for (const [group, levels] of Object.entries(classGroupDifficultyCounts)) {
            console.log(`\n${group}:`);
            for (const [level, count] of Object.entries(levels)) {
                console.log(`  ${level}: ${count} words`);
            }
        }

        console.log('\n3. Word Count by Class Group + Difficulty Level + Category:');
        console.log('--------------------------------------------------------');
        for (const [group, levels] of Object.entries(classGroupDifficultyCategoryCounts)) {
            console.log(`\n${group}:`);
            for (const [level, categories] of Object.entries(levels)) {
                console.log(`  ${level}:`);
                for (const [category, count] of Object.entries(categories)) {
                    console.log(`    ${category}: ${count} words`);
                }
            }
        }

    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});