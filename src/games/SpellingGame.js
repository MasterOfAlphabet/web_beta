import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Mic,
  MicOff,
  RotateCcw,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Target,
  Zap,
  Crown,
  SkipForward,
} from "lucide-react";

// Word banks for different class groups and skill levels
const wordBanks = {
  "Class I–II": {
    Rookie: [
      "cat",
      "dog",
      "sun",
      "bat",
      "hat",
      "bag",
      "pen",
      "red",
      "big",
      "hot",
      "run",
      "fun",
      "cup",
      "map",
      "toy",
    ],
    Racer: [
      "book",
      "tree",
      "fish",
      "bird",
      "moon",
      "star",
      "door",
      "window",
      "apple",
      "happy",
      "table",
      "chair",
      "green",
      "blue",
      "yellow",
    ],
    Master: [
      "school",
      "friend",
      "garden",
      "bottle",
      "brother",
      "sister",
      "mother",
      "father",
      "rabbit",
      "flower",
      "butter",
      "letter",
      "better",
      "little",
      "middle",
    ],
    Prodigy: [
      "elephant",
      "giraffe",
      "butterfly",
      "rainbow",
      "sandwich",
      "triangle",
      "rectangle",
      "building",
      "mountain",
      "beautiful",
      "wonderful",
      "chocolate",
      "elephant",
      "telephone",
      "bicycle",
    ],
    Wizard: [
      "adventure",
      "birthday",
      "crocodile",
      "dangerous",
      "exciting",
      "fantastic",
      "gigantic",
      "helicopter",
      "important",
      "jellyfish",
      "kangaroo",
      "lightning",
      "marvelous",
      "neighbor",
      "octopus",
    ],
  },
  "Class III–V": {
    Rookie: [
      "house",
      "water",
      "light",
      "night",
      "right",
      "might",
      "sight",
      "fight",
      "eight",
      "laugh",
      "cough",
      "rough",
      "tough",
      "enough",
      "thought",
    ],
    Racer: [
      "picture",
      "nature",
      "future",
      "culture",
      "capture",
      "feature",
      "mixture",
      "texture",
      "measure",
      "treasure",
      "pleasure",
      "weather",
      "leather",
      "feather",
      "brother",
    ],
    Master: [
      "beautiful",
      "wonderful",
      "powerful",
      "colorful",
      "peaceful",
      "helpful",
      "careful",
      "faithful",
      "grateful",
      "successful",
      "respectful",
      "thoughtful",
      "meaningful",
      "cheerful",
      "hopeful",
    ],
    Prodigy: [
      "mysterious",
      "adventurous",
      "dangerous",
      "marvelous",
      "fabulous",
      "tremendous",
      "curious",
      "serious",
      "generous",
      "nervous",
      "previous",
      "obvious",
      "jealous",
      "famous",
      "various",
    ],
    Wizard: [
      "extraordinary",
      "magnificent",
      "phenomenal",
      "spectacular",
      "incredible",
      "remarkable",
      "unbelievable",
      "outstanding",
      "exceptional",
      "fascinating",
      "breathtaking",
      "overwhelming",
      "unforgettable",
      "revolutionary",
      "pharmaceutical",
    ],
  },
  "Class VI–X": {
    Rookie: [
      "analyze",
      "organize",
      "realize",
      "recognize",
      "memorize",
      "apologize",
      "criticize",
      "emphasize",
      "exercise",
      "paradise",
      "surprise",
      "comprise",
      "advise",
      "devise",
      "revise",
    ],
    Racer: [
      "environment",
      "government",
      "development",
      "agreement",
      "treatment",
      "movement",
      "improvement",
      "achievement",
      "statement",
      "equipment",
      "requirement",
      "management",
      "experiment",
      "apartment",
      "department",
    ],
    Master: [
      "responsibility",
      "opportunity",
      "possibility",
      "personality",
      "nationality",
      "creativity",
      "curiosity",
      "generosity",
      "popularity",
      "similarity",
      "authority",
      "majority",
      "minority",
      "priority",
      "security",
    ],
    Prodigy: [
      "philosophical",
      "psychological",
      "technological",
      "archaeological",
      "geographical",
      "biographical",
      "mathematical",
      "theoretical",
      "practical",
      "critical",
      "logical",
      "magical",
      "typical",
      "physical",
      "chemical",
    ],
    Wizard: [
      "incomprehensible",
      "indispensable",
      "irresponsible",
      "uncontrollable",
      "uncomfortable",
      "unforgettable",
      "unimaginable",
      "unreasonable",
      "unacceptable",
      "unbelievable",
      "unconditional",
      "unprecedented",
      "overwhelming",
      "extraordinary",
      "pharmaceutical",
    ],
  },
};

// Skill level configurations
const skillLevels = {
  Rookie: {
    icon: Target,
    color: "from-green-400 to-blue-500",
    badge: "🌟 Rookie",
  },
  Racer: { icon: Zap, color: "from-blue-400 to-purple-500", badge: "⚡ Racer" },
  Master: {
    icon: Award,
    color: "from-purple-400 to-pink-500",
    badge: "🎯 Master",
  },
  Prodigy: {
    icon: Trophy,
    color: "from-pink-400 to-red-500",
    badge: "🏆 Prodigy",
  },
  Wizard: {
    icon: Crown,
    color: "from-red-400 to-yellow-500",
    badge: "👑 Wizard",
  },
};

const SpellingGame = () => {
  // Game state
  const [gameState, setGameState] = useState("setup"); // 'setup', 'playing', 'results'
  const [classGroup, setClassGroup] = useState("Class I–II");
  const [skillLevel, setSkillLevel] = useState("Rookie");
  const [wordCount, setWordCount] = useState(5);
  const [currentWords, setCurrentWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userSpelling, setUserSpelling] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [wordStartTime, setWordStartTime] = useState(null);
  const [results, setResults] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [wordTime, setWordTime] = useState(0);

  // Speech recognition
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // Initialize speech synthesis
  useEffect(() => {
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Timer effects
  useEffect(() => {
    let interval;
    if (gameState === "playing" && gameStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now - gameStartTime);
        if (wordStartTime) {
          setWordTime(now - wordStartTime);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, gameStartTime, wordStartTime]);

  // Format time display
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Start game
  const startGame = () => {
    const availableWords = wordBanks[classGroup][skillLevel];
    const selectedWords = availableWords
      .sort(() => Math.random() - 0.5)
      .slice(0, wordCount);

    setCurrentWords(selectedWords);
    setCurrentWordIndex(0);
    setUserSpelling("");
    setResults([]);
    setGameStartTime(Date.now());
    setWordStartTime(Date.now());
    setGameState("playing");
  };

  // Speak word
  const speakWord = (word) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;
      synthRef.current.speak(utterance);
    }
  };

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const cleanTranscript = finalTranscript.trim().toLowerCase();

          // Check if user said the actual word
          if (cleanTranscript === currentWord.toLowerCase()) {
            setFeedbackMessage(
              `❌ Don't say the word "${currentWord}"! Please spell it letter by letter like: ${currentWord
                .toUpperCase()
                .split("")
                .join(" ")}`
            );
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 4000);
            return;
          }

          // Process the spelling - extract individual letters
          const letters = finalTranscript
            .toUpperCase()
            .replace(/[^A-Z\s]/g, "")
            .split(/\s+/)
            .filter((word) => word.length === 1)
            .join("");

          if (letters.length > 0) {
            setUserSpelling(letters);
            setShowFeedback(false);
          } else {
            setFeedbackMessage(
              `🔤 Please spell the word letter by letter. Say each letter separately like: ${currentWord
                .toUpperCase()
                .split("")
                .join(" ")}`
            );
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 4000);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  // Start/stop listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      initSpeechRecognition();
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Submit spelling
  const submitSpelling = () => {
    const currentWord = currentWords[currentWordIndex];
    const isCorrect = userSpelling.toUpperCase() === currentWord.toUpperCase();
    const wordEndTime = Date.now();
    const timeSpent = wordEndTime - wordStartTime;

    const result = {
      word: currentWord,
      userSpelling: userSpelling,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
      wasSkipped: false,
    };

    setResults([...results, result]);

    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserSpelling("");
      setWordStartTime(Date.now());
    } else {
      // Game finished
      setTotalTime(Date.now() - gameStartTime);
      setGameState("results");
    }

    setShowFeedback(false);
    setFeedbackMessage("");
  };

  // Skip current word
  const skipWord = () => {
    const currentWord = currentWords[currentWordIndex];
    const wordEndTime = Date.now();
    const timeSpent = wordEndTime - wordStartTime;

    const result = {
      word: currentWord,
      userSpelling: "SKIPPED",
      isCorrect: false,
      timeSpent: timeSpent,
      wasSkipped: true,
    };

    setResults([...results, result]);

    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserSpelling("");
      setWordStartTime(Date.now());
    } else {
      // Game finished
      setTotalTime(Date.now() - gameStartTime);
      setGameState("results");
    }
  };

  // Calculate performance
  const calculatePerformance = () => {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const skippedCount = results.filter((r) => r.wasSkipped).length;
    const accuracy = Math.round((correctCount / results.length) * 100);
    const avgTime =
      results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length;

    let badge = "Keep Practicing! 📚";
    if (accuracy >= 90 && avgTime < 15000) badge = "Spelling Wizard! 👑";
    else if (accuracy >= 80 && avgTime < 20000) badge = "Spelling Master! 🏆";
    else if (accuracy >= 70 && avgTime < 25000) badge = "Great Speller! 🌟";
    else if (accuracy >= 60) badge = "Good Effort! 👍";

    return { correctCount, accuracy, avgTime, badge, skippedCount };
  };

  // Reset game
  const resetGame = () => {
    setGameState("setup");
    setCurrentWords([]);
    setCurrentWordIndex(0);
    setUserSpelling("");
    setResults([]);
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const currentWord = currentWords[currentWordIndex];
  const { correctCount, accuracy, avgTime, badge, skippedCount } =
    gameState === "results" ? calculatePerformance() : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ✨ Spelling Mastery ✨
          </h1>
          <p className="text-white/80 text-lg">
            Listen, Speak, and Spell with Confidence!
          </p>
        </div>

        {/* Setup Screen */}
        {gameState === "setup" && (
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Class Group */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-lg">
                  Class Group
                </label>
                <select
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                >
                  <option value="Class I–II">Class I–II</option>
                  <option value="Class III–V">Class III–V</option>
                  <option value="Class VI–X">Class VI–X</option>
                </select>
              </div>

              {/* Skill Level */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-lg">
                  Skill Level
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                >
                  {Object.keys(skillLevels).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Word Count */}
              <div className="space-y-3">
                <label className="block text-white font-semibold text-lg">
                  Number of Words
                </label>
                <select
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                >
                  <option value={5}>5 Words</option>
                  <option value={10}>10 Words</option>
                </select>
              </div>
            </div>

            {/* Selected Level Display */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${skillLevels[skillLevel].color} text-white font-bold text-xl shadow-lg`}
              >
                {React.createElement(skillLevels[skillLevel].icon, {
                  className: "w-6 h-6",
                })}
                {skillLevels[skillLevel].badge}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl text-xl"
              >
                🚀 Start Spelling Adventure!
              </button>
            </div>
          </div>
        )}

        {/* Playing Screen */}
        {gameState === "playing" && (
          <div className="space-y-6">
            {/* Timer and Progress */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">
                      Total: {formatTime(currentTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">
                      Word: {formatTime(wordTime)}
                    </span>
                  </div>
                </div>
                <div className="text-white font-semibold">
                  Word {currentWordIndex + 1} of {currentWords.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentWordIndex + 1) / currentWords.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Current Word */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Listen and Spell This Word:
                </h2>
                <button
                  onClick={() => speakWord(currentWord)}
                  className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  🔊 Read Me
                </button>
              </div>

              {/* Speech Input */}
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <button
                    onClick={toggleListening}
                    className={`${
                      isListening
                        ? "bg-gradient-to-r from-red-400 to-red-600 animate-pulse"
                        : "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
                    } text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-3`}
                  >
                    {isListening ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                    {isListening ? "🎤 Listening..." : "🎤 Start Spelling"}
                  </button>
                </div>

                <p className="text-white/80 text-sm mb-4">
                  Spell the word letter by letter (e.g., "C A T" not "cat")
                </p>

                {/* User Spelling Display */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-h-[60px] flex items-center justify-center">
                  <span className="text-white text-2xl font-mono tracking-widest">
                    {userSpelling || "Your spelling will appear here..."}
                  </span>
                </div>
              </div>

              {/* Feedback Message */}
              {showFeedback && (
                <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-xl p-4 animate-pulse">
                  <p className="text-red-300 font-semibold text-center">
                    {feedbackMessage}
                  </p>
                </div>
              )}

              {/* Comparison */}
              {userSpelling && (
                <div className="mb-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                    <p className="text-green-300 font-semibold mb-2">
                      ✅ Correct Spelling:
                    </p>
                    <p className="text-white text-xl font-mono tracking-widest">
                      {currentWord.toUpperCase()}
                    </p>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                    <p className="text-blue-300 font-semibold mb-2">
                      🛑 Your Spelling:
                    </p>
                    <p className="text-white text-xl font-mono tracking-widest">
                      {userSpelling}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={submitSpelling}
                  disabled={!userSpelling}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <CheckCircle className="w-6 h-6" />
                  Submit Spelling
                </button>

                <button
                  onClick={skipWord}
                  className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <SkipForward className="w-6 h-6" />
                  Skip Word
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameState === "results" && (
          <div className="space-y-6">
            {/* Performance Summary */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Game Complete!
              </h2>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
                {badge}
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {correctCount}/{results.length}
                  </div>
                  <div className="text-white">Correct Answers</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {accuracy}%
                  </div>
                  <div className="text-white">Accuracy</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {skippedCount}
                  </div>
                  <div className="text-white">Skipped Words</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {formatTime(totalTime)}
                  </div>
                  <div className="text-white">Total Time</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                📊 Detailed Results
              </h3>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {result.wasSkipped ? (
                        <SkipForward className="w-8 h-8 text-orange-400" />
                      ) : result.isCorrect ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <div className="text-white font-semibold text-lg">
                          {result.word}
                        </div>
                        <div className="text-white/80 text-sm">
                          {result.wasSkipped ? (
                            <span className="text-orange-300">
                              Word was skipped
                            </span>
                          ) : (
                            <>Your spelling: {result.userSpelling}</>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {formatTime(result.timeSpent)}
                      </div>
                      <div className="text-white/80 text-sm">Time spent</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <RotateCcw className="w-6 h-6" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellingGame;
