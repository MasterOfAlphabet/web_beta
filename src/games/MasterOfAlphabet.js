import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Users,
  Clock,
  Star,
  BookOpen,
  Target,
  Brain,
  Zap,
  Play,
  Home,
  Award,
  User,
  Settings,
  Volume2,
  RotateCcw,
  CheckCircle,
  XCircle,
  Timer,
  Users2,
} from "lucide-react";

// Mock Firebase functions (replace with actual Firebase SDK)
const mockFirestore = {
  collection: (name) => ({
    add: async (data) => ({ id: Date.now().toString(), ...data }),
    doc: (id) => ({
      update: async (data) => console.log("Updated:", data),
      get: async () => ({ exists: true, data: () => ({}) }),
    }),
    where: (field, op, value) => ({
      orderBy: (field, direction) => ({
        limit: (count) => ({
          get: async () => ({
            docs: [
              {
                id: "1",
                data: () => ({
                  playerName: "Alex",
                  score: 95,
                  class: "Class V",
                  game: "spelling",
                }),
              },
              {
                id: "2",
                data: () => ({
                  playerName: "Sarah",
                  score: 88,
                  class: "Class IV",
                  game: "vocabulary",
                }),
              },
              {
                id: "3",
                data: () => ({
                  playerName: "Mike",
                  score: 92,
                  class: "Class VI",
                  game: "grammar",
                }),
              },
            ],
          }),
        }),
      }),
    }),
  }),
};

const db = mockFirestore;

const MasterOfAlphabet = () => {
  const [currentView, setCurrentView] = useState("home");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const timerRef = useRef(null);

  const classes = [
    "Class I",
    "Class II",
    "Class III",
    "Class IV",
    "Class V",
    "Class VI",
    "Class VII",
    "Class VIII",
    "Class IX",
    "Class X",
  ];

  const games = [
    {
      id: "spelling",
      name: "Spelling Bee",
      icon: BookOpen,
      color: "bg-blue-500",
      description: "Spell words correctly",
      duration: 300,
    },
    {
      id: "vocabulary",
      name: "Vocabulary Master",
      icon: Brain,
      color: "bg-green-500",
      description: "Match words with meanings",
      duration: 240,
    },
    {
      id: "grammar",
      name: "Grammar Guardian",
      icon: Target,
      color: "bg-purple-500",
      description: "Fix grammatical errors",
      duration: 360,
    },
    {
      id: "synonyms",
      name: "Synonym Seeker",
      icon: Star,
      color: "bg-yellow-500",
      description: "Find similar words",
      duration: 180,
    },
    {
      id: "antonyms",
      name: "Antonym Ace",
      icon: Zap,
      color: "bg-red-500",
      description: "Find opposite words",
      duration: 180,
    },
    {
      id: "comprehension",
      name: "Reading Rocket",
      icon: BookOpen,
      color: "bg-indigo-500",
      description: "Answer reading questions",
      duration: 480,
    },
    {
      id: "wordbuilding",
      name: "Word Builder",
      icon: Target,
      color: "bg-pink-500",
      description: "Create words from letters",
      duration: 300,
    },
    {
      id: "rhyming",
      name: "Rhyme Time",
      icon: Star,
      color: "bg-teal-500",
      description: "Find rhyming words",
      duration: 240,
    },
  ];

  // Comprehensive game data for all classes and games
  const gameData = {
    spelling: {
      "Class I": [
        { word: "cat", hint: "A small pet animal that says meow" },
        { word: "dog", hint: "A loyal pet that barks" },
        { word: "sun", hint: "Bright light in the sky" },
        { word: "bat", hint: "Animal that flies at night" },
        { word: "hat", hint: "You wear this on your head" },
        { word: "run", hint: "Move very fast" },
        { word: "fun", hint: "When you enjoy something" },
        { word: "cup", hint: "You drink from this" },
        { word: "pen", hint: "You write with this" },
        { word: "box", hint: "You keep things in this" },
        { word: "egg", hint: "Chickens lay these" },
        { word: "ice", hint: "Frozen water" },
        { word: "car", hint: "Vehicle you drive" },
        { word: "bus", hint: "Big vehicle for many people" },
        { word: "red", hint: "Color of strawberries" },
      ],
      "Class V": [
        { word: "beautiful", hint: "Very pretty to look at" },
        { word: "important", hint: "Something that matters a lot" },
        { word: "different", hint: "Not the same as others" },
        { word: "available", hint: "Ready to be used" },
        { word: "education", hint: "Learning in school" },
        { word: "development", hint: "Growing and improving" },
        { word: "organization", hint: "A group working together" },
        { word: "environment", hint: "The world around us" },
        { word: "government", hint: "People who run the country" },
        { word: "technology", hint: "Computers and modern devices" },
        { word: "adventure", hint: "Exciting journey" },
        { word: "knowledge", hint: "Things you know" },
        { word: "electricity", hint: "Power that lights bulbs" },
        { word: "celebrate", hint: "Have a party for something" },
        { word: "universe", hint: "All of space and stars" },
      ],
      "Class X": [
        { word: "entrepreneurship", hint: "Starting and running a business" },
        { word: "consciousness", hint: "Being aware and awake" },
        { word: "responsibility", hint: "Duty to do something" },
        { word: "characteristics", hint: "Special features of something" },
        { word: "representative", hint: "Someone who speaks for others" },
        { word: "administrative", hint: "Related to managing and organizing" },
        { word: "revolutionary", hint: "Bringing big changes" },
        { word: "extraordinary", hint: "Very unusual and amazing" },
        { word: "simultaneously", hint: "Happening at the same time" },
        { word: "predominantly", hint: "Mostly or mainly" },
        { word: "philosophical", hint: "Related to deep thinking about life" },
        { word: "psychological", hint: "Related to the mind and behavior" },
        {
          word: "democratically",
          hint: "In a way that involves everyone voting",
        },
        {
          word: "systematically",
          hint: "Done in an organized, step-by-step way",
        },
        { word: "internationally", hint: "Between many countries" },
      ],
    },
    vocabulary: {
      "Class I": [
        {
          word: "Happy",
          question: 'What does "Happy" mean?',
          options: ["Sad", "Joyful", "Angry", "Tired"],
          correct: 1,
        },
        {
          word: "Big",
          question: 'What does "Big" mean?',
          options: ["Small", "Large", "Tiny", "Short"],
          correct: 1,
        },
        {
          word: "Fast",
          question: 'What does "Fast" mean?',
          options: ["Slow", "Quick", "Lazy", "Heavy"],
          correct: 1,
        },
        {
          word: "Bright",
          question: 'What does "Bright" mean?',
          options: ["Dark", "Shiny", "Dull", "Quiet"],
          correct: 1,
        },
        {
          word: "Cold",
          question: 'What does "Cold" mean?',
          options: ["Hot", "Cool", "Warm", "Freezing"],
          correct: 3,
        },
        {
          word: "Loud",
          question: 'What does "Loud" mean?',
          options: ["Quiet", "Noisy", "Soft", "Silent"],
          correct: 1,
        },
        {
          word: "Sweet",
          question: 'What does "Sweet" mean?',
          options: ["Sour", "Tasty like sugar", "Bitter", "Salty"],
          correct: 1,
        },
        {
          word: "Soft",
          question: 'What does "Soft" mean?',
          options: ["Hard", "Gentle to touch", "Rough", "Sharp"],
          correct: 1,
        },
        {
          word: "Clean",
          question: 'What does "Clean" mean?',
          options: ["Dirty", "Not dirty", "Messy", "Broken"],
          correct: 1,
        },
        {
          word: "Kind",
          question: 'What does "Kind" mean?',
          options: ["Mean", "Nice and helpful", "Angry", "Sad"],
          correct: 1,
        },
      ],
      "Class V": [
        {
          word: "Magnificent",
          question: 'What does "Magnificent" mean?',
          options: ["Terrible", "Splendid", "Ordinary", "Ugly"],
          correct: 1,
        },
        {
          word: "Diligent",
          question: 'What does "Diligent" mean?',
          options: ["Lazy", "Hardworking", "Careless", "Slow"],
          correct: 1,
        },
        {
          word: "Courageous",
          question: 'What does "Courageous" mean?',
          options: ["Cowardly", "Brave", "Fearful", "Weak"],
          correct: 1,
        },
        {
          word: "Generous",
          question: 'What does "Generous" mean?',
          options: ["Selfish", "Giving freely", "Greedy", "Stingy"],
          correct: 1,
        },
        {
          word: "Peculiar",
          question: 'What does "Peculiar" mean?',
          options: ["Normal", "Strange", "Common", "Usual"],
          correct: 1,
        },
        {
          word: "Brilliant",
          question: 'What does "Brilliant" mean?',
          options: ["Dull", "Very smart", "Stupid", "Average"],
          correct: 1,
        },
        {
          word: "Ancient",
          question: 'What does "Ancient" mean?',
          options: ["New", "Very old", "Modern", "Recent"],
          correct: 1,
        },
        {
          word: "Enormous",
          question: 'What does "Enormous" mean?',
          options: ["Tiny", "Huge", "Medium", "Small"],
          correct: 1,
        },
        {
          word: "Delicate",
          question: 'What does "Delicate" mean?',
          options: ["Strong", "Fragile", "Tough", "Sturdy"],
          correct: 1,
        },
        {
          word: "Furious",
          question: 'What does "Furious" mean?',
          options: ["Calm", "Very angry", "Happy", "Peaceful"],
          correct: 1,
        },
      ],
    },
    synonyms: {
      "Class I": [
        {
          word: "Happy",
          question: 'Which word means the same as "Happy"?',
          options: ["Sad", "Glad", "Mad", "Bad"],
          correct: 1,
        },
        {
          word: "Big",
          question: 'Which word means the same as "Big"?',
          options: ["Small", "Large", "Tiny", "Little"],
          correct: 1,
        },
        {
          word: "Fast",
          question: 'Which word means the same as "Fast"?',
          options: ["Slow", "Quick", "Late", "Heavy"],
          correct: 1,
        },
        {
          word: "Smart",
          question: 'Which word means the same as "Smart"?',
          options: ["Dumb", "Clever", "Silly", "Lazy"],
          correct: 1,
        },
        {
          word: "Pretty",
          question: 'Which word means the same as "Pretty"?',
          options: ["Ugly", "Beautiful", "Mean", "Dirty"],
          correct: 1,
        },
        {
          word: "Jump",
          question: 'Which word means the same as "Jump"?',
          options: ["Sit", "Leap", "Sleep", "Walk"],
          correct: 1,
        },
        {
          word: "Scared",
          question: 'Which word means the same as "Scared"?',
          options: ["Brave", "Afraid", "Happy", "Calm"],
          correct: 1,
        },
        {
          word: "Funny",
          question: 'Which word means the same as "Funny"?',
          options: ["Sad", "Amusing", "Boring", "Serious"],
          correct: 1,
        },
        {
          word: "Help",
          question: 'Which word means the same as "Help"?',
          options: ["Stop", "Assist", "Hurt", "Hide"],
          correct: 1,
        },
        {
          word: "Look",
          question: 'Which word means the same as "Look"?',
          options: ["Close", "See", "Hear", "Sleep"],
          correct: 1,
        },
      ],
      "Class V": [
        {
          word: "Enormous",
          question: 'Which word means the same as "Enormous"?',
          options: ["Tiny", "Gigantic", "Medium", "Small"],
          correct: 1,
        },
        {
          word: "Brilliant",
          question: 'Which word means the same as "Brilliant"?',
          options: ["Dull", "Intelligent", "Stupid", "Average"],
          correct: 1,
        },
        {
          word: "Ancient",
          question: 'Which word means the same as "Ancient"?',
          options: ["Modern", "Old", "New", "Recent"],
          correct: 1,
        },
        {
          word: "Courageous",
          question: 'Which word means the same as "Courageous"?',
          options: ["Cowardly", "Brave", "Weak", "Fearful"],
          correct: 1,
        },
        {
          word: "Magnificent",
          question: 'Which word means the same as "Magnificent"?',
          options: ["Terrible", "Splendid", "Awful", "Plain"],
          correct: 1,
        },
      ],
    },
    antonyms: {
      "Class I": [
        {
          word: "Hot",
          question: 'Which word means the opposite of "Hot"?',
          options: ["Warm", "Cold", "Cool", "Mild"],
          correct: 1,
        },
        {
          word: "Up",
          question: 'Which word means the opposite of "Up"?',
          options: ["High", "Down", "Over", "Above"],
          correct: 1,
        },
        {
          word: "Big",
          question: 'Which word means the opposite of "Big"?',
          options: ["Large", "Small", "Huge", "Giant"],
          correct: 1,
        },
        {
          word: "Happy",
          question: 'Which word means the opposite of "Happy"?',
          options: ["Glad", "Sad", "Joyful", "Cheerful"],
          correct: 1,
        },
        {
          word: "Fast",
          question: 'Which word means the opposite of "Fast"?',
          options: ["Quick", "Slow", "Speedy", "Swift"],
          correct: 1,
        },
        {
          word: "Light",
          question: 'Which word means the opposite of "Light"?',
          options: ["Bright", "Dark", "Shiny", "Clear"],
          correct: 1,
        },
        {
          word: "Good",
          question: 'Which word means the opposite of "Good"?',
          options: ["Great", "Bad", "Nice", "Fine"],
          correct: 1,
        },
        {
          word: "Open",
          question: 'Which word means the opposite of "Open"?',
          options: ["Wide", "Closed", "Free", "Clear"],
          correct: 1,
        },
        {
          word: "Day",
          question: 'Which word means the opposite of "Day"?',
          options: ["Morning", "Night", "Noon", "Evening"],
          correct: 1,
        },
        {
          word: "New",
          question: 'Which word means the opposite of "New"?',
          options: ["Fresh", "Old", "Young", "Modern"],
          correct: 1,
        },
      ],
    },
    grammar: {
      "Class I": [
        {
          sentence: "she goes to school",
          question: "What is wrong with this sentence?",
          options: [
            "Nothing wrong",
            "Should start with capital letter",
            "Missing period",
            "Both B and C",
          ],
          correct: 3,
        },
        {
          sentence: "I have a apple",
          question: "What is wrong with this sentence?",
          options: [
            'Should be "an apple"',
            'Should be "two apple"',
            "Nothing wrong",
            'Should be "the apple"',
          ],
          correct: 0,
        },
        {
          sentence: "The cat are sleeping",
          question: "What is wrong with this sentence?",
          options: [
            'Should be "cats are"',
            'Should be "cat is"',
            "Nothing wrong",
            'Should be "cat were"',
          ],
          correct: 1,
        },
        {
          sentence: "me like ice cream",
          question: "What is wrong with this sentence?",
          options: [
            'Should be "I like"',
            'Should be "me likes"',
            "Nothing wrong",
            'Should be "me liked"',
          ],
          correct: 0,
        },
        {
          sentence: "where is my book",
          question: "What is wrong with this sentence?",
          options: [
            "Should end with period",
            "Should end with question mark",
            "Nothing wrong",
            "Should end with exclamation",
          ],
          correct: 1,
        },
      ],
      "Class V": [
        {
          sentence: "Neither John nor his friends was present",
          question: "What is the correct form?",
          options: ["was present", "were present", "is present", "are present"],
          correct: 1,
        },
        {
          sentence: "She don't like vegetables",
          question: "What is the correct form?",
          options: ["don't like", "doesn't like", "didn't like", "won't like"],
          correct: 1,
        },
        {
          sentence: "The team are playing well",
          question: "What is the correct form?",
          options: ["team are", "team is", "teams are", "teams is"],
          correct: 1,
        },
        {
          sentence: "I have went to the market",
          question: "What is the correct form?",
          options: ["have went", "have gone", "has went", "has gone"],
          correct: 1,
        },
        {
          sentence: "Between you and I, this is secret",
          question: "What is the correct form?",
          options: ["you and I", "you and me", "I and you", "me and you"],
          correct: 1,
        },
      ],
    },
    comprehension: {
      "Class I": [
        {
          passage:
            "Tom has a pet cat named Whiskers. Whiskers is black and white. Every morning, Tom gives Whiskers milk and fish. Whiskers likes to play with a ball of yarn. At night, Whiskers sleeps on Tom's bed.",
          questions: [
            {
              question: "What is the name of Tom's cat?",
              options: ["Fluffy", "Whiskers", "Mittens", "Shadow"],
              correct: 1,
            },
            {
              question: "What color is Whiskers?",
              options: ["All black", "Black and white", "All white", "Brown"],
              correct: 1,
            },
            {
              question: "What does Whiskers like to play with?",
              options: ["A mouse", "A ball of yarn", "A toy car", "A bone"],
              correct: 1,
            },
          ],
        },
      ],
      "Class V": [
        {
          passage:
            "The Amazon rainforest is often called the \"lungs of the Earth\" because it produces about 20% of the world's oxygen. This vast forest covers much of the Amazon Basin in South America. It is home to millions of species of plants, animals, and insects. Many of these species are found nowhere else on Earth. The rainforest plays a crucial role in regulating the world's climate by absorbing carbon dioxide from the atmosphere.",
          questions: [
            {
              question: 'Why is the Amazon called the "lungs of the Earth"?',
              options: [
                "It's very large",
                "It produces oxygen",
                "It has many animals",
                "It rains a lot",
              ],
              correct: 1,
            },
            {
              question:
                "How much of the world's oxygen does the Amazon produce?",
              options: ["10%", "20%", "30%", "40%"],
              correct: 1,
            },
            {
              question: "What does the rainforest absorb from the atmosphere?",
              options: ["Oxygen", "Water", "Carbon dioxide", "Nitrogen"],
              correct: 2,
            },
          ],
        },
      ],
    },
    wordbuilding: {
      "Class I": [
        { letters: "CAT", target: 3, words: ["CAT", "ACT", "TAC"] },
        { letters: "DOG", target: 2, words: ["DOG", "GOD"] },
        { letters: "SUN", target: 2, words: ["SUN", "NUS"] },
        { letters: "PEN", target: 2, words: ["PEN", "NEP"] },
        { letters: "BAT", target: 3, words: ["BAT", "TAB", "ABT"] },
      ],
      "Class V": [
        {
          letters: "LISTEN",
          target: 5,
          words: ["LISTEN", "SILENT", "ENLIST", "INLETS", "TINSEL"],
        },
        {
          letters: "MASTER",
          target: 6,
          words: ["MASTER", "STREAM", "TAMERS", "MATERS", "ARMEST", "SMARTE"],
        },
        {
          letters: "GARDEN",
          target: 5,
          words: ["GARDEN", "DANGER", "RANGED", "GANDER", "GRANDE"],
        },
      ],
    },
    rhyming: {
      "Class I": [
        {
          word: "Cat",
          question: 'Which word rhymes with "Cat"?',
          options: ["Dog", "Hat", "Car", "Sun"],
          correct: 1,
        },
        {
          word: "Sun",
          question: 'Which word rhymes with "Sun"?',
          options: ["Moon", "Fun", "Star", "Sky"],
          correct: 1,
        },
        {
          word: "Ball",
          question: 'Which word rhymes with "Ball"?',
          options: ["Wall", "Book", "Tree", "Fish"],
          correct: 0,
        },
        {
          word: "Tree",
          question: 'Which word rhymes with "Tree"?',
          options: ["Leaf", "Bee", "Root", "Wood"],
          correct: 1,
        },
        {
          word: "House",
          question: 'Which word rhymes with "House"?',
          options: ["Home", "Mouse", "Door", "Room"],
          correct: 1,
        },
      ],
      "Class V": [
        {
          word: "Mountain",
          question: 'Which word rhymes with "Mountain"?',
          options: ["Valley", "Fountain", "River", "Forest"],
          correct: 1,
        },
        {
          word: "Ocean",
          question: 'Which word rhymes with "Ocean"?',
          options: ["Water", "Motion", "Beach", "Wave"],
          correct: 1,
        },
        {
          word: "Thunder",
          question: 'Which word rhymes with "Thunder"?',
          options: ["Lightning", "Wonder", "Storm", "Rain"],
          correct: 1,
        },
      ],
    },
  };

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isGameActive]);

  const startGame = async () => {
    if (!playerName || !selectedClass || !selectedGame) return;

    const game = games.find((g) => g.id === selectedGame);
    setIsGameActive(true);
    setScore(0);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentQuestionIndex(0);
    setGameCompleted(false);
    setTimeLeft(game.duration);
    setCurrentView("game");

    initializeGameState();
  };

  const initializeGameState = () => {
    const data =
      gameData[selectedGame]?.[selectedClass] ||
      gameData[selectedGame]?.["Class I"] ||
      [];

    switch (selectedGame) {
      case "spelling":
        setGameState({
          questions: data,
          currentQuestion: 0,
          input: "",
          feedback: "",
          showHint: false,
        });
        break;
      case "comprehension":
        setGameState({
          passages: data,
          currentPassage: 0,
          currentQuestion: 0,
          selectedAnswer: null,
          feedback: "",
          showPassage: true,
        });
        break;
      case "wordbuilding":
        setGameState({
          challenges: data,
          currentChallenge: 0,
          foundWords: [],
          input: "",
          feedback: "",
        });
        break;
      default:
        setGameState({
          questions: data,
          currentQuestion: 0,
          selectedAnswer: null,
          feedback: "",
        });
    }
  };

  const endGame = async () => {
    setIsGameActive(false);
    setGameCompleted(true);

    try {
      await db.collection("scores").add({
        playerName,
        class: selectedClass,
        game: selectedGame,
        score,
        correctAnswers,
        wrongAnswers,
        timestamp: new Date(),
        timeSpent: games.find((g) => g.id === selectedGame).duration - timeLeft,
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }

    setCurrentView("results");
  };

  const handleSpellingSubmit = () => {
    const currentWord = gameState.questions[gameState.currentQuestion];
    const isCorrect =
      gameState.input.toLowerCase().trim() === currentWord.word.toLowerCase();

    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
      setGameState({
        ...gameState,
        feedback: "✅ Correct! Well done!",
        input: "",
      });
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setGameState({
        ...gameState,
        feedback: `❌ Incorrect. The correct spelling is: ${currentWord.word}`,
        input: "",
      });
    }

    setTimeout(() => {
      if (gameState.currentQuestion < gameState.questions.length - 1) {
        setGameState({
          ...gameState,
          currentQuestion: gameState.currentQuestion + 1,
          feedback: "",
          showHint: false,
          input: "",
        });
        setCurrentQuestionIndex(gameState.currentQuestion + 1);
      } else {
        endGame();
      }
    }, 2000);
  };

  const handleMultipleChoice = (answerIndex) => {
    const question = gameState.questions[gameState.currentQuestion];
    const isCorrect = answerIndex === question.correct;

    if (isCorrect) {
      setScore(score + 10);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    setGameState({
      ...gameState,
      selectedAnswer: answerIndex,
      feedback: isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. The correct answer is: ${
            question.options[question.correct]
          }`,
    });

    setTimeout(() => {
      if (gameState.currentQuestion < gameState.questions.length - 1) {
        setGameState({
          ...gameState,
          currentQuestion: gameState.currentQuestion + 1,
          selectedAnswer: null,
          feedback: "",
        });
        setCurrentQuestionIndex(gameState.currentQuestion + 1);
      } else {
        endGame();
      }
    }, 2000);
  };

  const handleComprehensionAnswer = (answerIndex) => {
    const passage = gameState.passages[gameState.currentPassage];
    const question = passage.questions[gameState.currentQuestion];
    const isCorrect = answerIndex === question.correct;

    if (isCorrect) {
      setScore(score + 15);
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    setGameState({
      ...gameState,
      selectedAnswer: answerIndex,
      feedback: isCorrect
        ? "✅ Correct!"
        : `❌ Incorrect. The correct answer is: ${
            question.options[question.correct]
          }`,
    });

    setTimeout(() => {
      if (gameState.currentQuestion < passage.questions.length - 1) {
        setGameState({
          ...gameState,
          currentQuestion: gameState.currentQuestion + 1,
          selectedAnswer: null,
          feedback: "",
        });
      } else if (gameState.currentPassage < gameState.passages.length - 1) {
        setGameState({
          ...gameState,
          currentPassage: gameState.currentPassage + 1,
          currentQuestion: 0,
          selectedAnswer: null,
          feedback: "",
          showPassage: true,
        });
      } else {
        endGame();
      }
    }, 2000);
  };

  const handleWordBuilding = () => {
    const challenge = gameState.challenges[gameState.currentChallenge];
    const input = gameState.input.toUpperCase().trim();

    if (
      challenge.words.includes(input) &&
      !gameState.foundWords.includes(input)
    ) {
      const newFoundWords = [...gameState.foundWords, input];
      setScore(score + 5);
      setCorrectAnswers(correctAnswers + 1);

      setGameState({
        ...gameState,
        foundWords: newFoundWords,
        input: "",
        feedback: `✅ Great! You found "${input}"`,
      });

      if (newFoundWords.length >= challenge.target) {
        setTimeout(() => {
          if (gameState.currentChallenge < gameState.challenges.length - 1) {
            setGameState({
              ...gameState,
              currentChallenge: gameState.currentChallenge + 1,
              foundWords: [],
              input: "",
              feedback: "",
            });
          } else {
            endGame();
          }
        }, 2000);
      }
    } else if (gameState.foundWords.includes(input)) {
      setGameState({
        ...gameState,
        feedback: `⚠️ You already found "${input}"`,
        input: "",
      });
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setGameState({
        ...gameState,
        feedback: `❌ "${input}" is not a valid word from these letters`,
        input: "",
      });
    }

    setTimeout(() => {
      setGameState((prev) => ({ ...prev, feedback: "" }));
    }, 2000);
  };

  const resetGame = () => {
    setCurrentView("home");
    setSelectedClass("");
    setSelectedGame("");
    setGameState({});
    setScore(0);
    setTimeLeft(0);
    setIsGameActive(false);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentQuestionIndex(0);
    setGameCompleted(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAccuracyPercentage = () => {
    const total = correctAnswers + wrongAnswers;
    return total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
  };

  const renderHomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg animate-pulse">
            🏆 Master of Alphabet
          </h1>
          <p className="text-2xl text-white/90 mb-4">
            Ultimate English Language Skills Competition
          </p>
          <p className="text-lg text-white/80">
            8 Exciting Games • Class I to X • Real-time Scoring
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-white text-lg font-medium mb-3">
                👤 Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-4 text-lg rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-white text-lg font-medium mb-3">
                🎓 Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-4 text-lg rounded-xl border-2 border-white/20 bg-white/10 text-white focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">Choose your class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls} className="text-black bg-white">
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            🎮 Choose Your Game
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <div
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`${
                    game.color
                  } p-6 rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-xl ${
                    selectedGame === game.id
                      ? "ring-4 ring-white scale-105"
                      : ""
                  }`}
                >
                  <Icon className="w-10 h-10 text-white mb-4" />
                  <h3 className="text-white font-bold text-xl mb-3">
                    {game.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-3">
                    {game.description}
                  </p>
                  <div className="flex items-center text-white/80 text-xs">
                    <Timer className="w-4 h-4 mr-1" />
                    {Math.floor(game.duration / 60)} min
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={startGame}
            disabled={!playerName || !selectedClass || !selectedGame}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-12 py-5 rounded-2xl font-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-green-700 transition-all duration-300 shadow-2xl transform hover:scale-105 disabled:hover:scale-100"
          >
            <Play className="w-8 h-8 inline mr-3" />
            Start Competition
          </button>
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-6">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            🏅 Game Features
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div className="text-white">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Real-time Scoring</div>
            </div>
            <div className="text-white">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Timed Challenges</div>
            </div>
            <div className="text-white">
              <Users2 className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Class-wise Content</div>
            </div>
            <div className="text-white">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold">Performance Tracking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameScreen = () => {
    const game = games.find((g) => g.id === selectedGame);
    const totalQuestions =
      selectedGame === "comprehension"
        ? gameState.passages?.reduce(
            (acc, passage) => acc + passage.questions.length,
            0
          ) || 0
        : gameState.questions?.length || gameState.challenges?.length || 0;

    const currentProgress =
      selectedGame === "comprehension"
        ? (gameState.currentPassage * gameState.passages[0]?.questions.length ||
            0) +
          gameState.currentQuestion +
          1
        : gameState.currentQuestion + 1 || gameState.currentChallenge + 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center">
                  {React.createElement(game.icon, {
                    className: "w-8 h-8 mr-3",
                  })}
                  {game.name}
                </h2>
                <p className="text-white/80 text-lg">
                  {playerName} • {selectedClass}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-green-500 px-6 py-3 rounded-xl text-center">
                  <div className="text-white text-sm font-medium">Score</div>
                  <div className="text-white text-2xl font-bold">{score}</div>
                </div>
                <div className="bg-blue-500 px-6 py-3 rounded-xl text-center">
                  <div className="text-white text-sm font-medium">Correct</div>
                  <div className="text-white text-2xl font-bold">
                    {correctAnswers}
                  </div>
                </div>
                <div className="bg-red-500 px-6 py-3 rounded-xl text-center">
                  <div className="text-white text-sm font-medium">Time</div>
                  <div className="text-white text-2xl font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>
                  Progress: {currentProgress} / {totalQuestions}
                </span>
                <span>Accuracy: {getAccuracyPercentage()}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentProgress / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Game Content */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl min-h-96">
            {selectedGame === "spelling" && gameState.questions && (
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    Question {gameState.currentQuestion + 1} of{" "}
                    {gameState.questions.length}
                  </span>
                </div>

                <h3 className="text-4xl font-bold mb-6 text-gray-800">
                  Spell this word:
                </h3>
                <div className="text-6xl font-bold text-blue-600 mb-8">
                  {gameState.questions[gameState.currentQuestion]?.word}
                </div>

                <div className="mb-6">
                  <button
                    onClick={() =>
                      setGameState({
                        ...gameState,
                        showHint: !gameState.showHint,
                      })
                    }
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors mb-4"
                  >
                    {gameState.showHint ? "Hide Hint" : "Show Hint"}
                  </button>
                  {gameState.showHint && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        💡{" "}
                        {gameState.questions[gameState.currentQuestion]?.hint}
                      </p>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={gameState.input || ""}
                  onChange={(e) =>
                    setGameState({ ...gameState, input: e.target.value })
                  }
                  className="w-full max-w-lg p-6 text-3xl text-center border-3 border-gray-300 rounded-2xl mb-8 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  placeholder="Type your answer"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSpellingSubmit()
                  }
                  autoFocus
                />

                <button
                  onClick={handleSpellingSubmit}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                >
                  Submit Answer
                </button>

                {gameState.feedback && (
                  <div
                    className={`mt-6 p-6 rounded-2xl text-xl font-medium ${
                      gameState.feedback.includes("✅")
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : "bg-red-50 text-red-700 border-2 border-red-200"
                    }`}
                  >
                    {gameState.feedback}
                  </div>
                )}
              </div>
            )}

            {/* Multiple Choice Games */}
            {selectedGame === "grammar" && gameState.questions && (
              <div>
                <div className="mb-8 text-center">
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                    Question {gameState.currentQuestion + 1} of{" "}
                    {gameState.questions.length}
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4 text-gray-800">
                    {gameState.questions[gameState.currentQuestion]?.question}
                  </h3>
                  {/* Add this div to display the sentence being evaluated */}
                  <div className="text-2xl font-semibold text-gray-700 bg-gray-100 p-4 rounded-lg mb-6">
                    "{gameState.questions[gameState.currentQuestion]?.sentence}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {gameState.questions[gameState.currentQuestion]?.options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleMultipleChoice(index)}
                        disabled={gameState.selectedAnswer !== null}
                        className={`p-6 rounded-2xl font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
                          gameState.selectedAnswer === index
                            ? index ===
                              gameState.questions[gameState.currentQuestion]
                                .correct
                              ? "bg-green-500 text-white shadow-lg scale-105"
                              : "bg-red-500 text-white shadow-lg scale-105"
                            : gameState.selectedAnswer !== null &&
                              index ===
                                gameState.questions[gameState.currentQuestion]
                                  .correct
                            ? "bg-green-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-bold mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </button>
                    )
                  )}
                </div>

                {gameState.feedback && (
                  <div
                    className={`mt-8 p-6 rounded-2xl text-xl font-medium text-center ${
                      gameState.feedback.includes("✅")
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : "bg-red-50 text-red-700 border-2 border-red-200"
                    }`}
                  >
                    {gameState.feedback}
                  </div>
                )}
              </div>
            )}
            {(selectedGame === "vocabulary" ||
              selectedGame === "synonyms" ||
              selectedGame === "antonyms" ||
              selectedGame === "rhyming") &&
              gameState.questions && (
                <div>
                  <div className="mb-8 text-center">
                    <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                      Question {gameState.currentQuestion + 1} of{" "}
                      {gameState.questions.length}
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4 text-gray-800">
                      {gameState.questions[gameState.currentQuestion]?.question}
                    </h3>
                    {gameState.questions[gameState.currentQuestion]?.word && (
                      <div className="text-5xl font-bold text-purple-600 mb-6">
                        {selectedGame === "grammar"
                          ? `"${
                              gameState.questions[gameState.currentQuestion]
                                .sentence
                            }"`
                          : gameState.questions[gameState.currentQuestion].word}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {gameState.questions[
                      gameState.currentQuestion
                    ]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleMultipleChoice(index)}
                        disabled={gameState.selectedAnswer !== null}
                        className={`p-6 rounded-2xl font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
                          gameState.selectedAnswer === index
                            ? index ===
                              gameState.questions[gameState.currentQuestion]
                                .correct
                              ? "bg-green-500 text-white shadow-lg scale-105"
                              : "bg-red-500 text-white shadow-lg scale-105"
                            : gameState.selectedAnswer !== null &&
                              index ===
                                gameState.questions[gameState.currentQuestion]
                                  .correct
                            ? "bg-green-500 text-white shadow-lg scale-105"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-bold mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>

                  {gameState.feedback && (
                    <div
                      className={`mt-8 p-6 rounded-2xl text-xl font-medium text-center ${
                        gameState.feedback.includes("✅")
                          ? "bg-green-50 text-green-700 border-2 border-green-200"
                          : "bg-red-50 text-red-700 border-2 border-red-200"
                      }`}
                    >
                      {gameState.feedback}
                    </div>
                  )}
                </div>
              )}

            {/* Reading Comprehension */}
            {selectedGame === "comprehension" && gameState.passages && (
              <div>
                <div className="mb-6 text-center">
                  <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                    Passage {gameState.currentPassage + 1} • Question{" "}
                    {gameState.currentQuestion + 1}
                  </span>
                </div>

                {gameState.showPassage && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
                    <h4 className="text-lg font-bold text-blue-800 mb-3">
                      📖 Read the passage:
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {gameState.passages[gameState.currentPassage]?.passage}
                    </p>
                    <button
                      onClick={() =>
                        setGameState({ ...gameState, showPassage: false })
                      }
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Continue to Question
                    </button>
                  </div>
                )}

                {!gameState.showPassage && (
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        {
                          gameState.passages[gameState.currentPassage]
                            ?.questions[gameState.currentQuestion]?.question
                        }
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                      {gameState.passages[gameState.currentPassage]?.questions[
                        gameState.currentQuestion
                      ]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleComprehensionAnswer(index)}
                          disabled={gameState.selectedAnswer !== null}
                          className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                            gameState.selectedAnswer === index
                              ? index ===
                                gameState.passages[gameState.currentPassage]
                                  .questions[gameState.currentQuestion].correct
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                              : gameState.selectedAnswer !== null &&
                                index ===
                                  gameState.passages[gameState.currentPassage]
                                    .questions[gameState.currentQuestion]
                                    .correct
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          }`}
                        >
                          <span className="font-bold mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </button>
                      ))}
                    </div>

                    <div className="text-center mt-6">
                      <button
                        onClick={() =>
                          setGameState({ ...gameState, showPassage: true })
                        }
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        📖 Show Passage Again
                      </button>
                    </div>
                  </div>
                )}

                {gameState.feedback && (
                  <div
                    className={`mt-6 p-4 rounded-lg text-center ${
                      gameState.feedback.includes("✅")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gameState.feedback}
                  </div>
                )}
              </div>
            )}

            {/* Word Building */}
            {selectedGame === "wordbuilding" && gameState.challenges && (
              <div className="text-center">
                <div className="mb-6">
                  <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">
                    Challenge {gameState.currentChallenge + 1} of{" "}
                    {gameState.challenges.length}
                  </span>
                </div>

                <h3 className="text-3xl font-bold mb-4 text-gray-800">
                  Build Words from these Letters:
                </h3>
                <div className="text-6xl font-bold text-pink-600 mb-6 tracking-wider">
                  {gameState.challenges[gameState.currentChallenge]?.letters}
                </div>

                <p className="text-lg text-gray-600 mb-6">
                  Find{" "}
                  {gameState.challenges[gameState.currentChallenge]?.target}{" "}
                  words • Found: {gameState.foundWords?.length || 0}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {gameState.foundWords?.map((word, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      ✅ {word}
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  value={gameState.input || ""}
                  onChange={(e) =>
                    setGameState({
                      ...gameState,
                      input: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full max-w-md p-4 text-2xl text-center border-2 border-gray-300 rounded-lg mb-6 focus:border-pink-500 focus:outline-none"
                  placeholder="Type a word"
                  onKeyPress={(e) => e.key === "Enter" && handleWordBuilding()}
                />

                <button
                  onClick={handleWordBuilding}
                  className="bg-pink-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
                >
                  Submit Word
                </button>

                {gameState.feedback && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      gameState.feedback.includes("✅")
                        ? "bg-green-100 text-green-700"
                        : gameState.feedback.includes("⚠️")
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gameState.feedback}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={endGame}
              className="bg-red-500 text-white px-8 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium"
            >
              End Game
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <div className="mb-8">
            {score >= 80 ? (
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            ) : score >= 60 ? (
              <Award className="w-24 h-24 text-silver mx-auto mb-4" />
            ) : (
              <Star className="w-24 h-24 text-bronze mx-auto mb-4" />
            )}
          </div>

          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            {score >= 80
              ? "Outstanding!"
              : score >= 60
              ? "Great Job!"
              : "Good Effort!"}
          </h2>

          <div className="text-8xl font-bold text-blue-600 mb-6">{score}</div>
          <p className="text-2xl text-gray-600 mb-8">Points Scored</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-1">Player</div>
              <div className="font-bold text-lg">{playerName}</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-1">Correct Answers</div>
              <div className="font-bold text-lg">{correctAnswers}</div>
            </div>
            <div className="bg-red-50 rounded-2xl p-6">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-1">Wrong Answers</div>
              <div className="font-bold text-lg">{wrongAnswers}</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-500 mb-1">Accuracy</div>
              <div className="font-bold text-lg">
                {getAccuracyPercentage()}%
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Game Summary</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-sm text-gray-500 mb-1">Class</div>
                <div className="font-bold text-lg">{selectedClass}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Game</div>
                <div className="font-bold text-lg">
                  {games.find((g) => g.id === selectedGame)?.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Time Spent</div>
                <div className="font-bold text-lg">
                  {formatTime(
                    games.find((g) => g.id === selectedGame).duration - timeLeft
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <button
              onClick={() => {
                setCurrentView("game");
                startGame();
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-bold text-lg shadow-lg transform hover:scale-105"
            >
              <RotateCcw className="w-6 h-6 inline mr-2" />
              Play Again
            </button>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-bold text-lg shadow-lg transform hover:scale-105"
            >
              <Home className="w-6 h-6 inline mr-2" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (currentView === "game" && isGameActive) {
    return renderGameScreen();
  } else if (currentView === "results") {
    return renderResultsScreen();
  } else {
    return renderHomeScreen();
  }
};

export default MasterOfAlphabet;
