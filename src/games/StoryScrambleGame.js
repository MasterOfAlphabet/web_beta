import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  RotateCcw,
  Volume2,
  Lightbulb,
  Award,
  Clock,
  Star,
  Trophy,
  ChevronRight,
  Lock,
} from "lucide-react";

// ------------------------
// Story Data and Utilities
// ------------------------

const storyData = {
  "I-II": {
    story: [
      {
        id: "pet-cat",
        title: "My Pet Cat",
        sentences: [
          {
            id: "story1",
            parts: ["I", "have", "a", "cat", "."],
            hint: "What pet do I have?",
            storySegment: "I have a fluffy orange cat named Mittens.",
            difficulty: "easy",
            points: 10,
          },
          {
            id: "story2",
            parts: ["The", "cat", "likes", "milk", "."],
            hint: "What does the cat like?",
            storySegment: "The cat likes to drink warm milk every morning.",
            difficulty: "easy",
            points: 10,
          },
          {
            id: "story3",
            parts: ["It", "plays", "with", "a", "ball", "."],
            hint: "What does it play with?",
            storySegment: "It plays with a red ball in the garden.",
            difficulty: "easy",
            points: 10,
          },
        ],
      },
      {
        id: "sunny-day",
        title: "A Sunny Day",
        sentences: [
          {
            id: "story4",
            parts: ["The", "sun", "is", "bright", "."],
            hint: "How is the sun?",
            storySegment: "The sun is bright and warm today.",
            difficulty: "easy",
            points: 10,
          },
          {
            id: "story5",
            parts: ["Birds", "sing", "in", "trees", "."],
            hint: "Where do birds sing?",
            storySegment: "Birds sing beautiful songs in the tall trees.",
            difficulty: "easy",
            points: 10,
          },
          {
            id: "story6",
            parts: ["I", "play", "outside", "."],
            hint: "Where do I play?",
            storySegment: "I play outside with my friends happily.",
            difficulty: "easy",
            points: 10,
          },
        ],
      },
      {
        id: "birthday-party",
        title: "Birthday Party",
        sentences: [
          {
            id: "story7",
            parts: ["Today", "is", "my", "birthday", "."],
            hint: "What day is today?",
            storySegment: "Today is my special sixth birthday.",
            difficulty: "easy",
            points: 10,
          },
          {
            id: "story8",
            parts: ["I", "got", "many", "gifts", "."],
            hint: "What did I get?",
            storySegment: "I got many colorful gifts from my family.",
            difficulty: "easy",
            points: 10,
          },
          {
            id: "story9",
            parts: ["We", "ate", "cake", "together", "."],
            hint: "What did we eat?",
            storySegment: "We ate delicious chocolate cake together.",
            difficulty: "easy",
            points: 10,
          },
        ],
      },
    ],
    timed: [
      {
        id: "fast-animals",
        title: "Fast Animals",
        sentences: [
          {
            id: "timed1",
            parts: ["The", "dog", "runs", "very", "fast", "."],
            hint: "How does the dog run?",
            storySegment: "The brown dog runs very fast in the park.",
            difficulty: "easy",
            points: 12,
            timeBonus: 2,
          },
          {
            id: "timed2",
            parts: ["A", "rabbit", "hops", "quickly", "."],
            hint: "How does a rabbit move?",
            storySegment: "A white rabbit hops quickly across the grass.",
            difficulty: "easy",
            points: 12,
            timeBonus: 2,
          },
        ],
      },
      {
        id: "colors-everywhere",
        title: "Colors Everywhere",
        sentences: [
          {
            id: "timed3",
            parts: ["Red", "roses", "are", "beautiful", "."],
            hint: "What color are the roses?",
            storySegment: "Red roses are beautiful in the garden.",
            difficulty: "easy",
            points: 12,
            timeBonus: 2,
          },
          {
            id: "timed4",
            parts: ["Blue", "sky", "looks", "pretty", "."],
            hint: "What color is the sky?",
            storySegment: "Blue sky looks pretty with white clouds.",
            difficulty: "easy",
            points: 12,
            timeBonus: 2,
          },
        ],
      },
      {
        id: "helping-others",
        title: "Helping Others",
        sentences: [
          {
            id: "timed5",
            parts: ["I", "help", "my", "mom", "cook", "."],
            hint: "Who do I help?",
            storySegment: "I help my mom cook dinner every evening.",
            difficulty: "medium",
            points: 15,
            timeBonus: 3,
          },
          {
            id: "timed6",
            parts: ["We", "clean", "the", "house", "together", "."],
            hint: "What do we do together?",
            storySegment: "We clean the house together on weekends.",
            difficulty: "medium",
            points: 15,
            timeBonus: 3,
          },
        ],
      },
    ],
  },
  "III-V": {
    story: [
      {
        id: "school-adventure",
        title: "My School Adventure",
        sentences: [
          {
            id: "story10",
            parts: ["Our", "school", "has", "a", "big", "library", "."],
            hint: "What does our school have?",
            storySegment:
              "Our school has a big library filled with thousands of books.",
            difficulty: "medium",
            points: 15,
          },
          {
            id: "story11",
            parts: ["I", "love", "reading", "adventure", "stories", "."],
            hint: "What kind of stories do I love?",
            storySegment:
              "I love reading adventure stories about brave heroes.",
            difficulty: "medium",
            points: 15,
          },
          {
            id: "story12",
            parts: [
              "My",
              "teacher",
              "helps",
              "me",
              "learn",
              "new",
              "words",
              ".",
            ],
            hint: "What does my teacher help me with?",
            storySegment:
              "My teacher helps me learn new words every single day.",
            difficulty: "medium",
            points: 15,
          },
        ],
      },
      {
        id: "nature-walk",
        title: "Nature Walk",
        sentences: [
          {
            id: "story13",
            parts: [
              "We",
              "went",
              "on",
              "a",
              "nature",
              "walk",
              "yesterday",
              ".",
            ],
            hint: "When did we go on a nature walk?",
            storySegment:
              "We went on a nature walk yesterday through the forest.",
            difficulty: "medium",
            points: 15,
          },
          {
            id: "story14",
            parts: [
              "Beautiful",
              "butterflies",
              "danced",
              "around",
              "colorful",
              "flowers",
              ".",
            ],
            hint: "What danced around the flowers?",
            storySegment:
              "Beautiful butterflies danced around colorful flowers in the meadow.",
            difficulty: "medium",
            points: 15,
          },
          {
            id: "story15",
            parts: [
              "We",
              "collected",
              "interesting",
              "leaves",
              "and",
              "rocks",
              ".",
            ],
            hint: "What did we collect?",
            storySegment:
              "We collected interesting leaves and rocks for our science project.",
            difficulty: "medium",
            points: 15,
          },
        ],
      },
      {
        id: "space-dreams",
        title: "Dreams of Space",
        sentences: [
          {
            id: "story16",
            parts: ["I", "dream", "of", "traveling", "to", "the", "moon", "."],
            hint: "Where do I dream of traveling?",
            storySegment: "I dream of traveling to the moon in a rocket ship.",
            difficulty: "medium",
            points: 15,
          },
          {
            id: "story17",
            parts: [
              "Astronauts",
              "explore",
              "distant",
              "planets",
              "bravely",
              ".",
            ],
            hint: "What do astronauts do?",
            storySegment:
              "Astronauts explore distant planets bravely in their spacesuits.",
            difficulty: "medium",
            points: 15,
          },
          {
            id: "story18",
            parts: [
              "The",
              "stars",
              "twinkle",
              "like",
              "diamonds",
              "at",
              "night",
              ".",
            ],
            hint: "What do stars look like?",
            storySegment:
              "The stars twinkle like diamonds at night in the dark sky.",
            difficulty: "medium",
            points: 15,
          },
        ],
      },
    ],
    timed: [
      {
        id: "ocean-depths",
        title: "Ocean Depths",
        sentences: [
          {
            id: "timed7",
            parts: [
              "Whales",
              "swim",
              "gracefully",
              "through",
              "deep",
              "ocean",
              "waters",
              ".",
            ],
            hint: "How do whales swim?",
            storySegment:
              "Whales swim gracefully through deep ocean waters singing songs.",
            difficulty: "medium",
            points: 18,
            timeBonus: 3,
          },
          {
            id: "timed8",
            parts: ["Colorful", "fish", "hide", "among", "coral", "reefs", "."],
            hint: "Where do colorful fish hide?",
            storySegment:
              "Colorful fish hide among coral reefs in the warm sea.",
            difficulty: "medium",
            points: 18,
            timeBonus: 3,
          },
        ],
      },
      {
        id: "magical-forest",
        title: "Magical Forest",
        sentences: [
          {
            id: "timed9",
            parts: [
              "Ancient",
              "trees",
              "whisper",
              "secrets",
              "in",
              "the",
              "wind",
              ".",
            ],
            hint: "What do ancient trees do?",
            storySegment:
              "Ancient trees whisper secrets in the wind to forest animals.",
            difficulty: "hard",
            points: 20,
            timeBonus: 4,
          },
          {
            id: "timed10",
            parts: [
              "Fireflies",
              "dance",
              "like",
              "tiny",
              "lanterns",
              "at",
              "dusk",
              ".",
            ],
            hint: "What do fireflies look like?",
            storySegment:
              "Fireflies dance like tiny lanterns at dusk creating magic.",
            difficulty: "hard",
            points: 20,
            timeBonus: 4,
          },
        ],
      },
      {
        id: "invention-time",
        title: "Young Inventors",
        sentences: [
          {
            id: "timed11",
            parts: [
              "Creative",
              "minds",
              "solve",
              "problems",
              "with",
              "innovative",
              "solutions",
              ".",
            ],
            hint: "How do creative minds solve problems?",
            storySegment:
              "Creative minds solve problems with innovative solutions every day.",
            difficulty: "hard",
            points: 20,
            timeBonus: 4,
          },
          {
            id: "timed12",
            parts: [
              "Young",
              "inventors",
              "build",
              "amazing",
              "robots",
              "and",
              "machines",
              ".",
            ],
            hint: "What do young inventors build?",
            storySegment:
              "Young inventors build amazing robots and machines to help people.",
            difficulty: "hard",
            points: 20,
            timeBonus: 4,
          },
        ],
      },
    ],
  },
  "VI-X": {
    story: [
      {
        id: "climate-change",
        title: "Understanding Climate Change",
        sentences: [
          {
            id: "story19",
            parts: [
              "Climate",
              "change",
              "affects",
              "ecosystems",
              "worldwide",
              ".",
            ],
            hint: "What does climate change affect?",
            storySegment:
              "Climate change affects ecosystems worldwide, altering natural habitats.",
            difficulty: "hard",
            points: 20,
          },
          {
            id: "story20",
            parts: [
              "Renewable",
              "energy",
              "sources",
              "provide",
              "sustainable",
              "alternatives",
              ".",
            ],
            hint: "What do renewable energy sources provide?",
            storySegment:
              "Renewable energy sources provide sustainable alternatives to fossil fuels.",
            difficulty: "hard",
            points: 20,
          },
          {
            id: "story21",
            parts: [
              "Students",
              "can",
              "contribute",
              "to",
              "environmental",
              "conservation",
              "efforts",
              ".",
            ],
            hint: "What can students contribute to?",
            storySegment:
              "Students can contribute to environmental conservation efforts through awareness.",
            difficulty: "hard",
            points: 20,
          },
        ],
      },
      {
        id: "technology-future",
        title: "Technology and Future",
        sentences: [
          {
            id: "story22",
            parts: [
              "Artificial",
              "intelligence",
              "transforms",
              "various",
              "industries",
              "rapidly",
              ".",
            ],
            hint: "What transforms industries rapidly?",
            storySegment:
              "Artificial intelligence transforms various industries rapidly, creating new opportunities.",
            difficulty: "hard",
            points: 20,
          },
          {
            id: "story23",
            parts: [
              "Digital",
              "literacy",
              "becomes",
              "increasingly",
              "important",
              "for",
              "success",
              ".",
            ],
            hint: "What becomes important for success?",
            storySegment:
              "Digital literacy becomes increasingly important for success in modern careers.",
            difficulty: "hard",
            points: 20,
          },
          {
            id: "story24",
            parts: [
              "Innovation",
              "drives",
              "progress",
              "in",
              "science",
              "and",
              "medicine",
              ".",
            ],
            hint: "What drives progress?",
            storySegment:
              "Innovation drives progress in science and medicine, improving lives globally.",
            difficulty: "hard",
            points: 20,
          },
        ],
      },
      {
        id: "global-citizenship",
        title: "Global Citizenship",
        sentences: [
          {
            id: "story25",
            parts: [
              "Cultural",
              "diversity",
              "enriches",
              "our",
              "global",
              "community",
              ".",
            ],
            hint: "What enriches our global community?",
            storySegment:
              "Cultural diversity enriches our global community through different perspectives.",
            difficulty: "hard",
            points: 20,
          },
          {
            id: "story26",
            parts: [
              "International",
              "cooperation",
              "addresses",
              "complex",
              "global",
              "challenges",
              ".",
            ],
            hint: "What addresses global challenges?",
            storySegment:
              "International cooperation addresses complex global challenges through collaboration.",
            difficulty: "hard",
            points: 20,
          },
          {
            id: "story27",
            parts: [
              "Education",
              "empowers",
              "individuals",
              "to",
              "create",
              "positive",
              "change",
              ".",
            ],
            hint: "What empowers individuals?",
            storySegment:
              "Education empowers individuals to create positive change in their communities.",
            difficulty: "hard",
            points: 20,
          },
        ],
      },
    ],
    timed: [
      {
        id: "scientific-discovery",
        title: "Scientific Discoveries",
        sentences: [
          {
            id: "timed13",
            parts: [
              "Quantum",
              "physics",
              "reveals",
              "the",
              "mysterious",
              "behavior",
              "of",
              "subatomic",
              "particles",
              ".",
            ],
            hint: "What does quantum physics reveal?",
            storySegment:
              "Quantum physics reveals the mysterious behavior of subatomic particles in nature.",
            difficulty: "hard",
            points: 25,
            timeBonus: 5,
          },
          {
            id: "timed14",
            parts: [
              "Genetic",
              "engineering",
              "offers",
              "revolutionary",
              "medical",
              "treatments",
              ".",
            ],
            hint: "What does genetic engineering offer?",
            storySegment:
              "Genetic engineering offers revolutionary medical treatments for rare diseases.",
            difficulty: "hard",
            points: 25,
            timeBonus: 5,
          },
        ],
      },
      {
        id: "space-exploration",
        title: "Space Exploration",
        sentences: [
          {
            id: "timed15",
            parts: [
              "Mars",
              "colonization",
              "requires",
              "advanced",
              "technological",
              "breakthroughs",
              ".",
            ],
            hint: "What does Mars colonization require?",
            storySegment:
              "Mars colonization requires advanced technological breakthroughs in life support systems.",
            difficulty: "hard",
            points: 25,
            timeBonus: 5,
          },
          {
            id: "timed16",
            parts: [
              "Telescopes",
              "capture",
              "breathtaking",
              "images",
              "of",
              "distant",
              "galaxies",
              ".",
            ],
            hint: "What do telescopes capture?",
            storySegment:
              "Telescopes capture breathtaking images of distant galaxies beyond our solar system.",
            difficulty: "hard",
            points: 25,
            timeBonus: 5,
          },
        ],
      },
      {
        id: "social-impact",
        title: "Social Impact",
        sentences: [
          {
            id: "timed17",
            parts: [
              "Sustainable",
              "development",
              "balances",
              "economic",
              "growth",
              "with",
              "environmental",
              "protection",
              ".",
            ],
            hint: "What does sustainable development balance?",
            storySegment:
              "Sustainable development balances economic growth with environmental protection for future generations.",
            difficulty: "hard",
            points: 25,
            timeBonus: 5,
          },
          {
            id: "timed18",
            parts: [
              "Social",
              "entrepreneurs",
              "create",
              "innovative",
              "solutions",
              "for",
              "community",
              "problems",
              ".",
            ],
            hint: "What do social entrepreneurs create?",
            storySegment:
              "Social entrepreneurs create innovative solutions for community problems through creative thinking.",
            difficulty: "hard",
            points: 25,
            timeBonus: 5,
          },
        ],
      },
    ],
  },
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function tokenize(text) {
  return text.match(/[\w'-]+|[^\w\s]|[\s]+/g) || [];
}

// ------------------------
// Main Component
// ------------------------

const StoryScrambleGame = () => {
  const [selectedClassGroup, setSelectedClassGroup] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [selectedStoryMode, setSelectedStoryMode] = useState(null); // "story" or "timed"
  const [gameMode, setGameMode] = useState(null); // "story" or "timed"
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [assembledSentence, setAssembledSentence] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const utteranceRef = useRef(null);
  const timeLeftRef = useRef(null);

  // Get stories for mode
  const getStoriesForMode = (mode) => {
    if (!selectedClassGroup) return [];
    return (storyData[selectedClassGroup]?.[mode] || []).map((story) => ({
      id: story.id,
      title: story.title,
    }));
  };
  const getSelectedStoryObject = () => {
    if (!selectedClassGroup || !selectedStoryMode || !selectedStoryId) return null;
    const stories = storyData[selectedClassGroup]?.[selectedStoryMode] || [];
    return stories.find((s) => s.id === selectedStoryId) || null;
  };
  const getCurrentSentences = () => {
    const story = getSelectedStoryObject();
    return Array.isArray(story?.sentences) ? story.sentences : [];
  };
  const currentSentences = getCurrentSentences();
  const currentSentence =
    currentSentenceIndex >= 0 && currentSentenceIndex < currentSentences.length
      ? currentSentences[currentSentenceIndex]
      : null;

  // Class group selection resets everything
  const handleClassGroupSelect = (classGroup) => {
    setSelectedClassGroup(classGroup);
    setSelectedStoryId(null);
    setSelectedStoryMode(null);
    setGameMode(null);
    setCurrentSentenceIndex(0);
    setScore(0);
    setStoryProgress([]);
    setAchievements([]);
    setFeedback(null);
    setHasStarted(false);
    setHighlightedWord(null);
    clearInterval(timeLeftRef.current);
  };

  // Story selection: track both id and its mode
  const handleStorySelect = (storyId, mode) => {
    setSelectedStoryId(storyId);
    setSelectedStoryMode(mode);
    setGameMode(null);
    setCurrentSentenceIndex(0);
    setScore(0);
    setStoryProgress([]);
    setAchievements([]);
    setFeedback(null);
    setHasStarted(false);
    setHighlightedWord(null);
    clearInterval(timeLeftRef.current);
  };

  // Mode selection: Only allow for right mode!
  const handleSelectMode = (mode) => {
    if (!selectedClassGroup || !selectedStoryId || !selectedStoryMode) return;
    if (mode !== selectedStoryMode) {
      setFeedback("Please select a story from this mode.");
      return;
    }
    setGameMode(mode);
    setCurrentSentenceIndex(0);
    setScore(0);
    setStoryProgress([]);
    setAchievements([]);
    setFeedback(null);
    setHasStarted(false);
    setHighlightedWord(null);
    clearInterval(timeLeftRef.current);

    // Initialize first sentence
    const story = getSelectedStoryObject();
    if (story && Array.isArray(story.sentences) && story.sentences.length > 0 && story.sentences[0]?.parts) {
      const wordsWithOriginalIndex = story.sentences[0].parts.map((word, idx) => ({
        word,
        originalIndex: idx,
        id: `${story.sentences[0].id}-${idx}`,
      }));
      setShuffledWords(shuffleArray([...wordsWithOriginalIndex]));
      setAssembledSentence([]);
    }
    if (mode === "timed") {
      setTimeLeft(60);
      startTimedMode();
    }
  };

  useEffect(() => {
    if (gameMode && currentSentence && currentSentence.parts) {
      resetGameState();
      if (gameMode === "timed") {
        setTimeLeft(60);
        clearInterval(timeLeftRef.current);
        startTimedMode();
      } else {
        clearInterval(timeLeftRef.current);
      }
    }
    // eslint-disable-next-line
  }, [gameMode, currentSentenceIndex, selectedClassGroup, selectedStoryId, selectedStoryMode]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setHighlightedWord(null);
      clearInterval(timeLeftRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameMode === "timed" && timeLeft === 0 && hasStarted) {
      setFeedback("time-up");
      setHasStarted(false);
      clearInterval(timeLeftRef.current);
    }
  }, [timeLeft, gameMode, hasStarted]);

  // Timed mode timer
  const startTimedMode = () => {
    clearInterval(timeLeftRef.current);
    timeLeftRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timeLeftRef.current);
          setFeedback("time-up");
          setHasStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reset sentence
  const resetGameState = () => {
    if (!currentSentence?.parts) {
      setShuffledWords([]);
      setAssembledSentence([]);
      return;
    }
    const wordsWithOriginalIndex = currentSentence.parts.map((word, idx) => ({
      word,
      originalIndex: idx,
      id: `${currentSentence.id}-${idx}`,
    }));
    setShuffledWords(shuffleArray([...wordsWithOriginalIndex]));
    setAssembledSentence([]);
    setFeedback(null);
    setShowHint(false);
    setIsSpeaking(false);
    setHighlightedWord(null);
  };

  // Word click
  const handleWordClick = (wordObj, isAssembled) => {
    if (!hasStarted) setHasStarted(true);
    if (feedback === "correct" || isSpeaking) return;
    if (isAssembled) {
      setAssembledSentence((prev) => prev.filter((w) => w.id !== wordObj.id));
      setShuffledWords((prev) => shuffleArray([...prev, wordObj]));
    } else {
      setAssembledSentence((prev) => [...prev, wordObj]);
      setShuffledWords((prev) => prev.filter((w) => w.id !== wordObj.id));
    }
    setFeedback(null);
  };

  const checkSentence = () => {
    if (!currentSentence?.parts || assembledSentence.length !== currentSentence.parts.length) {
      setFeedback("incorrect");
      return;
    }
    const isCorrect = assembledSentence.every((w, idx) => w.originalIndex === idx);
    if (isCorrect) {
      const pointsEarned = calculatePoints();
      setScore((prev) => prev + pointsEarned);
      setFeedback("correct");
      if (currentSentence?.storySegment && !storyProgress.includes(currentSentence.storySegment)) {
        setStoryProgress((prev) => [...prev, currentSentence.storySegment]);
      }
      checkAchievements(pointsEarned);
      if (gameMode === "timed") {
        setTimeLeft((prev) => prev + (currentSentence.timeBonus || 0));
      }
    } else {
      setFeedback("incorrect");
    }
  };

  const calculatePoints = () => {
    if (!currentSentence?.points) return 0;
    let points = currentSentence.points;
    if (showHint) points = Math.floor(points * 0.7);
    if (gameMode === "timed") points = Math.floor(points * (1 + timeLeft / 60));
    return points;
  };

  const checkAchievements = (pointsEarned) => {
    const newAchievements = [];
    if (pointsEarned >= 20 && !achievements.includes("high-scorer")) {
      newAchievements.push("high-scorer");
    }
    if (
      currentSentenceIndex === currentSentences.length - 1 &&
      !achievements.includes("game-completer")
    ) {
      newAchievements.push("game-completer");
    }
    if (score + pointsEarned >= 50 && !achievements.includes("point-master")) {
      newAchievements.push("point-master");
    }
    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < currentSentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    } else {
      setFeedback("game-complete");
      setHasStarted(false);
      clearInterval(timeLeftRef.current);
    }
  };

  // Speak sentence
  const speakSentence = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Read story with highlight
  const readStoryWithHighlight = useCallback(() => {
    if (!storyProgress.length || isSpeaking) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setHighlightedWord(null);
    const fullStory = storyProgress.join(" ");
    const tokensArr = tokenize(fullStory);
    const utterance = new window.SpeechSynthesisUtterance(fullStory);
    utteranceRef.current = utterance;
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const charIndex = event.charIndex;
        let charCount = 0;
        for (let i = 0; i < tokensArr.length; i++) {
          charCount += tokensArr[i].length;
          if (charIndex < charCount && /\w/.test(tokensArr[i])) {
            setHighlightedWord(i);
            break;
          }
        }
      }
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setHighlightedWord(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setHighlightedWord(null);
    };
    window.speechSynthesis.speak(utterance);
  }, [storyProgress, isSpeaking]);

  // ------------------------
  // UI Sections
  // ------------------------

  const ClassGroupSelection = () => (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-center text-gray-700">
        Select Your Class Group
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {Object.keys(storyData).map((classGroup) => (
          <button
            key={classGroup}
            onClick={() => handleClassGroupSelect(classGroup)}
            disabled={hasStarted && selectedClassGroup !== classGroup}
            className={`px-6 py-3 rounded-full font-medium transition-all flex flex-col items-center ${
              hasStarted && selectedClassGroup !== classGroup
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer"
            } ${
              selectedClassGroup === classGroup
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <span>Class {classGroup}</span>
            <span className="text-xs mt-1">
              {classGroup === "I-II"
                ? "Beginner"
                : classGroup === "III-V"
                ? "Intermediate"
                : "Advanced"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  // Story selection UI
  const StorySelection = () => {
    if (!selectedClassGroup) return null;
    const storyStories = getStoriesForMode("story");
    const timedStories = getStoriesForMode("timed");
    return (
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-center text-gray-700">
          Choose a Story
        </h3>
        <div className="max-w-md mx-auto">
          <label className="block font-bold mt-2 mb-1">Story Mode</label>
          <select
            value={selectedStoryMode === "story" ? selectedStoryId || "" : ""}
            onChange={e => handleStorySelect(e.target.value, "story")}
            className="w-full p-3 border border-gray-300 rounded-lg font-medium mb-3"
            disabled={hasStarted}
          >
            <option value="">Select a story...</option>
            {storyStories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.title}
              </option>
            ))}
          </select>
          <label className="block font-bold mt-2 mb-1">Timed Challenge</label>
          <select
            value={selectedStoryMode === "timed" ? selectedStoryId || "" : ""}
            onChange={e => handleStorySelect(e.target.value, "timed")}
            className="w-full p-3 border border-gray-300 rounded-lg font-medium"
            disabled={hasStarted}
          >
            <option value="">Select a timed story...</option>
            {timedStories.map((story) => (
              <option key={story.id} value={story.id}>
                {story.title}
              </option>
            ))}
          </select>
          {hasStarted && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Complete the current story to select a different one
            </p>
          )}
        </div>
      </div>
    );
  };

  // Mode selection UI
  const GameModes = () => (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-center text-gray-700">
        {gameMode
          ? hasStarted
            ? "Current Mode"
            : "Change Mode"
          : "Select Game Mode"}
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={() => handleSelectMode("story")}
          disabled={hasStarted || selectedStoryMode !== "story"}
          className={`px-6 py-2 rounded-full font-medium transition-all flex flex-col items-center ${
            hasStarted || selectedStoryMode !== "story"
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer"
          } ${
            gameMode === "story"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <span>Story Mode</span>
        </button>
        <button
          onClick={() => handleSelectMode("timed")}
          disabled={hasStarted || selectedStoryMode !== "timed"}
          className={`px-6 py-2 rounded-full font-medium transition-all flex flex-col items-center ${
            hasStarted || selectedStoryMode !== "timed"
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer"
          } ${
            gameMode === "timed"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <span>Timed Challenge</span>
        </button>
      </div>
      {hasStarted && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {gameMode === "story"
            ? "Complete the story to switch modes"
            : "Finish the timed challenge to switch modes"}
        </p>
      )}
      {feedback === "Please select a story from this mode." && (
        <div className="text-red-600 font-bold text-center mt-2">
          Please select a story from this mode.
        </div>
      )}
    </div>
  );

  // Sentence Construction
  const SentenceConstructionArea = () => (
    <div className="min-h-[120px] bg-purple-50 p-4 rounded-xl border-2 border-purple-300 border-dashed flex flex-wrap gap-2 items-center justify-center mb-6 shadow-inner">
      {assembledSentence.length === 0 ? (
        <p className="text-gray-500 italic">
          Click words below to build the sentence...
        </p>
      ) : (
        assembledSentence.map((wordObj) => (
          <button
            key={`assembled-${wordObj.id}`}
            onClick={() => handleWordClick(wordObj, true)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-base md:text-lg transition-all
              ${
                feedback === "correct"
                  ? "bg-green-200 text-green-800 animate-pulse"
                  : feedback === "incorrect"
                  ? "bg-red-200 text-red-800"
                  : "bg-purple-300 text-purple-900 hover:bg-purple-400"
              }
              ${isSpeaking ? "opacity-70 cursor-not-allowed" : ""}
            `}
            disabled={isSpeaking}
          >
            {wordObj.word}
          </button>
        ))
      )}
    </div>
  );

  // Word Bank
  const WordBank = () => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md mb-6">
      <h4 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">
        Word Bank:
      </h4>
      <div className="flex flex-wrap gap-2 items-center justify-center min-h-[80px]">
        {shuffledWords.length === 0 &&
        assembledSentence.length === (currentSentence?.parts?.length || 0) ? (
          <p className="text-gray-500 italic">
            All words placed. Check your sentence!
          </p>
        ) : (
          shuffledWords.map((wordObj) => (
            <button
              key={`shuffled-${wordObj.id}`}
              onClick={() => handleWordClick(wordObj, false)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-blue-500 text-white font-bold text-base md:text-lg shadow-md
                hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95
                ${isSpeaking ? "opacity-70 cursor-not-allowed" : ""}
              `}
              disabled={isSpeaking}
            >
              {wordObj.word}
            </button>
          ))
        )}
      </div>
    </div>
  );

  // Controls
  const GameControls = () => (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
      <button
        onClick={checkSentence}
        disabled={
          assembledSentence.length !== (currentSentence?.parts?.length || 0) ||
          feedback === "correct" ||
          isSpeaking
        }
        className={`px-5 py-2.5 font-bold rounded-full shadow-md transition-all flex-1 sm:flex-none
          ${
            assembledSentence.length !== (currentSentence?.parts?.length || 0) ||
            feedback === "correct" ||
            isSpeaking
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
      >
        <CheckCircle className="inline-block w-5 h-5 mr-2" /> Check
      </button>

      <button
        onClick={resetGameState}
        disabled={assembledSentence.length === 0 || isSpeaking}
        className={`px-5 py-2.5 font-bold rounded-full shadow-md transition-all flex-1 sm:flex-none
          ${
            assembledSentence.length === 0 || isSpeaking
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
      >
        <RotateCcw className="inline-block w-5 h-5 mr-2" /> Reset
      </button>

      <button
        onClick={() => speakSentence(currentSentence?.parts?.join(" ") || "")}
        disabled={isSpeaking}
        className={`px-5 py-2.5 font-bold rounded-full shadow-md transition-all flex-1 sm:flex-none
          ${
            isSpeaking
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
      >
        <Volume2 className="inline-block w-5 h-5 mr-2" />{" "}
        {isSpeaking ? "Speaking..." : "Hear It"}
      </button>
    </div>
  );

  // Feedback Area
  const FeedbackArea = () => (
    <div className="text-center mb-6 min-h-[40px]">
      {feedback === "correct" && (
        <div className="text-green-600 text-xl font-bold flex flex-col sm:flex-row items-center justify-center animate-fade-in gap-2">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" /> Great Job!
          </div>
          <button
            onClick={handleNextSentence}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            {currentSentenceIndex < currentSentences.length - 1
              ? "Next Sentence →"
              : "View Story"}
          </button>
        </div>
      )}
      {feedback === "incorrect" && (
        <p className="text-red-600 text-xl font-bold flex items-center justify-center animate-shake">
          <XCircle className="w-6 h-6 mr-2" /> Try Again!
        </p>
      )}

      {feedback === "data-error" && (
        <div className="text-red-600 bg-red-50 p-3 rounded-lg">
          <XCircle className="inline-block w-5 h-5 mr-2" />
          Could not load story data. Please try another story.
        </div>
      )}
    </div>
  );

  // Hint
  const HintArea = () => (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm text-center">
      <button
        onClick={() => setShowHint((prev) => !prev)}
        className="text-blue-700 font-semibold hover:underline flex items-center justify-center mx-auto"
      >
        <Lightbulb className="w-5 h-5 mr-2" />{" "}
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>
      {showHint && (
        <p className="mt-2 text-blue-800 text-lg italic animate-fade-in-down">
          "{currentSentence?.hint || ""}"
        </p>
      )}
    </div>
  );

  // Achievements Modal
  const AchievementsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
          <Trophy className="mr-2" /> Your Achievements
        </h2>
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.includes("high-scorer") && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Award className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-bold text-yellow-800">High Scorer</h3>
                  <p className="text-sm text-yellow-700">
                    Earned 20+ points on a single sentence
                  </p>
                </div>
              </div>
            )}
            {achievements.includes("game-completer") && (
              <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Award className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-bold text-purple-800">Game Master</h3>
                  <p className="text-sm text-purple-700">
                    Completed the entire game mode
                  </p>
                </div>
              </div>
            )}
            {achievements.includes("point-master") && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Award className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-bold text-blue-800">Point Master</h3>
                  <p className="text-sm text-blue-700">
                    Reached 50+ total points
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">
              Complete sentences to earn achievements!
            </p>
          </div>
        )}
        <button
          onClick={() => setShowAchievements(false)}
          className="mt-6 w-full py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Story display
  const StoryDisplay = () => {
    if (!storyProgress.length) return null;
    const fullStory = storyProgress.join(" ");
    const tokensArr = tokenize(fullStory);
    return (
      <div className="bg-white p-4 rounded-lg shadow-inner mb-6 max-h-96 overflow-y-auto">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">
          Your Completed Story:
        </h3>
        <div className="text-left" aria-live="polite">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {tokensArr.map((token, index) => {
              const isWord = /\w/.test(token);
              return (
                <span
                  key={index}
                  className={`transition-colors duration-200 ${
                    isWord && highlightedWord === index
                      ? "bg-yellow-200 text-yellow-900 rounded px-1"
                      : ""
                  }`}
                >
                  {token}
                </span>
              );
            })}
          </p>
        </div>
        <button
          onClick={readStoryWithHighlight}
          disabled={isSpeaking}
          className={`mt-4 px-4 py-2 rounded-full font-medium flex items-center justify-center mx-auto ${
            isSpeaking
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          aria-label={isSpeaking ? "Reading the story" : "Read me the story"}
        >
          <Volume2 className="w-5 h-5 mr-2" />
          {isSpeaking ? "Reading..." : "Read Me The Story"}
        </button>
        {!("onboundary" in window.SpeechSynthesisUtterance.prototype) && (
          <div className="mt-2 text-xs text-red-500 text-center">
            Word highlighting is not supported in this browser.
          </div>
        )}
      </div>
    );
  };

  // Game complete
  const GameCompleteScreen = () => (
    <div className="text-center p-6 md:p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-4 animate-bounce">
        {feedback === "game-complete"
          ? "🎉 Game Complete! 🎉"
          : "⏰ Time Up! ⏰"}
      </h2>
      <StoryDisplay />
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-purple-600">
          Final Score: {score}
        </h3>
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 className="text-md font-semibold text-yellow-800 flex items-center justify-center mb-2">
            <Trophy className="mr-2" /> Achievements Earned
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {achievements.length > 0 ? (
              achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="bg-white px-3 py-1 rounded-full border border-yellow-300 flex items-center"
                >
                  <Award className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm font-medium text-yellow-700">
                    {ach === "high-scorer"
                      ? "High Scorer"
                      : ach === "game-completer"
                      ? "Game Master"
                      : "Point Master"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-yellow-700 italic text-sm">
                Keep playing to earn achievements!
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() =>
          handleSelectMode(gameMode === "story" ? "timed" : "story")
        }
        className="px-6 md:px-8 py-2.5 md:py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-colors mb-4"
      >
        Try {gameMode === "story" ? "Timed Challenge" : "Story Mode"}
      </button>
      <button
        onClick={() => handleSelectMode(gameMode)}
        className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-purple-300"
      >
        Play Again
      </button>
    </div>
  );

  // Header
  const GameHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 flex items-center">
        <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mr-3" />
        Story Scramble
      </h1>
      {gameMode && (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAchievements(true)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
            aria-label="Show achievements"
          >
            <Award className="text-yellow-500 w-5 h-5" />
            {achievements.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {achievements.length}
              </span>
            )}
          </button>
          <div className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md flex items-center">
            <Star className="text-yellow-500 w-4 h-4 md:w-5 md:h-5 mr-1.5" />
            <span className="font-bold text-sm md:text-base">{score}</span>
          </div>
          {gameMode === "timed" && (
            <div
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md flex items-center ${
                timeLeft < 15 ? "bg-red-100" : "bg-green-100"
              }`}
            >
              <Clock
                className={`w-4 h-4 md:w-5 md:h-5 mr-1.5 ${
                  timeLeft < 15 ? "text-red-600" : "text-green-600"
                }`}
              />
              <span className="font-bold text-sm md:text-base">
                {timeLeft}s
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ------------------------
  // Main Render
  // ------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-6">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-purple-200">
        <GameHeader />
        {!selectedClassGroup ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Welcome to Story Scramble!
            </h2>
            <ClassGroupSelection />
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                How to Play
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>First select your class group</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Choose a story from the dropdown</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Select Story Mode or Timed Challenge</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Arrange words to complete sentences</span>
                </li>
              </ul>
            </div>
          </div>
        ) : !selectedStoryId ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Class {selectedClassGroup} Selected!
            </h2>
            <ClassGroupSelection />
            <StorySelection />
          </div>
        ) : !gameMode ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Story Selected:{" "}
              {getSelectedStoryObject()?.title}
            </h2>
            <ClassGroupSelection />
            <StorySelection />
            <GameModes />
          </div>
        ) : (
          <>
            <ClassGroupSelection />
            <StorySelection />
            <GameModes />
            {showAchievements && <AchievementsModal />}
            {feedback === "game-complete" || feedback === "time-up" ? (
              <GameCompleteScreen />
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-700">
                    {gameMode === "story"
                      ? `Story Part ${currentSentenceIndex + 1} of ${
                          currentSentences.length
                        }`
                      : `Challenge ${currentSentenceIndex + 1} of ${
                          currentSentences.length
                        }`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Difficulty:{" "}
                    <span className="font-medium capitalize">
                      {currentSentence?.difficulty || "unknown"}
                    </span>
                    {gameMode === "timed" && currentSentence?.timeBonus && (
                      <span className="ml-2">
                        • Time Bonus: +{currentSentence.timeBonus}s
                      </span>
                    )}
                  </p>
                </div>
                <SentenceConstructionArea />
                <WordBank />
                <GameControls />
                <FeedbackArea />
                <HintArea />
              </>
            )}
          </>
        )}
      </div>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default StoryScrambleGame;