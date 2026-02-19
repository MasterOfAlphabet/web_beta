// ══════════════════════════════════════════════════════════════════════════════
// SPELLING ASSESSMENT DATA WITH CLUSTER ARCHITECTURE
// Based on: Spelling Module Framework (Grades I–II) - Cluster-Based Skill Architecture
// ══════════════════════════════════════════════════════════════════════════════

// CLUSTER DEFINITIONS
export const CLUSTERS = {
  recognition: {
    name: "Recognition",
    weight: 0.30,
    description: "Visual word recognition and meaning-to-word mapping ability",
    icon: "👁️"
  },
  phoneme: {
    name: "Phoneme Construction", 
    weight: 0.40,
    description: "Sound-symbol association and encoding accuracy through listening-to-writing transfer",
    icon: "🎵"
  },
  structuring: {
    name: "Word Structuring",
    weight: 0.30,
    description: "Sequential processing and word architecture awareness",
    icon: "🏗️"
  }
};

// SKILL LEVEL DEFINITIONS (Mapped to Rookie/Racer/Master/Prodigy/Wizard)
export const SKILL_LEVELS = [
  { 
    name: "Rookie", 
    min: 0, 
    max: 34, 
    icon: "🎯", 
    color: "#ef4444",
    bgGradient: "from-red-500 to-red-600",
    interpretation: "Foundational spelling gaps present. Needs structured intervention and practice."
  },
  { 
    name: "Racer", 
    min: 35, 
    max: 54, 
    icon: "⚡", 
    color: "#eab308",
    bgGradient: "from-yellow-500 to-yellow-600",
    interpretation: "Partial pattern recognition with inconsistent encoding ability. Regular practice recommended."
  },
  { 
    name: "Master", 
    min: 55, 
    max: 74, 
    icon: "🌟", 
    color: "#22c55e",
    bgGradient: "from-green-500 to-green-600",
    interpretation: "Grade-aligned spelling ability. Functional literacy achieved."
  },
  { 
    name: "Prodigy", 
    min: 75, 
    max: 89, 
    icon: "💎", 
    color: "#3b82f6",
    bgGradient: "from-blue-500 to-pink-500",
    interpretation: "Stable phoneme and structural control. Above grade level performance."
  },
  { 
    name: "Wizard", 
    min: 90, 
    max: 100, 
    icon: "🧙‍♂️", 
    color: "#8b5cf6",
    bgGradient: "from-purple-500 to-purple-600",
    interpretation: "High spelling maturity and consistency. Exceptional mastery."
  }
];

// ══════════════════════════════════════════════════════════════════════════════
// IMAGE ASSET MAPPING (Using Emojis for Digital Platform)
// ══════════════════════════════════════════════════════════════════════════════

export const IMAGE_ASSETS = {
  // Grade I-II Images - Basic Objects
  apple: { emoji: "🍎", alt: "red apple", type: "emoji" },
  dog: { emoji: "🐕", alt: "brown dog", type: "emoji" },
  star: { emoji: "⭐", alt: "shining star", type: "emoji" },
  fish: { emoji: "🐠", alt: "orange fish", type: "emoji" },
  leaf: { emoji: "🍃", alt: "green leaf", type: "emoji" },
  tree: { emoji: "🌳", alt: "big tree", type: "emoji" },
  bird: { emoji: "🐦", alt: "small bird", type: "emoji" },
  moon: { emoji: "🌙", alt: "crescent moon", type: "emoji" },
  cat: { emoji: "🐱", alt: "cat face", type: "emoji" },
  ball: { emoji: "⚽", alt: "football", type: "emoji" },
  sun: { emoji: "☀️", alt: "bright sun", type: "emoji" },
  bear: { emoji: "🐻", alt: "brown bear", type: "emoji" },
  house: { emoji: "🏠", alt: "small house", type: "emoji" },
  book: { emoji: "📚", alt: "books", type: "emoji" },
  
  // 🇮🇳 Indian Context - Grade I-II
  mango: { emoji: "🥭", alt: "ripe mango", type: "emoji" },
  lotus: { emoji: "🪷", alt: "pink lotus flower", type: "emoji" },
  peacock: { emoji: "🦚", alt: "beautiful peacock", type: "emoji" },
  
  // Grade III-V Images - Intermediate
  giraffe: { emoji: "🦒", alt: "tall giraffe", type: "emoji" },
  pyramid: { emoji: "🗻", alt: "egyptian pyramid", type: "emoji" },
  helicopter: { emoji: "🚁", alt: "flying helicopter", type: "emoji" },
  volcano: { emoji: "🌋", alt: "erupting volcano", type: "emoji" },
  rainbow: { emoji: "🌈", alt: "colorful rainbow", type: "emoji" },
  butterfly: { emoji: "🦋", alt: "beautiful butterfly", type: "emoji" },
  elephant: { emoji: "🐘", alt: "big elephant", type: "emoji" },
  bicycle: { emoji: "🚲", alt: "bicycle", type: "emoji" },
  castle: { emoji: "🏰", alt: "castle", type: "emoji" },
  
  // 🇮🇳 Indian Context - Grade III-V
  diwali: { emoji: "🪔", alt: "diya lamp for Diwali", type: "emoji" },
  cricket: { emoji: "🏏", alt: "cricket bat and ball", type: "emoji" },
  samosa: { emoji: "🥟", alt: "triangular samosa", type: "emoji" },
  
  // Grade VI-X Images - Advanced
  microscope: { emoji: "🔬", alt: "laboratory microscope", type: "emoji" },
  parliament: { emoji: "🏛️", alt: "parliament building", type: "emoji" },
  chameleon: { 
    emoji: "🦎", 
    alt: "colorful chameleon", 
    type: "emoji",
    // Fallback image URL if emoji is not sufficient
    imageUrl: "https://images.unsplash.com/photo-1556664869-a0bc02c92981?w=400"
  },
  telescope: { emoji: "🔭", alt: "astronomy telescope", type: "emoji" },
  
  // 🇮🇳 Indian Context - Grade VI-X
  tajmahal: { emoji: "🕌", alt: "Taj Mahal monument", type: "emoji" },
};

/**
 * Get image asset by key (with automatic extension stripping)
 * @param {string} imageKey - Image key (e.g., "apple" or "apple.jpg")
 * @returns {object} Image asset object with emoji, alt text, and type
 */
export const getImageAsset = (imageKey) => {
  if (!imageKey) return { emoji: "🖼️", alt: "image", type: "emoji" };
  
  // Remove file extensions if present
  const key = imageKey.replace(/\.(jpg|jpeg|png|gif|svg)$/i, '');
  
  return IMAGE_ASSETS[key] || { emoji: "🖼️", alt: "image", type: "emoji" };
};

// ══════════════════════════════════════════════════════════════════════════════
// GRADES I-II DATA
// ══════════════════════════════════════════════════════════════════════════════

export const spellingData = {
  "I-II": {
    classGroup: "I-II",
    timeLimit: 60, // minutes
    categories: [
      {
        name: "Dictation",
        cluster: "phoneme",
        description: "Listen to the word and type it correctly.",
        questions: [
          { id: 1, word: "cat", answer: "cat", cluster: "phoneme" },
          { id: 2, word: "pen", answer: "pen", cluster: "phoneme" },
          { id: 3, word: "sun", answer: "sun", cluster: "phoneme" },
        ],
      },
      {
        name: "Find the Correct Spelling (MCQ)",
        cluster: "recognition",
        description: "Choose the correctly spelled word from options.",
        questions: [
          {
            id: 4,
            question: "Which is the correct spelling?",
            options: ["hous", "hose", "house", "huse"],
            answer: "house",
            cluster: "recognition"
          },
          {
            id: 5,
            question: "Which is the correct spelling?",
            options: ["flor", "flower", "floer", "flowr"],
            answer: "flower",
            cluster: "recognition"
          },
          {
            id: 6,
            question: "Which is the correct spelling?",
            options: ["elefant", "elephant", "elephent", "elephint"],
            answer: "elephant",
            cluster: "recognition"
          },
          {
            id: 7,
            question: "Which is the correct spelling?",
            options: ["snak", "snake", "snaek", "snayk"],
            answer: "snake",
            cluster: "recognition"
          },
          {
            id: 8,
            question: "Which is the correct spelling?",
            options: ["tre", "tree", "trei", "trea"],
            answer: "tree",
            cluster: "recognition"
          },
          {
            id: 9,
            question: "Which is the correct spelling?",
            options: ["buk", "book", "bouk", "bok"],
            answer: "book",
            cluster: "recognition"
          },
          {
            id: 10,
            question: "Which is the correct spelling?",
            options: ["bal", "bawl", "ball", "baul"],
            answer: "ball",
            cluster: "recognition"
          },
        ],
      },
      {
        name: "Find the Missing Letter",
        cluster: "phoneme",
        description: "Fill in the missing letter to complete the word.",
        questions: [
          {
            id: 11,
            word: "c _ t",
            hint: "A pet that says meow.",
            answer: "cat",
            cluster: "phoneme"
          },
          {
            id: 12,
            word: "b _ _ l",
            hint: "You play with this.",
            answer: "ball",
            cluster: "phoneme"
          },
          {
            id: 13,
            word: "s _ _ p",
            hint: "You use this to wash your hands.",
            answer: "soap",
            cluster: "phoneme"
          },
          {
            id: 14,
            word: "h _ _ s e",
            hint: "You live in this.",
            answer: "house",
            cluster: "phoneme"
          },
          {
            id: 15,
            word: "r _ i n",
            hint: "Drops from the sky.",
            answer: "rain",
            cluster: "phoneme"
          },
          {
            id: 16,
            word: "s _ a r",
            hint: "Shines in the night sky.",
            answer: "star",
            cluster: "phoneme"
          },
        ],
      },
      {
        name: "Unscramble",
        cluster: "structuring",
        description: "Rearrange the scrambled letters to form the correct word.",
        questions: [
          {
            id: 17,
            scrambled: "puc",
            hint: "Something you drink from.",
            answer: "cup",
            cluster: "structuring"
          },
          {
            id: 18,
            scrambled: "ogd",
            hint: "A pet that barks.",
            answer: "dog",
            cluster: "structuring"
          },
        ],
      },
      {
        name: "Spell the Pic",
        cluster: "recognition",
        description: "Type the word that matches the picture shown.",
        questions: [
          { 
            id: 19, 
            image: "apple.jpg", 
            answer: "apple",
            cluster: "recognition"
          },
          { 
            id: 20, 
            image: "dog.jpg", 
            answer: "dog",
            cluster: "recognition"
          },
          { 
            id: 21, 
            image: "star.jpg", 
            answer: "star",
            cluster: "recognition"
          },
          { 
            id: 22, 
            image: "fish.jpg", 
            answer: "fish",
            cluster: "recognition"
          },
          { 
            id: 23, 
            image: "leaf.jpg", 
            answer: "leaf",
            cluster: "recognition"
          },
          { 
            id: 24, 
            image: "tree.jpg", 
            answer: "tree",
            cluster: "recognition"
          },
          { 
            id: 25, 
            image: "bird.jpg", 
            answer: "bird",
            cluster: "recognition"
          },
        ],
      },
      {
        name: "All-in-One",
        cluster: "mixed", // Special tag - questions are individually tagged
        description: "Mixed review - various question types.",
        questions: [
          // MCQ type → Recognition cluster
          {
            id: 26,
            question: "Which is the correct spelling?",
            options: ["grape", "graep", "grap", "graip"],
            answer: "grape",
            cluster: "recognition"
          },
          // Unscramble type → Structuring cluster
          {
            id: 27,
            scrambled: "raeb",
            hint: "A big animal that likes honey.",
            answer: "bear",
            cluster: "structuring"
          },
          // Missing letter type → Phoneme cluster
          {
            id: 28,
            word: "r _ i n",
            hint: "Drops from the sky.",
            answer: "rain",
            cluster: "phoneme"
          },
          // Picture type → Recognition cluster
          {
            id: 29,
            image: "moon.jpg",
            answer: "moon",
            cluster: "recognition"
          },
          // MCQ type → Recognition cluster
          {
            id: 30,
            question: "Which is the correct spelling?",
            options: ["cake", "caek", "cak", "cayk"],
            answer: "cake",
            cluster: "recognition"
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // GRADES III-V DATA
  // ══════════════════════════════════════════════════════════════════════════════
  "III-V": {
    classGroup: "III-V",
    timeLimit: 45,
    categories: [
      {
        name: "Dictation",
        cluster: "phoneme",
        description: "Listen to the word and type it correctly.",
        questions: [
          { id: 1, word: "bicycle", answer: "bicycle", cluster: "phoneme" },
          { id: 2, word: "library", answer: "library", cluster: "phoneme" },
          { id: 3, word: "elephant", answer: "elephant", cluster: "phoneme" },
          { id: 4, word: "beautiful", answer: "beautiful", cluster: "phoneme" },
          { id: 5, word: "important", answer: "important", cluster: "phoneme" },
        ],
      },
      {
        name: "Find the Correct Spelling (MCQ)",
        cluster: "recognition",
        description: "Choose the correctly spelled word from options.",
        questions: [
          {
            id: 6,
            question: "Which is the correct spelling?",
            options: ["umbrella", "umberella", "umbrellla", "umbrela"],
            answer: "umbrella",
            cluster: "recognition"
          },
          {
            id: 7,
            question: "Which is the correct spelling?",
            options: ["mountain", "mountin", "moutain", "mounten"],
            answer: "mountain",
            cluster: "recognition"
          },
          {
            id: 8,
            question: "Which is the correct spelling?",
            options: ["chocolate", "choclate", "chocolatte", "chocklate"],
            answer: "chocolate",
            cluster: "recognition"
          },
          {
            id: 9,
            question: "Which is the correct spelling?",
            options: ["vegetable", "vegitable", "vegetabel", "vegeteble"],
            answer: "vegetable",
            cluster: "recognition"
          },
          {
            id: 10,
            question: "Which is the correct spelling?",
            options: ["different", "diferent", "diffrent", "differant"],
            answer: "different",
            cluster: "recognition"
          },
          {
            id: 11,
            question: "Which is the correct spelling?",
            options: ["favorite", "favourit", "favorate", "favorit"],
            answer: "favorite",
            cluster: "recognition"
          },
        ],
      },
      {
        name: "Find the Missing Letter",
        cluster: "phoneme",
        description: "Fill in the missing letter to complete the word.",
        questions: [
          {
            id: 12,
            word: "c _ mputer",
            hint: "A machine used for calculations and the internet.",
            answer: "computer",
            cluster: "phoneme"
          },
          {
            id: 13,
            word: "th _ ught",
            hint: "An idea or opinion.",
            answer: "thought",
            cluster: "phoneme"
          },
          {
            id: 14,
            word: "ex _ rcise",
            hint: "Physical activity for health.",
            answer: "exercise",
            cluster: "phoneme"
          },
          {
            id: 15,
            word: "scho _ l",
            hint: "A place where you learn.",
            answer: "school",
            cluster: "phoneme"
          },
        ],
      },
      {
        name: "Unscramble",
        cluster: "structuring",
        description: "Rearrange the scrambled letters to form the correct word.",
        questions: [
          {
            id: 16,
            scrambled: "ydaihol",
            hint: "No school on this day.",
            answer: "holiday",
            cluster: "structuring"
          },
          {
            id: 17,
            scrambled: "rfiehdnsip",
            hint: "A bond between friends.",
            answer: "friendship",
            cluster: "structuring"
          },
          {
            id: 18,
            scrambled: "gniar",
            hint: "Falls from clouds.",
            answer: "grain",
            cluster: "structuring"
          },
        ],
      },
      {
        name: "Spell the Pic",
        cluster: "recognition",
        description: "Type the word that matches the picture shown.",
        questions: [
          { id: 19, image: "giraffe.jpg", answer: "giraffe", cluster: "recognition" },
          { id: 20, image: "pyramid.jpg", answer: "pyramid", cluster: "recognition" },
          { id: 21, image: "helicopter.jpg", answer: "helicopter", cluster: "recognition" },
          { id: 22, image: "volcano.jpg", answer: "volcano", cluster: "recognition" },
          { id: 23, image: "rainbow.jpg", answer: "rainbow", cluster: "recognition" },
        ],
      },
      {
        name: "All-in-One",
        cluster: "mixed",
        description: "Mixed review - various question types.",
        questions: [
          {
            id: 24,
            question: "Which is the correct spelling?",
            options: ["museum", "musium", "musuem", "museem"],
            answer: "museum",
            cluster: "recognition"
          },
          {
            id: 25,
            scrambled: "aelcst",
            hint: "A large fortified building.",
            answer: "castle",
            cluster: "structuring"
          },
          {
            id: 26,
            word: "f _ _ nd",
            hint: "To discover something.",
            answer: "found",
            cluster: "phoneme"
          },
          {
            id: 27,
            image: "butterfly.jpg",
            answer: "butterfly",
            cluster: "recognition"
          },
          {
            id: 28,
            question: "Which is the correct spelling?",
            options: ["celebrate", "celebrat", "celibrate", "selebrate"],
            answer: "celebrate",
            cluster: "recognition"
          },
          {
            id: 29,
            scrambled: "rtewni",
            hint: "The cold season.",
            answer: "winter",
            cluster: "structuring"
          },
          {
            id: 30,
            word: "b _ _ utiful",
            hint: "Very attractive.",
            answer: "beautiful",
            cluster: "phoneme"
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // GRADES VI-X DATA
  // ══════════════════════════════════════════════════════════════════════════════
  "VI-X": {
    classGroup: "VI-X",
    timeLimit: 30,
    categories: [
      {
        name: "Dictation",
        cluster: "phoneme",
        description: "Listen to the word and type it correctly.",
        questions: [
          { id: 1, word: "acquaintance", answer: "acquaintance", cluster: "phoneme" },
          { id: 2, word: "simultaneous", answer: "simultaneous", cluster: "phoneme" },
          { id: 3, word: "phenomenon", answer: "phenomenon", cluster: "phoneme" },
          { id: 4, word: "psychology", answer: "psychology", cluster: "phoneme" },
          { id: 5, word: "necessary", answer: "necessary", cluster: "phoneme" },
          { id: 6, word: "occurrence", answer: "occurrence", cluster: "phoneme" },
          { id: 7, word: "rhythm", answer: "rhythm", cluster: "phoneme" },
        ],
      },
      {
        name: "Find the Correct Spelling (MCQ)",
        cluster: "recognition",
        description: "Choose the correctly spelled word from options.",
        questions: [
          {
            id: 8,
            question: "Which is the correct spelling?",
            options: ["entrepreneur", "enterpreneur", "entreprenuer", "entrepeneur"],
            answer: "entrepreneur",
            cluster: "recognition"
          },
          {
            id: 9,
            question: "Which is the correct spelling?",
            options: ["conscientious", "consciencious", "conscientous", "conscienscious"],
            answer: "conscientious",
            cluster: "recognition"
          },
          {
            id: 10,
            question: "Which is the correct spelling?",
            options: ["bureaucracy", "bureacracy", "bureaucrazy", "bereaucracy"],
            answer: "bureaucracy",
            cluster: "recognition"
          },
          {
            id: 11,
            question: "Which is the correct spelling?",
            options: ["miscellaneous", "miscellanous", "miscelleneous", "miscellanious"],
            answer: "miscellaneous",
            cluster: "recognition"
          },
          {
            id: 12,
            question: "Which is the correct spelling?",
            options: ["accommodate", "acommodate", "accomodate", "acomodate"],
            answer: "accommodate",
            cluster: "recognition"
          },
        ],
      },
      {
        name: "Find the Missing Letter",
        cluster: "phoneme",
        description: "Fill in the missing letter to complete the word.",
        questions: [
          {
            id: 13,
            word: "eq _ ivalent",
            hint: "Equal in value or amount.",
            answer: "equivalent",
            cluster: "phoneme"
          },
          {
            id: 14,
            word: "occ _ rrence",
            hint: "An incident or event.",
            answer: "occurrence",
            cluster: "phoneme"
          },
          {
            id: 15,
            word: "rh _ thm",
            hint: "A strong, regular repeated pattern of movement or sound.",
            answer: "rhythm",
            cluster: "phoneme"
          },
        ],
      },
      {
        name: "Unscramble",
        cluster: "structuring",
        description: "Rearrange the scrambled letters to form the correct word.",
        questions: [
          {
            id: 16,
            scrambled: "eonaxtgriage",
            hint: "Making something seem bigger than it is.",
            answer: "exaggeration",
            cluster: "structuring"
          },
          {
            id: 17,
            scrambled: "lebstu",
            hint: "Not obvious; delicate.",
            answer: "subtle",
            cluster: "structuring"
          },
          {
            id: 18,
            scrambled: "nousspaonet",
            hint: "Happening without planning.",
            answer: "spontaneous",
            cluster: "structuring"
          },
          {
            id: 19,
            scrambled: "acmdmootace",
            hint: "To provide room or space for someone.",
            answer: "accommodate",
            cluster: "structuring"
          },
        ],
      },
      {
        name: "Spell the Pic",
        cluster: "recognition",
        description: "Type the word that matches the picture shown.",
        questions: [
          { id: 20, image: "microscope.jpg", answer: "microscope", cluster: "recognition" },
          { id: 21, image: "parliament.jpg", answer: "parliament", cluster: "recognition" },
          { id: 22, image: "chameleon.jpg", answer: "chameleon", cluster: "recognition" },
          { id: 23, image: "hieroglyphics.jpg", answer: "hieroglyphics", cluster: "recognition" },
        ],
      },
      {
        name: "All-in-One",
        cluster: "mixed",
        description: "Mixed review - various question types.",
        questions: [
          {
            id: 24,
            question: "Which is the correct spelling?",
            options: ["necessary", "neccessary", "necessery", "neccesary"],
            answer: "necessary",
            cluster: "recognition"
          },
          {
            id: 25,
            scrambled: "tnedncneipe",
            hint: "Freedom from outside control.",
            answer: "independence",
            cluster: "structuring"
          },
          {
            id: 26,
            word: "kn _ wledge",
            hint: "Information and skills acquired.",
            answer: "knowledge",
            cluster: "phoneme"
          },
          {
            id: 27,
            image: "telescope.jpg",
            answer: "telescope",
            cluster: "recognition"
          },
          {
            id: 28,
            question: "Which is the correct spelling?",
            options: ["conscience", "concience", "consience", "consciense"],
            answer: "conscience",
            cluster: "recognition"
          },
          {
            id: 29,
            scrambled: "gvpeiriel",
            hint: "A special right or advantage.",
            answer: "privilege",
            cluster: "structuring"
          },
          {
            id: 30,
            word: "rec _ mmend",
            hint: "To suggest or advise.",
            answer: "recommend",
            cluster: "phoneme"
          },
        ],
      },
    ],
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate cluster scores from answers
 */
export const calculateClusterScores = (answers, allQuestions) => {
  const clusters = {
    recognition: { correct: 0, total: 0, weight: 0.30, percentage: 0 },
    phoneme: { correct: 0, total: 0, weight: 0.40, percentage: 0 },
    structuring: { correct: 0, total: 0, weight: 0.30, percentage: 0 },
  };

  allQuestions.forEach(q => {
    const userAnswer = answers[q.id];
    const cluster = q.cluster;
    
    if (cluster && clusters[cluster]) {
      clusters[cluster].total++;
      if (userAnswer?.trim().toLowerCase() === q.answer.toLowerCase()) {
        clusters[cluster].correct++;
      }
    }
  });

  // Calculate percentages
  Object.keys(clusters).forEach(key => {
    if (clusters[key].total > 0) {
      clusters[key].percentage = Math.round(
        (clusters[key].correct / clusters[key].total) * 100
      );
    }
  });

  return clusters;
};

/**
 * Calculate weighted Spelling Index
 */
export const calculateSpellingIndex = (clusters) => {
  const spellingIndex = 
    (clusters.recognition.percentage * clusters.recognition.weight) +
    (clusters.phoneme.percentage * clusters.phoneme.weight) +
    (clusters.structuring.percentage * clusters.structuring.weight);
  
  return Math.round(spellingIndex);
};

/**
 * Get skill level based on spelling index
 */
export const getSkillLevel = (spellingIndex) => {
  return SKILL_LEVELS.find(level => 
    spellingIndex >= level.min && spellingIndex <= level.max
  ) || SKILL_LEVELS[0];
};

/**
 * Get weakest cluster for recommendations
 */
export const getWeakestCluster = (clusters) => {
  const clusterArray = Object.entries(clusters).map(([key, data]) => ({
    key,
    ...data,
    name: CLUSTERS[key].name
  }));
  
  return clusterArray.reduce((weakest, current) => 
    current.percentage < weakest.percentage ? current : weakest
  );
};

/**
 * Get categories that need practice based on performance
 */
export const getCategoriesForPractice = (allQuestions, answers, clusters) => {
  const weakestCluster = getWeakestCluster(clusters);
  
  // Find categories in the weakest cluster with low scores
  const categoryScores = {};
  
  allQuestions.forEach(q => {
    if (q.cluster === weakestCluster.key) {
      const categoryName = q.categoryName || "Unknown";
      if (!categoryScores[categoryName]) {
        categoryScores[categoryName] = { correct: 0, total: 0, cluster: q.cluster };
      }
      categoryScores[categoryName].total++;
      if (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()) {
        categoryScores[categoryName].correct++;
      }
    }
  });
  
  // Calculate percentages and filter categories below 75%
  return Object.entries(categoryScores)
    .map(([name, data]) => ({
      name,
      percentage: Math.round((data.correct / data.total) * 100),
      cluster: data.cluster
    }))
    .filter(cat => cat.percentage < 75)
    .sort((a, b) => a.percentage - b.percentage);
};

/**
 * Generate practice recommendations based on weakest cluster
 */
export const getPracticeRecommendations = (weakestCluster) => {
  const recommendations = {
    recognition: [
      {
        title: "Flashcard Games",
        description: "Practice with word flashcards - see the word, spell it from memory",
        why: "Improves visual word recognition and memory"
      },
      {
        title: "Sight Word Practice",
        description: "Study common sight words daily (10 minutes)",
        why: "Builds automatic word recognition"
      },
      {
        title: "Picture-to-Word Matching",
        description: "Match pictures with correct spelling options",
        why: "Strengthens meaning-to-word connections"
      }
    ],
    phoneme: [
      {
        title: "Listen and Spell Drills",
        description: "Have someone read words aloud, write them down",
        why: "Develops sound-to-symbol encoding"
      },
      {
        title: "Phonics Worksheets",
        description: "Practice breaking words into sounds (c-a-t = cat)",
        why: "Improves phonemic awareness"
      },
      {
        title: "Rhyming Word Games",
        description: "Find words that rhyme and spell them (cat, bat, hat)",
        why: "Builds sound pattern recognition"
      }
    ],
    structuring: [
      {
        title: "Letter Tile Games",
        description: "Use physical or digital tiles to build words",
        why: "Improves sequential processing"
      },
      {
        title: "Word Building Challenges",
        description: "Add prefixes/suffixes to root words correctly",
        why: "Strengthens word architecture awareness"
      },
      {
        title: "Anagram Puzzles",
        description: "Solve daily anagram challenges (5-10 minutes)",
        why: "Develops letter pattern recognition"
      }
    ]
  };
  
  return recommendations[weakestCluster.key] || [];
};

export default spellingData;
