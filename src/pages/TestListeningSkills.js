import React, { useState, useEffect, useRef } from "react";
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

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

function normalize(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "");
}

function renderSpokenFeedback(prompt, spoken) {
  if (!prompt || !spoken) return null;
  const promptWords = prompt.trim().split(/\s+/);
  const spokenWords = spoken.trim().split(/\s+/);
  const maxLen = Math.max(promptWords.length, spokenWords.length);
  const elements = [];
  for (let i = 0; i < maxLen; i++) {
    const promptWord = promptWords[i] || "";
    const spokenWord = spokenWords[i] || "";
    let colorClass = "";
    if (!spokenWord) {
      colorClass = "bg-yellow-100 text-yellow-600 font-bold";
    } else if (normalize(promptWord) === normalize(spokenWord)) {
      colorClass = "bg-green-100 text-green-700 font-bold";
    } else {
      colorClass = "bg-red-100 text-red-700 font-bold";
    }
    elements.push(
      <span
        key={i}
        className={
          "inline-block px-2 py-1 mx-1 my-1 rounded-xl transition-colors " +
          colorClass
        }
      >
        {spokenWord || <span className="opacity-40">{promptWord}</span>}
      </span>
    );
  }
  return elements;
}

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
      "Once upon a time, a cat and a mouse lived in the same house. The cat was lazy, but the mouse was very hardworking. One day, the mouse found a piece of cheese and decided to save it for the winter. The cat, however, wanted to eat it right away. The mouse hid the cheese, but the cat found it and ate it all.",
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
      "The solar system consists of the Sun and the objects that orbit around it, including planets, moons, asteroids, and comets. The Sun is the largest object in the solar system and provides light and heat to the planets.",
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
  "The early bird catches the worm.",
  "A journey begins with a single step. This proverb teaches us about beginnings.",
  "Practice makes perfect. Consistent effort improves skills. Mastery comes from repetition.",
  "Honesty is the best policy. Truthfulness leads to better outcomes. Integrity builds trust in relationships. A good reputation is valuable.",
  "Where there's a will, there's a way. Determination finds solutions. Persistence overcomes obstacles. Challenges make us stronger. The only true failure is giving up.",
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

function AnswerStyleSelector({ answerStyle, setAnswerStyle }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold mb-2 text-gray-700">
        Answer Style:
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setAnswerStyle("drag")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            answerStyle === "drag"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🧩 Drag & Drop
        </button>
        <button
          onClick={() => setAnswerStyle("record")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            answerStyle === "record"
              ? "bg-green-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🎤 Record Answer
        </button>
        <button
          onClick={() => setAnswerStyle("type")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            answerStyle === "type"
              ? "bg-purple-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ✍️ Type Answer
        </button>
      </div>
    </div>
  );
}

function MicListeningSection({
  prompt,
  disabled,
  onResult,
  onCheckAnswer,
  micLabel = "🎤 Speak",
  placeholder = "Click mic and repeat...",
  sectionType = "sentence",
  showFeedback = false,
  feedbackMessage = "",
}) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    setIsListening(false);
    setIsProcessing(false);
    setSpokenText("");
    setError("");
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, [prompt]);

  const startListening = () => {
    if (!SpeechRecognition) {
      setError(
        "Speech recognition not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }
    setIsListening(true);
    setIsProcessing(false);
    setSpokenText("");
    setError("");
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (event) => {
      setIsProcessing(true);
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setIsListening(false);
      setIsProcessing(false);
      setSpokenText(transcript);
      setError("");
      if (onResult) onResult(transcript);
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
    };
    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      setIsProcessing(false);
      let msg = "Please try again.";
      switch (event.error) {
        case "no-speech":
          msg = "No speech detected. Please speak clearly!";
          break;
        case "audio-capture":
          msg = "Microphone not found. Please check your microphone!";
          break;
        case "not-allowed":
          msg = "Microphone permission denied. Please allow microphone access!";
          break;
        case "network":
          msg = "Network error. Please check your connection!";
          break;
        default:
          msg = "An unknown error occurred.";
          break;
      }
      setError(msg);
    };
    setIsListening(true);
    setIsProcessing(false);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setIsProcessing(false);
  };

  return (
    <div className="my-6">
      <div className="flex items-center justify-center mb-4 gap-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={disabled}
          className={`${
            isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white p-5 rounded-full text-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <IoMic className="w-8 h-8" />
          ) : (
            <FaMicrophone className="w-8 h-8" />
          )}
        </button>
        <span className="text-lg font-semibold">
          {isListening ? "🎤 Listening... Speak now!" : placeholder}
        </span>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center text-gray-500 mb-2">
          <span className="animate-spin mr-2">
            <FaMagic />
          </span>
          Processing your answer...
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mb-2 text-center">
          {error}
        </div>
      )}

      {spokenText && (
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-5 text-center mb-2">
            <div className="text-sm text-gray-600 mb-1">You said:</div>
            <div
              className={`${
                sectionType === "word"
                  ? "text-4xl"
                  : sectionType === "sentence"
                  ? "text-2xl"
                  : "text-xl"
              } font-bold`}
            >
              {showFeedback
                ? renderSpokenFeedback(prompt, spokenText)
                : spokenText}
            </div>
          </div>

          {onCheckAnswer && (
            <button
              onClick={() => onCheckAnswer(spokenText)}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold hover:scale-105 hover:shadow-lg transition-all duration-200"
            >
              🎯 Check My Answer
            </button>
          )}

          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl ${
                feedbackMessage.includes("Perfect")
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {feedbackMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
  const [wordInputs, setWordInputs] = useState({});
  const [currentWordsList, setCurrentWordsList] = useState([]);
  const [wordCheckResults, setWordCheckResults] = useState({
    submitted: false,
    results: {},
    score: 0,
    message: "",
    xpEarned: 0,
    gemsEarned: 0,
    showFeedback: false,
  });
  const [sentenceInput, setSentenceInput] = useState("");
  const [currentSentenceWords, setCurrentSentenceWords] = useState([]);
  const [jumbledWords, setJumbledWords] = useState([]);
  const [arrangedWords, setArrangedWords] = useState([]);
  const [sentenceCheckResults, setSentenceCheckResults] = useState({
    submitted: false,
    isCorrect: false,
    message: "",
    xpEarned: 0,
    gemsEarned: 0,
    showFeedback: false,
  });
  const [draggedWord, setDraggedWord] = useState(null);
  const [paragraphSentences, setParagraphSentences] = useState([]);
  const [jumbledParagraphSentences, setJumbledParagraphSentences] = useState(
    []
  );
  const [arrangedParagraphSentences, setArrangedParagraphSentences] = useState(
    []
  );
  const [paragraphInput, setParagraphInput] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [paragraphCheckResults, setParagraphCheckResults] = useState({
    submitted: false,
    isCorrect: false,
    message: "",
    xpEarned: 0,
    gemsEarned: 0,
    showFeedback: false,
  });
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
  const [micEnabled, setMicEnabled] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [answerStyle, setAnswerStyle] = useState("drag");

  const currentCategory = categories.find((c) => c.key === selectedCategory);

  // Add this state to track the current interaction mode
  const [interactionMode, setInteractionMode] = useState("typing"); // 'typing' or 'drag'

  // Add a state to track submission
  const [checkedAnswers, setCheckedAnswers] = useState({});

  const [userAnswers, setUserAnswers] = useState({});
  // Make sure activeTab is properly declared as state/prop
  const [activeTab, setActiveTab] = useState("words"); // or from props

  
  useEffect(() => {
    setUserAnswers({});
    setCheckedAnswers({});
    // Add other resets as needed
  }, [activeTab]);

  useEffect(() => {
    const newLevel = Math.floor(userStats.xp / 50) + 1;
    if (newLevel > userStats.level) {
      setUserStats((prev) => ({ ...prev, level: newLevel }));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [userStats.xp]);

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
    setMicEnabled(false);
    setAnswerStyle("drag");
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
    setMicEnabled(false);
  };

  const handleSentenceChange = (e) => {
    setSelectedSentence(e.target.value);
    setHasRecorded(false);
    setMicEnabled(false);
    setSentenceInput("");
    setCurrentSentenceWords([]);
    setJumbledWords([]);
    setArrangedWords([]);
    setSentenceCheckResults({
      submitted: false,
      isCorrect: false,
      message: "",
      xpEarned: 0,
      gemsEarned: 0,
      showFeedback: false,
    });
  };

  const handleWordsChange = (e) => {
    setSelectedWords(e.target.value);
    setHasRecorded(false);
    setMicEnabled(false);
    setWordInputs({});
    setWordCheckResults({
      submitted: false,
      results: {},
      score: 0,
      message: "",
      xpEarned: 0,
      gemsEarned: 0,
      showFeedback: false,
    });
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

  const checkParagraphOrder = () => {
    const expectedCount = parseInt(selectedLines);
    const isComplete = arrangedParagraphSentences.length === expectedCount;
    const isCorrect =
      isComplete &&
      arrangedParagraphSentences.every(
        (sentence, index) => sentence === paragraphSentences[index]
      );

    let message, xpEarned, gemsEarned;
    const baseXP = expectedCount * 4;

    if (isCorrect) {
      message = "🌟 Perfect! You arranged all sentences correctly!";
      xpEarned = baseXP * 2;
      gemsEarned = expectedCount;
    } else if (isComplete) {
      const correctCount = arrangedParagraphSentences.reduce(
        (count, sentence, index) =>
          count + (sentence === paragraphSentences[index] ? 1 : 0),
        0
      );
      message = `👍 ${correctCount}/${expectedCount} correct. Keep trying!`;
      xpEarned = Math.floor(baseXP * (correctCount / expectedCount));
      gemsEarned = Math.max(1, correctCount);
    } else {
      message = `Please arrange all ${expectedCount} sentences.`;
      xpEarned = 0;
      gemsEarned = 0;
    }

    setParagraphCheckResults({
      submitted: isComplete,
      isCorrect,
      message,
      xpEarned,
      gemsEarned,
      showFeedback: true,
    });

    if (isCorrect) {
      setTimeout(() => {
        awardRewards(xpEarned, gemsEarned, "Paragraphs");
      }, 1000);
    }
  };

  const retryParagraphExercise = () => {
    setJumbledParagraphSentences(shuffleArray([...paragraphSentences]));
    setArrangedParagraphSentences([]);
    setParagraphCheckResults({
      submitted: false,
      isCorrect: false,
      message: "",
      xpEarned: 0,
      gemsEarned: 0,
      showFeedback: false,
    });
  };

  const startReadingParagraphs = () => {
    if ("speechSynthesis" in window) {
      const lines = parseInt(selectedLines, 10);
      const paragraph = paragraphs[lines - 1] || paragraphs[0];

      const sentences = splitSentences(paragraph, lines);

      if (sentences.length < lines) {
        while (sentences.length < lines) {
          sentences.push("Sample sentence " + (sentences.length + 1) + ".");
        }
      } else if (sentences.length > lines) {
        sentences.length = lines;
      }

      setParagraphSentences(sentences);
      setJumbledParagraphSentences(shuffleArray([...sentences]));
      setArrangedParagraphSentences([]);
      setParagraphCheckResults({
        submitted: false,
        isCorrect: false,
        message: "",
        xpEarned: 0,
        gemsEarned: 0,
        showFeedback: false,
      });

      const utterance = new SpeechSynthesisUtterance(
        `Listen carefully to this paragraph and remember the order of ${lines} sentences: ${paragraph}`
      );
      utterance.rate = 0.8;

      utterance.onend = () => {
        setHasRecorded(true);
        setMicEnabled(true);
      };

      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const splitSentences = (paragraph) => {
    return paragraph
      .split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s+/)
      .filter((s) => s.trim().length > 0)
      .map((s) => {
        let sentence = s.trim();
        if (!/[.!?]$/.test(sentence)) {
          sentence += ".";
        }
        return sentence;
      });
  };

  const startReadingSentences = () => {
    if ("speechSynthesis" in window) {
      const sentence = sentences[selectedSentence];
      const utterance = new SpeechSynthesisUtterance(
        `Listen carefully and remember this sentence: ${sentence}`
      );
      utterance.rate = 0.7;

      utterance.onend = () => {
        setHasRecorded(true);
        setMicEnabled(true);
        const words = sentence.split(" ");
        setCurrentSentenceWords(words);
        setJumbledWords(shuffleArray([...words]));
        setArrangedWords([]);
        setSentenceCheckResults({
          submitted: false,
          isCorrect: false,
          message: "",
          xpEarned: 0,
          gemsEarned: 0,
          showFeedback: false,
        });
      };

      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const checkSentenceAnswer = () => {
    let userSentence = "";
    let isCorrect = false;
    let message = "";
    let xpEarned = 0;
    let gemsEarned = 0;

    if (answerStyle === "drag") {
      userSentence = arrangedWords.join(" ").toLowerCase().trim();
      isCorrect =
        userSentence === sentences[selectedSentence].toLowerCase().trim();
    } else if (answerStyle === "record") {
      // Already handled in onCheckAnswer
      return;
    } else if (answerStyle === "type") {
      userSentence = sentenceInput.toLowerCase().trim();
      isCorrect =
        userSentence === sentences[selectedSentence].toLowerCase().trim();
    }

    if (isCorrect) {
      message = "🌟 Perfect! You got the sentence correct!";
      xpEarned = getSentenceXP(selectedSentence) * 2;
      gemsEarned = getSentenceGems(selectedSentence);
    } else {
      message = "💪 Not quite right. Try again!";
      xpEarned = Math.floor(getSentenceXP(selectedSentence) * 0.3);
      gemsEarned = 1;
    }

    setSentenceCheckResults({
      submitted: true,
      isCorrect,
      message,
      xpEarned,
      gemsEarned,
      showFeedback: true,
    });

    if (isCorrect) {
      setTimeout(() => {
        awardRewards(xpEarned, gemsEarned, "Sentences");
      }, 1000);
    }
  };

  const checkTypedSentence = () => {
    const userSentence = sentenceInput.toLowerCase().trim();
    const correctSentence = sentences[selectedSentence].toLowerCase().trim();
    const isCorrect = userSentence === correctSentence;

    let message, xpEarned, gemsEarned;

    if (isCorrect) {
      message = "🌟 Perfect! You typed the sentence correctly!";
      xpEarned = getSentenceXP(selectedSentence) * 2;
      gemsEarned = getSentenceGems(selectedSentence);
    } else {
      message = "💪 Not quite right. Try again!";
      xpEarned = Math.floor(getSentenceXP(selectedSentence) * 0.3);
      gemsEarned = 1;
    }

    setSentenceCheckResults({
      submitted: true,
      isCorrect,
      message,
      xpEarned,
      gemsEarned,
      showFeedback: true,
    });

    if (isCorrect) {
      setTimeout(() => {
        awardRewards(xpEarned, gemsEarned, "Sentences");
      }, 1000);
    }
  };

  const getSentenceXP = (sentenceType) => {
    const xpMap = {
      "Very Short": 2,
      Short: 3,
      Long: 5,
      "Very Long": 8,
      "Extremely Long": 10,
    };
    return xpMap[sentenceType] || 3;
  };

  const getSentenceGems = (sentenceType) => {
    const gemMap = {
      "Very Short": 1,
      Short: 1,
      Long: 2,
      "Very Long": 3,
      "Extremely Long": 4,
    };
    return gemMap[sentenceType] || 1;
  };

  const retrySentenceExercise = () => {
    const sentence = sentences[selectedSentence];
    const words = sentence.split(" ");
    setCurrentSentenceWords(words);
    setJumbledWords(shuffleArray([...words]));
    setArrangedWords([]);
    setSentenceInput("");
    setSentenceCheckResults({
      submitted: false,
      isCorrect: false,
      message: "",
      xpEarned: 0,
      gemsEarned: 0,
      showFeedback: false,
    });
  };

  const handleListeningComplete = (transcript) => {
    setSpokenText(transcript);

    if (selectedCategory === "Words") {
      const wordCount = parseInt(selectedWords);
      const transcriptWords = transcript.toLowerCase().split(/\s+/);

      const newWordInputs = {};
      for (let i = 0; i < wordCount && i < transcriptWords.length; i++) {
        newWordInputs[i] = transcriptWords[i];
      }
      setWordInputs(newWordInputs);
    }
  };

  const startReadingWords = () => {
    setCheckedAnswers({});
    if ("speechSynthesis" in window) {
      const wordCount = parseInt(selectedWords, 10);
      const selectedWordsList = words.slice(0, wordCount);
      setCurrentWordsList(selectedWordsList);

      const wordsString = selectedWordsList.join(", ");
      const utterance = new SpeechSynthesisUtterance(
        `Listen carefully and remember these words: ${wordsString}`
      );
      utterance.rate = 0.7;

      utterance.onend = () => {
        setHasRecorded(true);
        setMicEnabled(true);
        setWordInputs({});
        setWordCheckResults({
          submitted: false,
          results: {},
          score: 0,
          message: "",
          xpEarned: 0,
          gemsEarned: 0,
          showFeedback: false,
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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleDragStart = (e, word, index) => {
    setDraggedWord({ word, index, source: "jumbled" });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragStartArranged = (e, word, index) => {
    setDraggedWord({ word, index, source: "arranged" });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropToArranged = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedWord) return;

    if (draggedWord.source === "jumbled") {
      const newJumbled = jumbledWords.filter((_, i) => i !== draggedWord.index);
      const newArranged = [...arrangedWords];
      newArranged.splice(dropIndex, 0, draggedWord.word);

      setJumbledWords(newJumbled);
      setArrangedWords(newArranged);
    } else {
      const newArranged = [...arrangedWords];
      const [movedWord] = newArranged.splice(draggedWord.index, 1);
      newArranged.splice(dropIndex, 0, movedWord);
      setArrangedWords(newArranged);
    }
    setDraggedWord(null);
  };

  const handleDropToJumbled = (e) => {
    e.preventDefault();
    if (!draggedWord || draggedWord.source !== "arranged") return;

    const newArranged = arrangedWords.filter((_, i) => i !== draggedWord.index);
    const newJumbled = [...jumbledWords, draggedWord.word];

    setArrangedWords(newArranged);
    setJumbledWords(shuffleArray(newJumbled));
    setDraggedWord(null);
  };

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
      showFeedback: true,
    });

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
      showFeedback: false,
    });
  };

  const handleParagraphDragStart = (e, item, index, source) => {
    setDraggedItem({ item, index, source });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleParagraphDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleParagraphDropToArranged = (e, dropIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.source === "jumbled") {
      const newJumbled = [...jumbledParagraphSentences];
      newJumbled.splice(draggedItem.index, 1);

      const newArranged = [...arrangedParagraphSentences];
      newArranged.splice(dropIndex, 0, draggedItem.item);

      setJumbledParagraphSentences(newJumbled);
      setArrangedParagraphSentences(newArranged);
    } else {
      const newArranged = [...arrangedParagraphSentences];
      const [movedItem] = newArranged.splice(draggedItem.index, 1);
      newArranged.splice(dropIndex, 0, movedItem);
      setArrangedParagraphSentences(newArranged);
    }
    setDraggedItem(null);
  };

  const handleParagraphDropToJumbled = (e) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.source !== "arranged") return;

    const newArranged = [...arrangedParagraphSentences];
    newArranged.splice(draggedItem.index, 1);

    const newJumbled = [...jumbledParagraphSentences, draggedItem.item];

    setArrangedParagraphSentences(newArranged);
    setJumbledParagraphSentences(shuffleArray(newJumbled));
    setDraggedItem(null);
  };

  const checkTypedParagraph = () => {
    const userText = paragraphInput.toLowerCase().trim();
    const correctText = paragraphs[parseInt(selectedLines) - 1]
      .toLowerCase()
      .trim();
    const isCorrect = userText === correctText;

    let message, xpEarned, gemsEarned;
    const baseXP = parseInt(selectedLines) * 4;

    if (isCorrect) {
      message = "🌟 Perfect! You typed the paragraph correctly!";
      xpEarned = baseXP * 2;
      gemsEarned = parseInt(selectedLines);
    } else {
      message = "💪 Some parts were incorrect. Try again!";
      xpEarned = Math.floor(baseXP * 0.5);
      gemsEarned = 1;
    }

    setParagraphCheckResults({
      submitted: true,
      isCorrect,
      message,
      xpEarned,
      gemsEarned,
      showFeedback: true,
    });

    if (isCorrect) {
      setTimeout(() => {
        awardRewards(xpEarned, gemsEarned, "Paragraphs");
      }, 1000);
    }
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
                        {option}
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
              <option value="1">🟢 Easy - 1 Sentence (+4 XP)</option>
              <option value="2">🟡 Medium - 2 Sentences (+8 XP)</option>
              <option value="3">🟠 Hard - 3 Sentences (+12 XP)</option>
              <option value="4">🔴 Expert - 4 Sentences (+16 XP)</option>
              <option value="5">🟣 Master - 5 Sentences (+20 XP)</option>
            </select>

            {selectedLines && !hasRecorded && (
              <button
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                onClick={startReadingParagraphs}
              >
                <FaVolumeUp size={20} />
                <span>🎵 Listen to Paragraph</span>
              </button>
            )}

            {selectedLines && hasRecorded && (
              <div className="space-y-6">
                <AnswerStyleSelector
                  answerStyle={answerStyle}
                  setAnswerStyle={setAnswerStyle}
                />

                {answerStyle === "drag" ? (
                  <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                      <span className="mr-2">📝</span>
                      Arrange the sentences in the correct order:
                    </h4>

                    {/* Jumbled Sentences Section */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">
                        Available Sentences:
                      </h5>
                      <div
                        className="min-h-[100px] p-3 bg-white rounded-xl border-2 border-dashed border-gray-300 space-y-2"
                        onDragOver={handleParagraphDragOver}
                        onDrop={handleParagraphDropToJumbled}
                      >
                        {jumbledParagraphSentences.map((sentence, index) => (
                          <div
                            key={`jumbled-${index}`}
                            draggable
                            onDragStart={(e) =>
                              handleParagraphDragStart(
                                e,
                                sentence,
                                index,
                                "jumbled"
                              )
                            }
                            className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg cursor-move hover:bg-purple-200 transition-colors border-2 border-purple-300 font-medium select-none"
                          >
                            {sentence}
                          </div>
                        ))}
                        {jumbledParagraphSentences.length === 0 && (
                          <div className="text-gray-400 italic text-center w-full py-4">
                            All sentences used! 🎉
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arranged Paragraph Section */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">
                        Your Paragraph:
                      </h5>
                      <div
                        className="min-h-[150px] p-3 bg-white rounded-xl border-2 border-purple-400 space-y-2"
                        onDragOver={handleParagraphDragOver}
                        onDrop={(e) =>
                          handleParagraphDropToArranged(
                            e,
                            arrangedParagraphSentences.length
                          )
                        }
                      >
                        {arrangedParagraphSentences.map((sentence, index) => (
                          <div
                            key={`arranged-${index}`}
                            className="relative group"
                          >
                            <div
                              draggable
                              onDragStart={(e) =>
                                handleParagraphDragStart(
                                  e,
                                  sentence,
                                  index,
                                  "arranged"
                                )
                              }
                              className="bg-white text-purple-700 px-3 py-2 rounded-lg cursor-move hover:bg-purple-50 transition-colors border-2 border-purple-400 font-medium select-none"
                            >
                              {sentence}
                            </div>
                            {/* Drop zone after each sentence */}
                            <div
                              className="absolute -bottom-1 left-0 w-full h-2 opacity-0 hover:opacity-100 bg-purple-300 rounded transition-opacity"
                              onDragOver={handleParagraphDragOver}
                              onDrop={(e) =>
                                handleParagraphDropToArranged(e, index + 1)
                              }
                            ></div>
                          </div>
                        ))}
                        {arrangedParagraphSentences.length === 0 && (
                          <div className="text-gray-400 italic text-center w-full py-4">
                            Drop sentences here to build your paragraph
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={checkParagraphOrder}
                        disabled={
                          paragraphCheckResults.submitted ||
                          arrangedParagraphSentences.length === 0
                        }
                        className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                          paragraphCheckResults.submitted ||
                          arrangedParagraphSentences.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:scale-105 hover:shadow-lg"
                        } flex items-center justify-center space-x-2`}
                      >
                        <span>🎯 Check Order</span>
                      </button>

                      {paragraphCheckResults.submitted && (
                        <button
                          onClick={retryParagraphExercise}
                          className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <span>🔄 Try Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : answerStyle === "record" ? (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <MicListeningSection
                      prompt={
                        paragraphs[parseInt(selectedLines) - 1] || paragraphs[0]
                      }
                      disabled={!micEnabled}
                      micLabel="🎤 Speak Paragraph"
                      placeholder="Click mic and repeat the paragraph you heard"
                      sectionType="paragraph"
                      onListeningComplete={(transcript) => {
                        setParagraphInput(transcript);
                      }}
                      onCheckAnswer={(transcript) => {
                        const userText = transcript.toLowerCase().trim();
                        const correctText = paragraphs[
                          parseInt(selectedLines) - 1
                        ]
                          .toLowerCase()
                          .trim();
                        const isCorrect = userText === correctText;

                        let message, xpEarned, gemsEarned;
                        const baseXP = parseInt(selectedLines) * 4;

                        if (isCorrect) {
                          message =
                            "🌟 Perfect! You repeated the paragraph correctly!";
                          xpEarned = baseXP * 2;
                          gemsEarned = parseInt(selectedLines);
                        } else {
                          message = "💪 Some parts were incorrect. Try again!";
                          xpEarned = Math.floor(baseXP * 0.5);
                          gemsEarned = 1;
                        }

                        setParagraphCheckResults({
                          submitted: true,
                          isCorrect,
                          message,
                          xpEarned,
                          gemsEarned,
                          showFeedback: true,
                        });

                        if (isCorrect) {
                          setTimeout(() => {
                            awardRewards(xpEarned, gemsEarned, "Paragraphs");
                          }, 1000);
                        }
                      }}
                      showFeedback={paragraphCheckResults.showFeedback}
                      feedbackMessage={paragraphCheckResults.message}
                    />
                  </div>
                ) : (
                  <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                      <span className="mr-2">✍️</span>
                      Type the paragraph you heard:
                    </h4>
                    <textarea
                      value={paragraphInput}
                      onChange={(e) => setParagraphInput(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors min-h-[150px]"
                      placeholder="Type the paragraph here..."
                      disabled={paragraphCheckResults.submitted}
                    />
                    <button
                      onClick={checkTypedParagraph}
                      disabled={
                        paragraphCheckResults.submitted ||
                        !paragraphInput.trim()
                      }
                      className={`mt-4 w-full py-3 px-6 rounded-xl font-bold ${
                        paragraphCheckResults.submitted ||
                        !paragraphInput.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      🎯 Check Answer
                    </button>
                  </div>
                )}

                {/* Results Display */}
                {paragraphCheckResults.submitted && (
                  <div
                    className={`p-4 rounded-xl border-2 ${
                      paragraphCheckResults.isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {paragraphCheckResults.isCorrect ? "🎉" : "👍"}
                      </div>
                      <p className="text-gray-700 mb-3 font-medium">
                        {paragraphCheckResults.message}
                      </p>

                      {!paragraphCheckResults.isCorrect &&
                        answerStyle !== "drag" && (
                          <div className="bg-white p-3 rounded-xl mb-3">
                            <h5 className="font-bold text-gray-800 mb-2">
                              ✅ Correct Paragraph:
                            </h5>
                            <p className="text-gray-700">
                              {paragraphs[parseInt(selectedLines) - 1]}
                            </p>
                          </div>
                        )}

                      <div className="bg-white p-3 rounded-xl">
                        <h5 className="font-bold text-gray-800 mb-2">
                          🎁 Rewards Earned:
                        </h5>
                        <div className="flex justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaRocket className="text-blue-500" />
                            <span className="font-bold">
                              +{paragraphCheckResults.xpEarned} XP
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaGem className="text-green-500" />
                            <span className="font-bold">
                              +{paragraphCheckResults.gemsEarned} Gems
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

            {selectedSentence && !hasRecorded && (
              <div className="space-y-4">
                <button
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg transform transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                  onClick={startReadingSentences}
                >
                  <FaVolumeUp size={20} />
                  <span>🗣️ Listen to Sentence</span>
                </button>
              </div>
            )}

            {selectedSentence && hasRecorded && (
              <div className="space-y-6">
                <AnswerStyleSelector
                  answerStyle={answerStyle}
                  setAnswerStyle={setAnswerStyle}
                />

                {answerStyle === "drag" ? (
                  <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                    <h4 className="font-bold text-orange-800 mb-3 flex items-center">
                      <span className="mr-2">🧩</span>
                      Drag and drop the words to recreate the sentence:
                    </h4>

                    {/* Jumbled Words Section */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">
                        Available Words:
                      </h5>
                      <div
                        className="min-h-[60px] p-3 bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-wrap gap-2"
                        onDragOver={handleDragOver}
                        onDrop={handleDropToJumbled}
                      >
                        {jumbledWords.map((word, index) => (
                          <div
                            key={`jumbled-${index}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, word, index)}
                            className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg cursor-move hover:bg-orange-200 transition-colors border-2 border-orange-300 font-medium select-none"
                          >
                            {word}
                          </div>
                        ))}
                        {jumbledWords.length === 0 && (
                          <div className="text-gray-400 italic text-center w-full py-2">
                            All words used! 🎉
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arranged Sentence Section */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">
                        Your Sentence:
                      </h5>
                      <div
                        className="min-h-[60px] p-3 bg-blue-50 rounded-xl border-2 border-blue-300 flex flex-wrap gap-2"
                        onDragOver={handleDragOver}
                        onDrop={(e) =>
                          handleDropToArranged(e, arrangedWords.length)
                        }
                      >
                        {arrangedWords.map((word, index) => (
                          <div
                            key={`arranged-${index}`}
                            className="relative group"
                          >
                            <div
                              draggable
                              onDragStart={(e) =>
                                handleDragStartArranged(e, word, index)
                              }
                              className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg cursor-move hover:bg-blue-200 transition-colors border-2 border-blue-400 font-medium select-none"
                            >
                              {word}
                            </div>
                            {/* Drop zones between words */}
                            <div
                              className="absolute -right-1 top-0 w-2 h-full opacity-0 hover:opacity-100 bg-blue-400 rounded transition-opacity"
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDropToArranged(e, index + 1)}
                            ></div>
                          </div>
                        ))}
                        {arrangedWords.length === 0 && (
                          <div className="text-gray-400 italic text-center w-full py-2">
                            Drop words here to build your sentence
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={checkSentenceAnswer}
                        disabled={
                          sentenceCheckResults.submitted ||
                          arrangedWords.length === 0
                        }
                        className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                          sentenceCheckResults.submitted ||
                          arrangedWords.length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-105 hover:shadow-lg"
                        } flex items-center justify-center space-x-2`}
                      >
                        <span>🎯 Check My Sentence</span>
                      </button>

                      {sentenceCheckResults.submitted && (
                        <button
                          onClick={retrySentenceExercise}
                          className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <span>🔄 Try Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : answerStyle === "record" ? (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <MicListeningSection
                      prompt={sentences[selectedSentence]}
                      disabled={!micEnabled}
                      micLabel="🎤 Speak Sentence"
                      placeholder="Click mic and repeat the sentence you heard"
                      sectionType="sentence"
                      onListeningComplete={(transcript) => {
                        setSentenceInput(transcript);
                      }}
                      onCheckAnswer={(transcript) => {
                        const userSentence = transcript.toLowerCase().trim();
                        const correctSentence = sentences[selectedSentence]
                          .toLowerCase()
                          .trim();
                        const isCorrect = userSentence === correctSentence;

                        let message, xpEarned, gemsEarned;

                        if (isCorrect) {
                          message =
                            "🌟 Perfect! You repeated the sentence correctly!";
                          xpEarned = getSentenceXP(selectedSentence) * 2;
                          gemsEarned = getSentenceGems(selectedSentence);
                        } else {
                          message = "💪 Not quite right. Try again!";
                          xpEarned = Math.floor(
                            getSentenceXP(selectedSentence) * 0.3
                          );
                          gemsEarned = 1;
                        }

                        setSentenceCheckResults({
                          submitted: true,
                          isCorrect,
                          message,
                          xpEarned,
                          gemsEarned,
                          showFeedback: true,
                        });

                        if (isCorrect) {
                          setTimeout(() => {
                            awardRewards(xpEarned, gemsEarned, "Sentences");
                          }, 1000);
                        }
                      }}
                      showFeedback={sentenceCheckResults.showFeedback}
                      feedbackMessage={sentenceCheckResults.message}
                    />
                  </div>
                ) : (
                  <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                      <span className="mr-2">✍️</span>
                      Type the sentence you heard:
                    </h4>
                    <textarea
                      value={sentenceInput}
                      onChange={(e) => setSentenceInput(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors min-h-[100px]"
                      placeholder="Type the sentence here..."
                      disabled={sentenceCheckResults.submitted}
                    />
                    <button
                      onClick={checkTypedSentence}
                      disabled={
                        sentenceCheckResults.submitted || !sentenceInput.trim()
                      }
                      className={`mt-4 w-full py-3 px-6 rounded-xl font-bold ${
                        sentenceCheckResults.submitted || !sentenceInput.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      🎯 Check Answer
                    </button>
                  </div>
                )}

                {/* Results Display */}
                {sentenceCheckResults.submitted && (
                  <div
                    className={`p-4 rounded-xl border-2 ${
                      sentenceCheckResults.isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {sentenceCheckResults.isCorrect ? "🎉" : "💪"}
                      </div>
                      <p className="text-gray-700 mb-3 font-medium">
                        {sentenceCheckResults.message}
                      </p>

                      {!sentenceCheckResults.isCorrect && (
                        <div className="bg-white p-3 rounded-xl mb-3">
                          <h5 className="font-bold text-gray-800 mb-2">
                            ✅ Correct Sentence:
                          </h5>
                          <p className="text-lg font-medium text-green-700">
                            "{sentences[selectedSentence]}"
                          </p>
                        </div>
                      )}

                      <div className="bg-white p-3 rounded-xl">
                        <h5 className="font-bold text-gray-800 mb-2">
                          🎁 Rewards Earned:
                        </h5>
                        <div className="flex justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaRocket className="text-blue-500" />
                            <span className="font-bold">
                              +{sentenceCheckResults.xpEarned} XP
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaGem className="text-green-500" />
                            <span className="font-bold">
                              +{sentenceCheckResults.gemsEarned} Gems
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

            {selectedWords && hasRecorded && (
              <div className="space-y-6">
                <AnswerStyleSelector
                  answerStyle={answerStyle}
                  setAnswerStyle={setAnswerStyle}
                />

                {answerStyle === "drag" ? (
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
                ) : answerStyle === "record" ? (
                  <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                    <MicListeningSection
                      prompt={currentWordsList.join(" ")}
                      disabled={!micEnabled}
                      micLabel="🎤 Speak Words"
                      placeholder="Click mic and repeat the words you heard"
                      sectionType="word"
                      onListeningComplete={(transcript) => {
                        const wordCount = parseInt(selectedWords);
                        const transcriptWords = transcript
                          .toLowerCase()
                          .split(/\s+/);

                        const newWordInputs = {};
                        for (
                          let i = 0;
                          i < wordCount && i < transcriptWords.length;
                          i++
                        ) {
                          newWordInputs[i] = transcriptWords[i];
                        }
                        setWordInputs(newWordInputs);
                      }}
                      onCheckAnswer={(transcript) => {
                        const wordCount = parseInt(selectedWords);
                        const results = {};
                        let correctCount = 0;
                        const transcriptWords = transcript
                          .toLowerCase()
                          .split(/\s+/);

                        for (let i = 0; i < wordCount; i++) {
                          const userAnswer = (transcriptWords[i] || "")
                            .toLowerCase()
                            .trim();
                          const correctAnswer =
                            currentWordsList[i].toLowerCase();
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
                          gemsEarned = Math.floor(
                            parseInt(selectedWords) * 0.7
                          );
                        } else if (percentage >= 50) {
                          message = "👌 Not bad! Keep practicing to improve!";
                          xpEarned = parseInt(selectedWords);
                          gemsEarned = Math.floor(
                            parseInt(selectedWords) * 0.5
                          );
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
                          showFeedback: true,
                        });

                        if (percentage === 100) {
                          setTimeout(() => {
                            awardRewards(xpEarned, gemsEarned, "Words");
                          }, 1000);
                        }
                      }}
                      showFeedback={wordCheckResults.showFeedback}
                      feedbackMessage={wordCheckResults.message}
                    />
                  </div>
                ) : (
                  <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                      <span className="mr-2">✍️</span>
                      Type the words you heard in order:
                    </h4>

                    <div className="grid gap-3">
                      {Array.from(
                        { length: parseInt(selectedWords) },
                        (_, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold min-w-[2rem] text-center">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              placeholder={`Word ${index + 1}...`}
                              value={wordInputs[index] || ""}
                              onChange={(e) =>
                                handleWordInputChange(index, e.target.value)
                              }
                              className="flex-1 p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
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

                    <button
                      onClick={checkWordAnswers}
                      disabled={
                        wordCheckResults.submitted || !allWordsEntered()
                      }
                      className={`mt-4 w-full py-3 px-6 rounded-xl font-bold ${
                        wordCheckResults.submitted || !allWordsEntered()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      🎯 Check Answers
                    </button>
                  </div>
                )}

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
                              className={`px-3 py-1 rounded-full font-medium ${
                                wordCheckResults.results[index]
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
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
