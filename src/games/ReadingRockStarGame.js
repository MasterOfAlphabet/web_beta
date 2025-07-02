import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Star,
  Mic,
  Users,
  Trophy,
  Target,
  Sparkles,
  Zap,
  Heart,
  MicOff,
  Volume2,
  AlertCircle,
  SkipForward,
  XCircle,
  Clock,
} from "lucide-react";
import readingData from "../data/Games/ReadingRockStar/WordsSentencesParagraphs.js";

// --- Category Selection ---
const CategorySelection = ({ onStart }) => {
  const [selectedClassGroup, setSelectedClassGroup] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("");
  const [animateStars, setAnimateStars] = useState(false);

  useEffect(() => {
    setAnimateStars(true);
    const interval = setInterval(() => setAnimateStars((prev) => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  const classGroups = [
    {
      id: "I-II",
      label: "Class I-II",
      icon: "🌟",
      description: "Little Stars",
      gradient: "from-pink-400 to-rose-500",
      shadow: "shadow-pink-300",
    },
    {
      id: "III-V",
      label: "Class III-V",
      icon: "⭐",
      description: "Rising Champions",
      gradient: "from-blue-400 to-cyan-500",
      shadow: "shadow-blue-300",
    },
    {
      id: "VI-X",
      label: "Class VI-X",
      icon: "🏆",
      description: "Reading Masters",
      gradient: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-300",
    },
  ];
  const difficulties = [
    {
      id: "rookie",
      label: "Rookie",
      color: "from-green-400 to-emerald-500",
      icon: "🌱",
      glow: "shadow-green-300",
    },
    {
      id: "racer",
      label: "Racer",
      color: "from-blue-400 to-sky-500",
      icon: "🏃",
      glow: "shadow-blue-300",
    },
    {
      id: "master",
      label: "Master",
      color: "from-purple-400 to-violet-500",
      icon: "🥋",
      glow: "shadow-purple-300",
    },
    {
      id: "prodigy",
      label: "Prodigy",
      color: "from-orange-400 to-red-500",
      icon: "🧠",
      glow: "shadow-orange-300",
    },
    {
      id: "wizard",
      label: "Wizard",
      color: "from-yellow-400 to-amber-500",
      icon: "🧙‍♂️",
      glow: "shadow-yellow-300",
    },
  ];
  const contentTypes = [
    {
      id: "Words",
      label: "Words",
      icon: BookOpen,
      description: "Single word adventures",
      gradient: "from-cyan-400 to-blue-500",
      bgPattern: "bg-gradient-to-br from-cyan-50 to-blue-100",
    },
    {
      id: "Sentences",
      label: "Sentences",
      icon: Target,
      description: "Complete sentence journeys",
      gradient: "from-yellow-400 to-orange-500",
      bgPattern: "bg-gradient-to-br from-yellow-50 to-orange-100",
    },
    {
      id: "Paragraphs",
      label: "Paragraphs",
      icon: Users,
      description: "Epic paragraph quests",
      gradient: "from-purple-400 to-pink-500",
      bgPattern: "bg-gradient-to-br from-purple-50 to-pink-100",
    },
  ];
  const canStartGame =
    selectedClassGroup && selectedDifficulty && selectedContentType;
  const handleStartGame = () => {
    if (canStartGame) {
      onStart({
        classGroup: selectedClassGroup,
        difficulty: selectedDifficulty,
        contentType: selectedContentType,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse ${
              animateStars ? "animate-bounce" : ""
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 p-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <BookOpen className="w-16 h-16 text-yellow-300 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
            </div>
            <div className="flex gap-2">
              <div
                className="w-4 h-8 bg-gradient-to-t from-green-400 to-green-600 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-4 h-10 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-4 h-6 bg-gradient-to-t from-orange-400 to-orange-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="w-4 h-8 bg-gradient-to-t from-red-400 to-red-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 animate-pulse">
              Reading Rock Star
            </h1>
            <div className="relative">
              <Star
                className="w-16 h-16 text-yellow-300 fill-yellow-300 animate-spin"
                style={{ animationDuration: "8s" }}
              />
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <div className="relative inline-block">
            <p className="text-2xl text-white font-bold mb-2 animate-pulse">
              🎉 Practice reading and become a reading champion! 🎉
            </p>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-lg blur opacity-20 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <Users className="w-12 h-12 mx-auto text-cyan-300 mb-3" />
                  <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Class
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto"></div>
              </div>
              <div className="space-y-4">
                {classGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedClassGroup(group.id)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedClassGroup === group.id
                        ? `bg-gradient-to-r ${group.gradient} border-white/50 shadow-2xl ${group.shadow} shadow-lg scale-105`
                        : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl animate-bounce">
                        {group.icon}
                      </span>
                      <div className="text-left">
                        <div className="font-bold text-white text-lg">
                          {group.label}
                        </div>
                        <div className="text-white/80 text-sm">
                          {group.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <Target className="w-12 h-12 mx-auto text-orange-300 mb-3" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Difficulty
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-110 ${
                      selectedDifficulty === difficulty.id
                        ? `bg-gradient-to-br ${difficulty.color} border-white/50 shadow-2xl ${difficulty.glow} shadow-lg scale-110`
                        : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-3xl block mb-2 animate-pulse">
                        {difficulty.icon}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {difficulty.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <BookOpen className="w-12 h-12 mx-auto text-green-300 mb-3" />
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Content</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
              </div>
              <div className="space-y-4">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedContentType(type.id)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedContentType === type.id
                          ? `${type.bgPattern} border-white/50 shadow-2xl scale-105`
                          : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${type.gradient} shadow-lg`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <h3
                            className={`text-lg font-bold ${
                              selectedContentType === type.id
                                ? "text-gray-800"
                                : "text-white"
                            }`}
                          >
                            {type.label}
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedContentType === type.id
                                ? "text-gray-600"
                                : "text-white/70"
                            }`}
                          >
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="text-center mb-8">
            <button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className={`relative px-16 py-6 rounded-3xl text-2xl font-black transition-all duration-500 transform ${
                canStartGame
                  ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 cursor-pointer animate-pulse"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-4">
                <Mic className="w-8 h-8 animate-bounce" />
                <span>🚀 START THE ADVENTURE! 🚀</span>
                <Star className="w-8 h-8 animate-spin" />
              </div>
              {canStartGame && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-50 blur animate-pulse -z-10"></div>
              )}
            </button>
            {!canStartGame && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <p className="text-white/90 text-lg">
                  ✨ Please select your class, difficulty, and content type to
                  begin your reading adventure! ✨
                </p>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mic className="w-8 h-8 text-yellow-300 animate-pulse" />
              <span className="text-white font-bold text-xl">
                🎤 Get Ready to Rock! 🎤
              </span>
            </div>
            <p className="text-white/90 text-lg mb-4">
              Make sure your microphone is ready and find a quiet space for the
              best reading experience!
            </p>
            <div className="flex justify-center gap-4 text-4xl animate-bounce">
              <span>🎯</span>
              <span>📚</span>
              <span>🌟</span>
              <span>🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Game Logic ---
const ReadingRockStarGame = ({ contentType, classGroup, difficulty }) => {
  // --- State ---
  const [gameState, setGameState] = useState("playing");
  const [category] = useState(contentType || "Words");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [skippedWords, setSkippedWords] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    wordsCorrect: 0,
    sentencesCorrect: 0,
    paragraphsCorrect: 0,
    wordsSkipped: 0,
    sentencesSkipped: 0,
    paragraphsSkipped: 0,
    totalTime: 0,
  });
  const [results, setResults] = useState([]);
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackPrompt, setFeedbackPrompt] = useState("");
  const [currentText, setCurrentText] = useState("");
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // --- Prompt Data ---
  const getPrompts = () => {
    const group = classGroup;
    const type = contentType.toLowerCase();
    const diff = difficulty;
    const fallbackData = {
      Words: [
        "apple",
        "music",
        "planet",
        "school",
        "friend",
        "magic",
        "guitar",
        "animal",
        "rocket",
        "banana",
        "happy",
        "garden",
        "window",
        "yellow",
        "purple",
        "orange",
        "table",
        "water",
        "elephant",
        "butterfly",
      ],
      Sentences: [
        "The cat is sleeping.",
        "She likes to read books.",
        "We play soccer after school.",
        "Reading is fun and exciting!",
        "The sun is bright in the sky.",
        "The beautiful butterfly flew over the colorful garden.",
        "My friend and I went to school together this morning.",
        "The big elephant was drinking water near the river.",
      ],
      Paragraphs: [
        `Reading helps us learn new things every day. When you read a book, you can travel to different places and meet interesting characters. Reading makes your mind strong and your imagination bigger.`,
        `Music is a wonderful part of our lives. It can make us feel happy, calm, or excited. Learning to play an instrument is fun and helps you express yourself.`,
        `Once upon a time there was a little cat. The cat loved to play in the garden. Every day the cat would chase butterflies and climb trees. The cat was very happy.`,
      ],
    };
    let prompts = [];
    try {
      if (
        readingData[group] &&
        readingData[group][type] &&
        readingData[group][type][diff]
      ) {
        prompts = readingData[group][type][diff];
      }
    } catch {}
    if (!prompts || prompts.length === 0)
      prompts = fallbackData[contentType] || fallbackData.Words;
    return prompts;
  };

  // --- Utility ---
  function normalize(str) {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, "");
  }
  function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
        else
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
      }
    }
    return matrix[a.length][b.length];
  }
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // --- Effects ---
  useEffect(() => {
    if (SpeechRecognition) setSpeechSupported(true);
    else {
      setSpeechSupported(false);
      setFeedback(
        "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."
      );
      setFeedbackType("error");
    }
  }, []);
  useEffect(() => {
    if (gameState === "playing" && startTime) {
      timerRef.current = setInterval(
        () => setGameTime(Math.floor((Date.now() - startTime) / 1000)),
        1000
      );
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [gameState, startTime]);
  useEffect(() => {
    if (gameState === "playing") {
      setStep(0);
      setScore(0);
      setTotalAttempts(0);
      setCorrectWords(0);
      setSkippedWords(0);
      setSpokenText("");
      setCorrect(null);
      setShowFeedback(false);
      setStartTime(Date.now());
      setGameTime(0);
      setFeedback("");
      setFeedbackType("");
      setSessionStats({
        wordsCorrect: 0,
        sentencesCorrect: 0,
        paragraphsCorrect: 0,
        wordsSkipped: 0,
        sentencesSkipped: 0,
        paragraphsSkipped: 0,
        totalTime: 0,
      });
      setCurrentText(getPrompts()[0]);
    }
    // eslint-disable-next-line
  }, [gameState, category]);
  useEffect(() => {
    setCurrentText(getPrompts()[step]);
    // eslint-disable-next-line
  }, [step]);
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  // --- Speech Recognition ---
  const startListening = () => {
    if (!SpeechRecognition) {
      setFeedback("Sorry, your browser does not support speech recognition.");
      setFeedbackType("error");
      setShowFeedback(true);
      return;
    }
    setSpokenText("");
    setCorrect(null);
    setShowFeedback(false);
    setFeedback("");
    setFeedbackType("");
    setIsProcessing(false);
    setIsListening(true);
    setIsProcessing(true);
    const promptForThisAttempt = currentText;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (e) => {
      setIsProcessing(false);
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTotalAttempts((prev) => prev + 1);
      setSpokenText(transcript);
      setFeedbackPrompt(promptForThisAttempt);
      let isCorrect = false;
      if (category === "Words") {
        isCorrect = normalize(transcript) === normalize(promptForThisAttempt);
      } else {
        const normPrompt = normalize(promptForThisAttempt);
        const normTranscript = normalize(transcript);
        const distance = levenshtein(normPrompt, normTranscript);
        const allowed = Math.ceil(normPrompt.length * 0.2);
        isCorrect = distance <= allowed;
      }
      setCorrect(isCorrect);
      setShowFeedback(true);
      if (isCorrect) {
        setScore(
          (prev) =>
            prev +
            (category === "Words" ? 10 : category === "Sentences" ? 15 : 25)
        );
        setCorrectWords((prev) => prev + 1);
        setFeedback("🌟 Perfect! You rock! 🎸");
        setFeedbackType("success");
        setSessionStats((prev) => ({
          ...prev,
          [`${category.toLowerCase()}Correct`]:
            prev[`${category.toLowerCase()}Correct`] + 1,
        }));
      } else {
        setFeedback(`❌ Not quite. Try to say: "${promptForThisAttempt}"`);
        setFeedbackType("error");
      }
      setResults((r) => [
        ...r,
        {
          prompt: promptForThisAttempt,
          spoken: transcript,
          correct: isCorrect,
          skipped: false,
        },
      ]);
      setIsListening(false);
    };
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
    };
    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      setIsProcessing(false);
      let errorMessage = "Please try speaking again!";
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please speak clearly!";
          break;
        case "audio-capture":
          errorMessage = "Microphone not found. Please check your microphone!";
          break;
        case "not-allowed":
          errorMessage =
            "Microphone permission denied. Please allow microphone access!";
          break;
        case "network":
          errorMessage = "Network error. Please check your connection!";
          break;
        default:
          break;
      }
      setFeedback(errorMessage);
      setFeedbackType("error");
      setShowFeedback(true);
      setFeedbackPrompt(promptForThisAttempt);
    };
    recognitionRef.current.start();
  };
  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };
  const skipWord = () => {
    setSkippedWords((prev) => prev + 1);
    setSessionStats((prev) => ({
      ...prev,
      [`${category.toLowerCase()}Skipped`]:
        prev[`${category.toLowerCase()}Skipped`] + 1,
    }));
    setResults((r) => [
      ...r,
      { prompt: currentText, spoken: "", correct: false, skipped: true },
    ]);
    setShowFeedback(false);
    setCorrect(null);
    setSpokenText("");
    setIsListening(false);
    setIsProcessing(false);
    setFeedback("");
    setFeedbackType("");
    nextText();
  };
  const nextText = () => {
    if (step + 1 < getPrompts().length) {
      setStep((s) => s + 1);
      setShowFeedback(false);
      setCorrect(null);
      setSpokenText("");
      setFeedback("");
      setFeedbackType("");
      setIsListening(false);
      setIsProcessing(false);
    } else {
      endGame();
    }
  };
  const endGame = () => {
    setGameState("results");
    setSessionStats((prev) => ({ ...prev, totalTime: gameTime }));
  };
  const resetGame = () => window.location.reload();
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.rate = 0.7;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = "en-US";
        utterance.onerror = (event) =>
          console.warn("Speech synthesis error:", event);
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };
  const getFeedbackColor = () => {
    switch (feedbackType) {
      case "success":
        return "bg-green-100 border-green-300 text-green-800";
      case "error":
        return "bg-red-100 border-red-300 text-red-800";
      case "info":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };
  function ProgressBar({ current, total }) {
    const percent = (current / total) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-pink-400 h-4 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  }

  // --- UI ---
  if (!speechSupported && gameState !== "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-purple-400 p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Browser Not Supported
          </h2>
          <p className="text-gray-600 mb-6">
            Speech recognition is not supported in your browser. Please use:
          </p>
          <ul className="text-left text-gray-600 mb-6">
            <li>• Google Chrome</li>
            <li>• Microsoft Edge</li>
            <li>• Safari (on macOS/iOS)</li>
          </ul>
          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "results") {
    const accuracy =
      totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 0;

    // Dynamic title based on performance
    const getTitle = () => {
      if (accuracy >= 90) return "Outstanding Performance!";
      if (accuracy >= 75) return "Excellent Work!";
      if (accuracy >= 60) return "Great Progress!";
      if (accuracy >= 40) return "Good Effort!";
      return "Keep Practicing!";
    };

    const getTitleIcon = () => {
      if (accuracy >= 90) return "🏆";
      if (accuracy >= 75) return "🎖️";
      if (accuracy >= 60) return "⭐";
      if (accuracy >= 40) return "👍";
      return "🌱";
    };

    // Categories that were actually played (have completed + skipped > 0)
    const playedCategories = [];

    if (sessionStats.wordsCorrect + sessionStats.wordsSkipped > 0) {
      playedCategories.push({
        name: "Words",
        completed: sessionStats.wordsCorrect,
        skipped: sessionStats.wordsSkipped,
        icon: "🔤",
        displayClass: "Elementary",
        difficulty: "Easy",
        score: sessionStats.wordsCorrect * 10, // Adjust scoring logic as needed
        accuracy:
          sessionStats.wordsCorrect + sessionStats.wordsSkipped > 0
            ? Math.round(
                (sessionStats.wordsCorrect /
                  (sessionStats.wordsCorrect + sessionStats.wordsSkipped)) *
                  100
              )
            : 0,
      });
    }

    if (sessionStats.sentencesCorrect + sessionStats.sentencesSkipped > 0) {
      playedCategories.push({
        name: "Sentences",
        completed: sessionStats.sentencesCorrect,
        skipped: sessionStats.sentencesSkipped,
        icon: "📝",
        displayClass: "Intermediate",
        difficulty: "Medium",
        score: sessionStats.sentencesCorrect * 25,
        accuracy:
          sessionStats.sentencesCorrect + sessionStats.sentencesSkipped > 0
            ? Math.round(
                (sessionStats.sentencesCorrect /
                  (sessionStats.sentencesCorrect +
                    sessionStats.sentencesSkipped)) *
                  100
              )
            : 0,
      });
    }

    if (sessionStats.paragraphsCorrect + sessionStats.paragraphsSkipped > 0) {
      playedCategories.push({
        name: "Paragraphs",
        completed: sessionStats.paragraphsCorrect,
        skipped: sessionStats.paragraphsSkipped,
        icon: "📄",
        displayClass: "Advanced",
        difficulty: "Hard",
        score: sessionStats.paragraphsCorrect * 50,
        accuracy:
          sessionStats.paragraphsCorrect + sessionStats.paragraphsSkipped > 0
            ? Math.round(
                (sessionStats.paragraphsCorrect /
                  (sessionStats.paragraphsCorrect +
                    sessionStats.paragraphsSkipped)) *
                  100
              )
            : 0,
      });
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header with Dynamic Title */}
          <div className="text-center mb-8">
            <div className="text-7xl sm:text-8xl mb-4 animate-pulse">
              {getTitleIcon()}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              {getTitle()}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          {/* Session Summary - Top Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📊</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Session Summary
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🔤</span>
                  <h3 className="font-bold text-xl text-blue-800">Words</h3>
                </div>
                <div className="space-y-2 text-blue-700">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">
                      {sessionStats.wordsCorrect}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skipped:</span>
                    <span className="font-bold">
                      {sessionStats.wordsSkipped}
                    </span>
                  </div>
                  <hr className="border-blue-300 my-3" />
                  <div className="flex justify-between text-sm">
                    <span>Display Class:</span>
                    <span className="font-semibold">Elementary</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <span className="font-semibold">Easy</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📝</span>
                  <h3 className="font-bold text-xl text-green-800">
                    Sentences
                  </h3>
                </div>
                <div className="space-y-2 text-green-700">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">
                      {sessionStats.sentencesCorrect}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skipped:</span>
                    <span className="font-bold">
                      {sessionStats.sentencesSkipped}
                    </span>
                  </div>
                  <hr className="border-green-300 my-3" />
                  <div className="flex justify-between text-sm">
                    <span>Display Class:</span>
                    <span className="font-semibold">Intermediate</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <span className="font-semibold">Medium</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📄</span>
                  <h3 className="font-bold text-xl text-purple-800">
                    Paragraphs
                  </h3>
                </div>
                <div className="space-y-2 text-purple-700">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-bold">
                      {sessionStats.paragraphsCorrect}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skipped:</span>
                    <span className="font-bold">
                      {sessionStats.paragraphsSkipped}
                    </span>
                  </div>
                  <hr className="border-purple-300 my-3" />
                  <div className="flex justify-between text-sm">
                    <span>Display Class:</span>
                    <span className="font-semibold">Advanced</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Difficulty:</span>
                    <span className="font-semibold">Hard</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚠️</span>
                <span className="text-lg font-bold text-amber-800">
                  Total Skipped: {skippedWords}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics - Only for Categories Played */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Always show overall metrics */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{score}</div>
              <div className="text-blue-100 font-medium">Total Score</div>
              <div className="text-xs text-blue-200 mt-1">Points Earned</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {accuracy}%
              </div>
              <div className="text-green-100 font-medium">Overall Accuracy</div>
              <div className="text-xs text-green-200 mt-1">Success Rate</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {correctWords}
              </div>
              <div className="text-purple-100 font-medium">
                Correct Readings
              </div>
              <div className="text-xs text-purple-200 mt-1">Well Done!</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {gameTime}s
              </div>
              <div className="text-orange-100 font-medium">Time Taken</div>
              <div className="text-xs text-orange-200 mt-1">Duration</div>
            </div>

            {/* Category-specific metrics only for played categories */}
            {playedCategories.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-4 sm:p-6 text-white shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  {category.accuracy}%
                </div>
                <div className="text-indigo-100 text-sm">Category Accuracy</div>
              </div>
            ))}
          </div>

          {/* Recent Results - No Scrollbars */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📋</span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Recent Results
              </h3>
            </div>

            <div className="space-y-4">
              {results.slice(-5).map((result, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-4 sm:p-6 border-2 transition-all hover:shadow-md ${
                    result.skipped
                      ? "bg-yellow-50 border-yellow-200"
                      : result.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-2 leading-relaxed text-sm sm:text-base">
                        {result.prompt}
                      </div>
                      <div className="text-gray-600 text-xs sm:text-sm">
                        {result.skipped
                          ? "⏭️ Skipped"
                          : `🗣️ You said: "${result.spoken}"`}
                      </div>
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${
                        result.skipped
                          ? "bg-yellow-200 text-yellow-800"
                          : result.correct
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {result.skipped
                        ? "⏭️ Skipped"
                        : result.correct
                        ? "✅ Correct!"
                        : "❌ Try again"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-3xl text-lg sm:text-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
            >
              🎮 Play Again!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Playing State ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                className="text-blue-500 underline hover:text-blue-700"
                onClick={resetGame}
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
              <div className="flex items-center space-x-2 text-blue-600">
                <Star className="w-5 h-5" />
                <span className="font-bold">{score}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Clock className="w-5 h-5" />
                <span className="font-bold">{gameTime}s</span>
              </div>
              <button
                onClick={endGame}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                End Game
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <ProgressBar current={step} total={getPrompts().length} />
            <div className="flex justify-center items-center mb-6">
              <button
                onClick={() => speakText(currentText)}
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors mr-4"
                title="Listen to the text"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {category === "Words"
                    ? "Read this word:"
                    : category === "Sentences"
                    ? "Read this sentence:"
                    : "Read this paragraph:"}
                </h3>
                {!showFeedback && (
                  <p className="text-lg text-blue-600 font-medium">
                    Ready for the next one? Click the microphone!
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 mb-6">
              <div
                className={`font-bold text-gray-800 ${
                  category === "Words"
                    ? "text-6xl tracking-wider"
                    : category === "Sentences"
                    ? "text-3xl"
                    : "text-xl leading-8"
                } ${
                  category === "Paragraphs" ? "max-h-36 overflow-y-auto" : ""
                }`}
              >
                {currentText}
              </div>
            </div>
            {/* Feedback and spoken text above microphone */}
            {showFeedback && (
              <div className="mb-6">
                {spokenText && (
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">You said:</p>
                    <p className="font-bold text-gray-800">"{spokenText}"</p>
                  </div>
                )}
                {feedback && (
                  <div
                    className={`border rounded-xl p-4 inline-block max-w-lg mb-4 ${getFeedbackColor()}`}
                  >
                    <p className="text-lg font-medium">{feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Microphone controls */}
          {correct === false && showFeedback && (
            <div className="flex flex-col items-center mb-6">
              <div className="flex flex-row items-center justify-center gap-4">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-7 py-3 rounded-2xl font-extrabold text-lg shadow-lg transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={() => {
                    setShowFeedback(false);
                    setSpokenText("");
                    setCorrect(null);
                    setTimeout(() => startListening(), 400);
                  }}
                  aria-label="Try Again"
                >
                  <Mic className="w-6 h-6" /> Try Again
                </button>
                <button
                  onClick={skipWord}
                  disabled={isListening}
                  className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-2xl font-extrabold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    isListening ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title={`Skip this ${category.slice(0, -1).toLowerCase()}`}
                  aria-label={`Skip this ${category
                    .slice(0, -1)
                    .toLowerCase()}`}
                >
                  <SkipForward className="w-6 h-6" />
                  {`Skip ${
                    category === "Words"
                      ? "Word"
                      : category === "Sentences"
                      ? "Sentence"
                      : "Paragraph"
                  }`}
                </button>
              </div>
              <div className="mt-3 text-gray-500 text-sm italic">
                Still stuck? Skip and try the next one!
              </div>
            </div>
          )}
          {(!showFeedback || correct === null) && (
            <div className="flex flex-row items-center justify-center gap-4 mb-6">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!speechSupported}
                className={`${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white p-6 rounded-full text-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
              <button
                onClick={skipWord}
                disabled={isListening}
                className={`flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-2xl font-extrabold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                  isListening ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={`Skip this ${category.slice(0, -1).toLowerCase()}`}
                aria-label={`Skip this ${category.slice(0, -1).toLowerCase()}`}
              >
                <SkipForward className="w-6 h-6" />
                {`Skip ${
                  category === "Words"
                    ? "Word"
                    : category === "Sentences"
                    ? "Sentence"
                    : "Paragraph"
                }`}
              </button>
            </div>
          )}
          {(!showFeedback || correct === null) && (
            <div className="text-center mb-2 text-lg text-gray-600">
              {isListening
                ? "🎤 Listening... Speak clearly!"
                : "Click to start speaking"}
            </div>
          )}
          {correct === true && showFeedback && (
            <div className="flex flex-col items-center mb-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3 rounded-2xl font-extrabold text-lg shadow-lg transition-colors text-lg mx-auto"
                onClick={nextText}
              >
                Next ➡️
              </button>
            </div>
          )}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">
                {correctWords}
              </div>
              <div className="text-blue-800">Correct</div>
            </div>
            <div className="bg-green-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {totalAttempts > 0
                  ? Math.round((correctWords / totalAttempts) * 100)
                  : 0}
                %
              </div>
              <div className="text-green-800">Accuracy</div>
            </div>
            <div className="bg-purple-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">
                {totalAttempts}
              </div>
              <div className="text-purple-800">Attempts</div>
            </div>
            <div className="bg-orange-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600">
                {skippedWords}
              </div>
              <div className="text-orange-800">Skipped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Export ---
const ReadingRockStar = () => {
  const [gameParams, setGameParams] = useState(null);
  if (!gameParams) return <CategorySelection onStart={setGameParams} />;
  return (
    <ReadingRockStarGame
      contentType={gameParams.contentType}
      classGroup={gameParams.classGroup}
      difficulty={gameParams.difficulty}
    />
  );
};

export default ReadingRockStar;
