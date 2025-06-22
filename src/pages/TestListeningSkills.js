import React, { useState, useEffect } from "react";
import {
  FaFeather,
  FaParagraph,
  FaBook,
  FaMicrophone,
  FaPlay,
  FaStop,
  FaTrophy,
  FaFire,
  FaStar,
  FaVolumeUp,
  FaHeart,
  FaGem,
  FaRocket,
  FaMagic,
  FaCrown,
  FaGift,
} from "react-icons/fa";
import {
  IoText,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSparkles,
  IoHeadset,
  IoMic,
  IoPlayCircle,
  IoStopCircle,
} from "react-icons/io5";

// Enhanced mock data with difficulty levels
const comprehensionTitles = [
  { id: 1, title: "The Cat and the Mouse", level: "Beginner", xp: 10, gems: 2 },
  { id: 2, title: "The Solar System", level: "Intermediate", xp: 15, gems: 3 },
  { id: 3, title: "Climate Change", level: "Advanced", xp: 20, gems: 5 },
  { id: 4, title: "Ocean Adventures", level: "Beginner", xp: 10, gems: 2 },
  { id: 5, title: "Technology Today", level: "Intermediate", xp: 15, gems: 3 },
];

const listeningPassages = [
  {
    id: 1,
    title: "The Cat and the Mouse",
    passage:
      "Once upon a time, a cat and a mouse lived in the same house. The cat was lazy, but the mouse was very hardworking. One day, the mouse found a piece of cheese and decided to save it for the winter. The cat, however, wanted to eat the cheese right away.",
    questions: [
      {
        question: "What did the mouse find?",
        options: ["A piece of bread", "A piece of cheese", "A piece of cake"],
        correctAnswer: 1,
        explanation:
          "The mouse found a piece of cheese, as mentioned in the passage.",
      },
      {
        question: "What did the cat want to do with the cheese?",
        options: [
          "Save it for winter",
          "Eat it right away",
          "Share it with the mouse",
        ],
        correctAnswer: 1,
        explanation:
          "The cat wanted to eat the cheese right away, as stated in the passage.",
      },
    ],
  },
  {
    id: 2,
    title: "The Solar System",
    passage:
      "The solar system consists of the Sun and the objects that orbit around it, including planets, moons, asteroids, and comets. The Sun is the largest object in the solar system and provides light and heat to all the planets.",
    questions: [
      {
        question: "What is the largest object in the solar system?",
        options: ["Earth", "The Sun", "Jupiter"],
        correctAnswer: 1,
        explanation:
          "The Sun is the largest object in the solar system, as mentioned in the passage.",
      },
      {
        question: "What does the Sun provide to the planets?",
        options: ["Light and heat", "Water and air", "Food and shelter"],
        correctAnswer: 0,
        explanation:
          "The Sun provides light and heat to the planets, as stated in the passage.",
      },
    ],
  },
];

const sentences = {
  "Very Short": "The sun shines.",
  Short: "Birds fly in the sky.",
  Long: "The quick brown fox jumps over the lazy dog.",
  "Very Long":
    "Despite the heavy rain, the children continued to play in the park.",
  "Extremely Long":
    "The majestic mountain stood tall, covered in a blanket of snow, as the sun slowly rose over the horizon.",
};

const paragraphs = [
  "The early bird catches the worm. This is a well-known saying that emphasizes the importance of starting your day early.",
  "A journey of a thousand miles begins with a single step. This proverb reminds us that every big achievement starts with a small action.",
  "Practice makes perfect. The more you practice, the better you become at any skill.",
  "Honesty is the best policy. Being truthful and honest always leads to better outcomes in life.",
  "Where there's a will, there's a way. If you are determined to achieve something, you will find a way to do it.",
];

const words = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
];

const categories = [
  {
    key: "Words",
    label: "Words",
    icon: <FaFeather size={40} />,
    color: "bg-gradient-to-br from-green-400 to-green-600",
    borderColor: "border-green-500",
    textColor: "text-green-600",
    description: "Listen and repeat words",
  },
  {
    key: "Sentences",
    label: "Sentences",
    icon: <IoText size={40} />,
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    borderColor: "border-orange-500",
    textColor: "text-orange-600",
    description: "Practice with sentences",
  },
  {
    key: "Paragraphs",
    label: "Paragraphs",
    icon: <FaParagraph size={40} />,
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    borderColor: "border-purple-500",
    textColor: "text-purple-600",
    description: "Master paragraph listening",
  },
  {
    key: "Comprehension",
    label: "Comprehension",
    icon: <FaBook size={40} />,
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    borderColor: "border-blue-500",
    textColor: "text-blue-600",
    description: "Test your understanding",
  },
];

const achievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first exercise",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: 2,
    name: "Word Master",
    description: "Complete 5 word exercises",
    icon: "📝",
    unlocked: false,
  },
  {
    id: 3,
    name: "Sentence Pro",
    description: "Complete 3 sentence exercises",
    icon: "💬",
    unlocked: false,
  },
  {
    id: 4,
    name: "Paragraph Expert",
    description: "Complete 2 paragraph exercises",
    icon: "📖",
    unlocked: false,
  },
  {
    id: 5,
    name: "Comprehension King",
    description: "Score 100% on comprehension",
    icon: "👑",
    unlocked: false,
  },
];

const TestListeningSkills = () => {
  const [selectedCategory, setSelectedCategory] = useState("Words");
  const [selectedClass, setSelectedClass] = useState("Class I & II");
  const [selectedLevel, setSelectedLevel] = useState("Rookie");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedLines, setSelectedLines] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [selectedWords, setSelectedWords] = useState("");
  const [currentPassage, setCurrentPassage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPassageRead, setIsPassageRead] = useState(false);

  // Additional state variables to add to your component state:
  const [wordInputs, setWordInputs] = useState({});
  const [currentWordsList, setCurrentWordsList] = useState([]);
  const [wordCheckResults, setWordCheckResults] = useState({
    submitted: false,
    results: {},
    score: 0,
    message: "",
    xpEarned: 0,
    gemsEarned: 0,
  });

  // Additional functions to add to your component:

  const handleWordInputChange = (index, value) => {
    setWordInputs((prev) => ({
      ...prev,
      [index]: value.toLowerCase().trim(),
    }));
  };

  const allWordsEntered = () => {
    const wordCount = parseInt(selectedWords);
    for (let i = 0; i < wordCount; i++) {
      if (!wordInputs[i] || wordInputs[i].trim() === "") {
        return false;
      }
    }
    return true;
  };

  const checkWordAnswers = () => {
    const wordCount = parseInt(selectedWords);
    const results = {};
    let correctCount = 0;

    for (let i = 0; i < wordCount; i++) {
      const userAnswer = (wordInputs[i] || "").toLowerCase().trim();
      const correctAnswer = currentWordsList[i].toLowerCase();
      results[i] = userAnswer === correctAnswer;
      if (results[i]) correctCount++;
    }

    const percentage = (correctCount / wordCount) * 100;
    let message, xpEarned, gemsEarned;

    if (percentage === 100) {
      message = "🌟 Perfect! You got all words correct!";
      xpEarned = parseInt(selectedWords) * 3;
      gemsEarned = parseInt(selectedWords);
    } else if (percentage >= 70) {
      message = "👍 Good job! Most words are correct!";
      xpEarned = parseInt(selectedWords) * 2;
      gemsEarned = Math.floor(parseInt(selectedWords) * 0.7);
    } else if (percentage >= 50) {
      message = "👌 Not bad! Keep practicing to improve!";
      xpEarned = parseInt(selectedWords);
      gemsEarned = Math.floor(parseInt(selectedWords) * 0.5);
    } else {
      message = "💪 Keep trying! Practice makes perfect!";
      xpEarned = Math.floor(parseInt(selectedWords) * 0.5);
      gemsEarned = 1;
    }

    setWordCheckResults({
      submitted: true,
      results,
      score: correctCount,
      message,
      xpEarned,
      gemsEarned,
    });

    // Award the rewards
    setTimeout(() => {
      awardRewards(xpEarned, gemsEarned, "Words");
    }, 1000);
  };

  const retryWordExercise = () => {
    setWordInputs({});
    setWordCheckResults({
      submitted: false,
      results: {},
      score: 0,
      message: "",
      xpEarned: 0,
      gemsEarned: 0,
    });
  };

  // Gamification states
  const [userStats, setUserStats] = useState({
    xp: 0,
    gems: 0,
    streak: 0,
    totalCompleted: 0,
    hearts: 5,
    level: 1,
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [userAchievements, setUserAchievements] = useState(achievements);
  const [exerciseStats, setExerciseStats] = useState({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    comprehension: 0,
  });

  const currentCategory = categories.find((c) => c.key === selectedCategory);

  // Calculate user level based on XP
  useEffect(() => {
    const newLevel = Math.floor(userStats.xp / 50) + 1;
    if (newLevel > userStats.level) {
      setUserStats((prev) => ({ ...prev, level: newLevel }));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [userStats.xp]);

  // Check for achievements
  const checkAchievements = (category) => {
    const newAchievements = [...userAchievements];
    let achievementUnlocked = false;

    if (userStats.totalCompleted === 1 && !newAchievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      achievementUnlocked = true;
      setShowAchievement(newAchievements[0]);
    }

    if (exerciseStats.words >= 5 && !newAchievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      achievementUnlocked = true;
      setShowAchievement(newAchievements[1]);
    }

    if (exerciseStats.sentences >= 3 && !newAchievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      achievementUnlocked = true;
      setShowAchievement(newAchievements[2]);
    }

    if (exerciseStats.paragraphs >= 2 && !newAchievements[3].unlocked) {
      newAchievements[3].unlocked = true;
      achievementUnlocked = true;
      setShowAchievement(newAchievements[3]);
    }

    if (achievementUnlocked) {
      setUserAchievements(newAchievements);
      setTimeout(() => setShowAchievement(null), 4000);
    }
  };

  // Award XP and gems
  const awardRewards = (xp, gems, category) => {
    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + xp,
      gems: prev.gems + gems,
      totalCompleted: prev.totalCompleted + 1,
      streak: prev.streak + 1,
    }));

    setExerciseStats((prev) => ({
      ...prev,
      [category.toLowerCase()]: prev[category.toLowerCase()] + 1,
    }));

    checkAchievements(category);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTitle("");
    setSelectedLines("");
    setSelectedSentence("");
    setSelectedWords("");
    setCurrentPassage(null);
    setIsPassageRead(false);
    setShowResults(false);
    setFeedback("");
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setHasRecorded(false);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setSelectedTitle(value);
    const passage = listeningPassages.find((p) => p.title === value);
    setCurrentPassage(passage);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setFeedback("");
    setIsPassageRead(false);
  };

  const handleLinesChange = (e) => {
    setSelectedLines(e.target.value);
    setHasRecorded(false);
  };

  const handleSentenceChange = (e) => {
    setSelectedSentence(e.target.value);
    setHasRecorded(false);
  };

  const handleWordsChange = (e) => {
    setSelectedWords(e.target.value);
    setHasRecorded(false);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    const currentQuestion = currentPassage.questions[questionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setFeedback(`🎉 Correct! ${currentQuestion.explanation}`);
    } else {
      setFeedback(
        `❌ Incorrect. The correct answer is: "${
          currentQuestion.options[currentQuestion.correctAnswer]
        }". ${currentQuestion.explanation}`
      );
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setFeedback("");
    } else {
      setShowResults(true);
      const { score } = calculateScore();
      if (score.includes("100%")) {
        // Perfect score achievement
        const newAchievements = [...userAchievements];
        if (!newAchievements[4].unlocked) {
          newAchievements[4].unlocked = true;
          setUserAchievements(newAchievements);
          setShowAchievement(newAchievements[4]);
        }
      }
    }
  };

  const calculateScore = () => {
    if (!currentPassage) {
      return { score: "0/0", feedbackMessage: "" };
    }
    const correctCount = Object.values(selectedAnswers).filter(
      (answer, idx) => answer === currentPassage.questions[idx].correctAnswer
    ).length;
    const total = currentPassage.questions.length;
    const scorePercent = (correctCount / total) * 100;

    let feedbackMessage = "";
    let xpReward = 0;
    let gemReward = 0;

    if (scorePercent === 100) {
      feedbackMessage = "🌟 Amazing job! You got all answers right!";
      xpReward = 20;
      gemReward = 5;
    } else if (scorePercent >= 70) {
      feedbackMessage =
        "👍 Good work! You did well, but there's room for improvement.";
      xpReward = 10;
      gemReward = 2;
    } else {
      feedbackMessage = "💪 Keep practicing to improve your listening skills!";
      xpReward = 5;
      gemReward = 1;
    }

    // Award rewards
    setTimeout(() => {
      awardRewards(xpReward, gemReward, "Comprehension");
    }, 1000);

    return {
      score: `${correctCount}/${total} (${Math.round(scorePercent)}%)`,
      feedbackMessage,
      xpReward,
      gemReward,
    };
  };

  const startListeningComprehension = () => {
    if (currentPassage && "speechSynthesis" in window) {
      const utteranceTitle = new SpeechSynthesisUtterance(
        `Listen carefully to: ${currentPassage.title}`
      );
      const utterancePassage = new SpeechSynthesisUtterance(
        currentPassage.passage
      );

      utteranceTitle.rate = 0.8;
      utterancePassage.rate = 0.8;

      utteranceTitle.onend = () => {
        setTimeout(() => {
          speechSynthesis.speak(utterancePassage);
        }, 1000);
      };

      utterancePassage.onend = () => {
        setIsPassageRead(true);
      };

      speechSynthesis.speak(utteranceTitle);
    } else {
      alert(
        "Text-to-speech is not supported in your browser or no passage is selected."
      );
    }
  };

  const startReadingParagraphs = () => {
    if ("speechSynthesis" in window) {
      const lines = parseInt(selectedLines, 10);
      const paragraph = paragraphs[lines - 1] || paragraphs[0];
      const utterance = new SpeechSynthesisUtterance(
        `Listen and repeat: ${paragraph}`
      );
      utterance.rate = 0.8;

      utterance.onend = () => {
        setHasRecorded(true);
        setTimeout(() => {
          awardRewards(8, 2, "Paragraphs");
        }, 500);
      };

      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const startReadingSentences = () => {
    if ("speechSynthesis" in window) {
      const sentence = sentences[selectedSentence];
      const utterance = new SpeechSynthesisUtterance(
        `Listen and repeat: ${sentence}`
      );
      utterance.rate = 0.8;

      utterance.onend = () => {
        setHasRecorded(true);
        setTimeout(() => {
          awardRewards(5, 1, "Sentences");
        }, 500);
      };

      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  // Modified startReadingWords function:
  const startReadingWords = () => {
    if ("speechSynthesis" in window) {
      const wordCount = parseInt(selectedWords, 10);
      const selectedWordsList = words.slice(0, wordCount);
      setCurrentWordsList(selectedWordsList); // Store the words for checking

      const wordsString = selectedWordsList.join(", ");
      const utterance = new SpeechSynthesisUtterance(
        `Listen carefully and remember these words: ${wordsString}`
      );
      utterance.rate = 0.7;

      utterance.onend = () => {
        setHasRecorded(true);
        // Reset input states when starting new exercise
        setWordInputs({});
        setWordCheckResults({
          submitted: false,
          results: {},
          score: 0,
          message: "",
          xpEarned: 0,
          gemsEarned: 0,
        });
      };

      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-5">
      {/* Header with stats */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-purple-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎧 Listening Adventure
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="font-bold text-yellow-700">
                Level {userStats.level}
              </span>
            </div>
            <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
              <FaRocket className="text-blue-500 mr-1" />
              <span className="font-bold text-blue-700">{userStats.xp} XP</span>
            </div>
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
              <FaGem className="text-green-500 mr-1" />
              <span className="font-bold text-green-700">{userStats.gems}</span>
            </div>
            <div className="flex items-center bg-red-100 px-3 py-1 rounded-full">
              <FaHeart className="text-red-500 mr-1" />
              <span className="font-bold text-red-700">{userStats.hearts}</span>
            </div>
            <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
              <FaFire className="text-orange-500 mr-1" />
              <span className="font-bold text-orange-700">
                {userStats.streak}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${(userStats.xp % 50) * 2}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {50 - (userStats.xp % 50)} XP to next level
        </p>
      </div>

      {/* Compact Category Grid - Single Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`${
              cat.color
            } text-white p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              cat.key === selectedCategory
                ? "ring-3 ring-white shadow-xl scale-105"
                : "shadow-md"
            }`}
            onClick={() => handleCategorySelect(cat.key)}
          >
            <div className="text-white mb-1 transform scale-75">{cat.icon}</div>
            <span className="text-sm font-bold">{cat.label}</span>
            <span className="text-xs opacity-90 mt-1 text-center leading-tight">
              {cat.description}
            </span>
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
        {/* Class and Level Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Class Group:
            </label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="Class I & II">Class I & II</option>
              <option value="Class III to V">Class III to V</option>
              <option value="Class VI to X">Class VI to X</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Level:
            </label>
            <select
              value={selectedLevel}
              onChange={handleLevelChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="Rookie">🌱 Rookie</option>
              <option value="Racer">🏃 Racer</option>
              <option value="Master">🎯 Master</option>
              <option value="Prodigy">🧠 Prodigy</option>
              <option value="Wizard">🧙 Wizard</option>
            </select>
          </div>
        </div>

        {/* Category-specific content */}
        {selectedCategory === "Comprehension" && (
          <div className="space-y-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Select a Story:
            </label>
            <select
              value={selectedTitle}
              onChange={handleTitleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">📚 Choose your adventure...</option>
              {comprehensionTitles.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title} - {item.level} (+{item.xp} XP, +{item.gems} 💎)
                </option>
              ))}
            </select>

            {currentPassage && !isPassageRead && (
              <button
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                onClick={startListeningComprehension}
              >
                <IoHeadset size={24} />
                <span>🎧 Start Listening Adventure</span>
              </button>
            )}

            {currentPassage && isPassageRead && !showResults && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">❓</span>
                  <h3 className="text-xl font-bold text-gray-800">
                    Question {currentQuestionIndex + 1} of{" "}
                    {currentPassage.questions.length}
                  </h3>
                </div>
                <p className="text-lg mb-4 text-gray-700">
                  {currentPassage.questions[currentQuestionIndex].question}
                </p>

                <div className="space-y-3">
                  {currentPassage.questions[currentQuestionIndex].options.map(
                    (option, idx) => (
                      <button
                        key={idx}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedAnswers[currentQuestionIndex] === idx
                            ? "bg-blue-100 border-blue-500 shadow-lg"
                            : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-md"
                        }`}
                        onClick={() =>
                          handleAnswerSelect(currentQuestionIndex, idx)
                        }
                        disabled={feedback !== ""}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + idx)}. {option}
                        </span>
                      </button>
                    )
                  )}
                </div>

                {feedback && (
                  <div className="mt-4 p-4 bg-white rounded-xl border-2 border-gray-200">
                    <p className="text-gray-700 font-medium">{feedback}</p>
                  </div>
                )}

                {feedback && (
                  <button
                    className="w-full py-3 px-6 rounded-xl mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold transform transition-all duration-200 hover:scale-105"
                    onClick={nextQuestion}
                  >
                    {currentQuestionIndex < currentPassage.questions.length - 1
                      ? "Next Question ➡️"
                      : "Finish Quiz 🎯"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {selectedCategory === "Paragraphs" && (
          <div className="space-y-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Select Paragraph Length:
            </label>
            <select
              value={selectedLines}
              onChange={handleLinesChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">📝 Choose difficulty...</option>
              <option value="1">🟢 Easy - 1 Line (+3 XP)</option>
              <option value="2">🟡 Medium - 2 Lines (+5 XP)</option>
              <option value="3">🟠 Hard - 3 Lines (+8 XP)</option>
              <option value="4">🔴 Expert - 4 Lines (+12 XP)</option>
              <option value="5">🟣 Master - 5 Lines (+15 XP)</option>
            </select>

            {selectedLines && (
              <div className="space-y-4">
                <button
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  onClick={startReadingParagraphs}
                >
                  <FaVolumeUp size={20} />
                  <span>🎵 Listen to Paragraph</span>
                </button>

                {hasRecorded && (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <IoCheckmarkCircle size={24} />
                      <span className="font-bold">
                        Great job! You've completed this exercise! 🎉
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedCategory === "Sentences" && (
          <div className="space-y-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Select Sentence Difficulty:
            </label>
            <select
              value={selectedSentence}
              onChange={handleSentenceChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">🎯 Choose your challenge...</option>
              <option value="Very Short">🟢 Very Short (+2 XP)</option>
              <option value="Short">🟡 Short (+3 XP)</option>
              <option value="Long">🟠 Long (+5 XP)</option>
              <option value="Very Long">🔴 Very Long (+8 XP)</option>
              <option value="Extremely Long">🟣 Extremely Long (+10 XP)</option>
            </select>

            {selectedSentence && (
              <div className="space-y-4">
                <button
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  onClick={startReadingSentences}
                >
                  <FaVolumeUp size={20} />
                  <span>🗣️ Listen to Sentence</span>
                </button>

                {hasRecorded && (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-center space-x-2 text-green-700">
                      <IoCheckmarkCircle size={24} />
                      <span className="font-bold">
                        Excellent! Exercise completed! 🌟
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedCategory === "Words" && (
          <div className="space-y-4">
            <label className="block text-sm font-bold mb-2 text-gray-700">
              Select Number of Words:
            </label>
            <select
              value={selectedWords}
              onChange={handleWordsChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">🎪 Pick your challenge...</option>
              <option value="1">🟢 1 Word - Starter (+2 XP)</option>
              <option value="2">🟡 2 Words - Easy (+3 XP)</option>
              <option value="3">🟠 3 Words - Medium (+4 XP)</option>
              <option value="4">🔴 4 Words - Hard (+5 XP)</option>
              <option value="5">🟣 5 Words - Expert (+6 XP)</option>
            </select>

            {selectedWords && !hasRecorded && (
              <div className="space-y-4">
                <button
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  onClick={startReadingWords}
                >
                  <FaVolumeUp size={20} />
                  <span>🔤 Listen to Words</span>
                </button>
              </div>
            )}

            {hasRecorded && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                    <span className="mr-2">✍️</span>
                    Type the words you heard in the correct order:
                  </h4>

                  <div className="grid gap-3">
                    {Array.from(
                      { length: parseInt(selectedWords) },
                      (_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold min-w-[2rem] text-center">
                            {index + 1}
                          </span>
                          <input
                            type="text"
                            placeholder={`Word ${index + 1}...`}
                            value={wordInputs[index] || ""}
                            onChange={(e) =>
                              handleWordInputChange(index, e.target.value)
                            }
                            className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                            disabled={wordCheckResults.submitted}
                          />
                          {wordCheckResults.submitted && (
                            <div className="w-8 h-8 flex items-center justify-center">
                              {wordCheckResults.results[index] ? (
                                <IoCheckmarkCircle className="text-green-500 text-xl" />
                              ) : (
                                <IoCloseCircle className="text-red-500 text-xl" />
                              )}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={checkWordAnswers}
                      disabled={
                        wordCheckResults.submitted || !allWordsEntered()
                      }
                      className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-200 ${
                        wordCheckResults.submitted || !allWordsEntered()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 hover:shadow-lg"
                      } flex items-center justify-center space-x-2`}
                    >
                      <span>🎯 Check Answers</span>
                    </button>

                    {wordCheckResults.submitted && (
                      <button
                        onClick={retryWordExercise}
                        className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>🔄 Try Again</span>
                      </button>
                    )}
                  </div>
                </div>

                {wordCheckResults.submitted && (
                  <div
                    className={`p-4 rounded-xl border-2 ${
                      wordCheckResults.score === parseInt(selectedWords)
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {wordCheckResults.score === parseInt(selectedWords)
                          ? "🎉"
                          : "👍"}
                      </div>
                      <h4 className="font-bold text-lg mb-2">
                        Score: {wordCheckResults.score}/{selectedWords}(
                        {Math.round(
                          (wordCheckResults.score / parseInt(selectedWords)) *
                            100
                        )}
                        %)
                      </h4>
                      <p className="text-gray-700 mb-3">
                        {wordCheckResults.message}
                      </p>

                      <div className="bg-white p-3 rounded-xl mb-3">
                        <h5 className="font-bold text-gray-800 mb-2">
                          📚 Correct Answers:
                        </h5>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {currentWordsList.map((word, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
                            >
                              {index + 1}. {word}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl">
                        <h5 className="font-bold text-gray-800 mb-2">
                          🎁 Rewards Earned:
                        </h5>
                        <div className="flex justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaRocket className="text-blue-500" />
                            <span className="font-bold">
                              +{wordCheckResults.xpEarned} XP
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaGem className="text-green-500" />
                            <span className="font-bold">
                              +{wordCheckResults.gemsEarned} Gems
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div className="mt-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Quiz Complete!
              </h3>
              <p className="text-xl text-gray-700 mb-4">
                You scored {calculateScore().score}!
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {calculateScore().feedbackMessage}
              </p>

              <div className="bg-white p-4 rounded-xl mb-4">
                <h4 className="font-bold text-gray-800 mb-3">
                  🎯 Rewards Earned:
                </h4>
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <FaRocket className="text-blue-500" />
                    <span className="font-bold">
                      +{calculateScore().xpReward} XP
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaGem className="text-green-500" />
                    <span className="font-bold">
                      +{calculateScore().gemReward} Gems
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl">
                <h4 className="font-bold text-gray-800 mb-3">
                  💡 Tips to Improve:
                </h4>
                <div className="text-left space-y-2">
                  <p>• 👂 Listen carefully to every word</p>
                  <p>• 📝 Take mental notes while listening</p>
                  <p>• 🔄 Practice regularly to build your skills</p>
                  <p>• 🎯 Focus on key information in passages</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl transform animate-bounce">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-xl font-bold">Great Job!</div>
              <div className="text-sm">You earned rewards!</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md mx-4 transform animate-pulse">
            <div className="text-center">
              <div className="text-6xl mb-4">{showAchievement.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Achievement Unlocked!
              </h3>
              <h4 className="text-lg font-semibold text-purple-600 mb-2">
                {showAchievement.name}
              </h4>
              <p className="text-gray-600 mb-4">
                {showAchievement.description}
              </p>
              <button
                onClick={() => setShowAchievement(null)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold"
              >
                Awesome! 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaTrophy className="text-yellow-500 mr-2" />
          Your Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-3xl mb-2 ${
                    achievement.unlocked ? "" : "grayscale opacity-50"
                  }`}
                >
                  {achievement.icon}
                </div>
                <h4
                  className={`font-bold mb-1 ${
                    achievement.unlocked ? "text-yellow-700" : "text-gray-500"
                  }`}
                >
                  {achievement.name}
                </h4>
                <p
                  className={`text-sm ${
                    achievement.unlocked ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                      ✓ Unlocked
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p className="flex items-center justify-center space-x-2">
          <IoSparkles className="text-purple-500" />
          <span>Keep practicing to become a listening master!</span>
          <IoSparkles className="text-purple-500" />
        </p>
      </div>
    </div>
  );
};

export default TestListeningSkills;
