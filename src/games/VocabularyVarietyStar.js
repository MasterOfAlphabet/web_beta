import React, { useState, useEffect } from "react";
import {
  Star,
  Users,
  BookOpen,
  ArrowRight,
  Home,
  Clock,
  Zap,
  Trophy,
  Heart,
  Volume2,
  CheckCircle,
  XCircle,
  Target,
  Flame,
} from "lucide-react";

const VocabularyVarietyStar = () => {
  // Game selection states
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // Game play states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [powerUps, setPowerUps] = useState({
    hint: 2,
    extraTime: 1,
    skipQuestion: 1,
  });
  const [showHint, setShowHint] = useState(false);

  // Game configuration
  const classGroups = [
    {
      id: "I-II",
      name: "Class I-II",
      description: "Beginner Level",
      color: "bg-gradient-to-br from-pink-400 to-purple-500",
      icon: "🌟",
    },
    {
      id: "III-V",
      name: "Class III-V",
      description: "Intermediate Level",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500",
      icon: "⭐",
    },
    {
      id: "VI-X",
      name: "Class VI-X",
      description: "Advanced Level",
      color: "bg-gradient-to-br from-green-400 to-emerald-500",
      icon: "✨",
    },
  ];

  const categories = [
    {
      id: "puzzle-pundit",
      name: "Puzzle Pundit",
      description: "Word puzzles",
      icon: "🧩",
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
    },
    {
      id: "definition-dynamo",
      name: "Definition Dynamo",
      description: "Match meanings",
      icon: "💡",
      color: "bg-gradient-to-br from-red-500 to-orange-600",
    },
    {
      id: "word-wizard",
      name: "Word Wizard",
      description: "Create words",
      icon: "🪄",
      color: "bg-gradient-to-br from-yellow-500 to-amber-600",
    },
    {
      id: "anagram",
      name: "Anagram",
      description: "earranging the letters of a different word or phrase",
      icon: "🪄",
      color: "bg-gradient-to-br from-yellow-500 to-amber-600",
    },
    {
      id: "anthyakshari-avatars",
      name: "Anthyakshari",
      description: "Word chain",
      icon: "👥",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
    {
      id: "sequential-sensation",
      name: "Sequential",
      description: "Word sequences",
      icon: "🔄",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    },
  ];
  // Question database
  const questionSets = {
    "definition-dynamo": {
      "I-II": [
        {
          question: "What does 'BIG' mean?",
          options: ["Small", "Large", "Fast", "Slow"],
          correct: 1,
          hint: "Think of an elephant!",
          image: "🐘",
        },
        {
          question: "What does 'HAPPY' mean?",
          options: ["Sad", "Angry", "Joyful", "Tired"],
          correct: 2,
          hint: "When you smile, you feel...",
          image: "😊",
        },
        {
          question: "What does 'RUN' mean?",
          options: ["Walk slowly", "Move quickly on foot", "Swim", "Sleep"],
          correct: 1,
          hint: "What you do in a race",
          image: "🏃",
        },
      ],
      "III-V": [
        {
          question: "What does 'MAGNIFICENT' mean?",
          options: ["Ordinary", "Splendid", "Broken", "Small"],
          correct: 1,
          hint: "Something truly impressive and grand",
          image: "🏰",
        },
        {
          question: "What does 'CAUTIOUS' mean?",
          options: ["Reckless", "Careful", "Fast", "Loud"],
          correct: 1,
          hint: "Being aware of danger",
          image: "⚠️",
        },
      ],
      "VI-X": [
        {
          question: "What does 'TENACIOUS' mean?",
          options: ["Weak", "Persistent", "Careless", "Temporary"],
          correct: 1,
          hint: "Never giving up, holding firmly",
          image: "💪",
        },
        {
          question: "What does 'EUPHORIC' mean?",
          options: ["Depressed", "Confused", "Extremely happy", "Angry"],
          correct: 2,
          hint: "A feeling of intense joy and excitement",
          image: "🎉",
        },
      ],
    },
    "word-wizard": {
      "I-II": [
        {
          question: "Make a word from: A, P, P, L, E",
          options: ["PEPLA", "APPLE", "LEPAP", "PAPEL"],
          correct: 1,
          hint: "A red or green fruit",
          image: "🍎",
        },
      ],
      "III-V": [
        {
          question: "Make a word from: E, X, C, I, T, E, D",
          options: ["EXCITED", "DEXCITE", "TICEXED", "CITEDEX"],
          correct: 0,
          hint: "How you feel on your birthday",
          image: "🎂",
        },
      ],
      "VI-X": [
        {
          question: "Make a word from: P, E, R, S, I, S, T, E, N, T",
          options: ["PERSISTENT", "PRESISTENT", "PERSISTENT", "PERSISTENT"],
          correct: 0,
          hint: "Continuing despite difficulties",
          image: "🧗",
        },
      ],
    },
  };

  const currentQuestions =
    questionSets[selectedCategory]?.[selectedClass] ||
    questionSets["definition-dynamo"]["III-V"];
  const currentQ = currentQuestions[currentQuestion];

  // Timer effect
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      if (timeLeft > 0 && !showResult) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0) {
        handleTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, gameStarted]);

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setSelectedCategory("");
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    resetGameState();
  };

  const resetGameState = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setTimeLeft(30);
    setSelectedAnswer("");
    setShowResult(false);
    setIsCorrect(false);
    setLevel(1);
    setExperience(0);
    setPowerUps({ hint: 2, extraTime: 1, skipQuestion: 1 });
    setShowHint(false);
  };

  const handleReturnToMenu = () => {
    setGameStarted(false);
  };

  const handleTimeUp = () => {
    setShowResult(true);
    setIsCorrect(false);
    setLives(lives - 1);
    setStreak(0);
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);
    const correct = answerIndex === currentQ.correct;
    setIsCorrect(correct);

    if (correct) {
      const points = Math.max(10, timeLeft * 2);
      setScore(score + points);
      setStreak(streak + 1);
      setExperience(experience + points);
      if (experience + points >= level * 100) {
        setLevel(level + 1);
      }
    } else {
      setLives(lives - 1);
      setStreak(0);
    }

    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setShowResult(false);
      setTimeLeft(30);
      setShowHint(false);
    } else {
      handleReturnToMenu();
    }
  };

  const handlePowerUp = (type) => {
    if (powerUps[type] <= 0) return;

    setPowerUps({ ...powerUps, [type]: powerUps[type] - 1 });

    switch (type) {
      case "hint":
        setShowHint(true);
        break;
      case "extraTime":
        setTimeLeft(timeLeft + 15);
        break;
      case "skipQuestion":
        nextQuestion();
        break;
      default:
        break;
    }
  };

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-400/10 rounded-full blur-xl animate-bounce"></div>
        </div>

        <div className="relative z-10 p-4 max-w-6xl mx-auto">
          {/* Top HUD */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleReturnToMenu}
              className="p-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <Home className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-lg rounded-full border border-yellow-400/30">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{score}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-500/20 backdrop-blur-lg rounded-full border border-purple-400/30">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span className="text-white font-bold">Level {level}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400/20 to-orange-500/20 backdrop-blur-lg rounded-full border border-red-400/30">
                <Flame className="w-5 h-5 text-red-400" />
                <span className="text-white font-bold">{streak}</span>
              </div>
            </div>

            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-8 h-8 ${
                    i < lives ? "text-red-400 fill-red-400" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60">
                Question {currentQuestion + 1} of {currentQuestions.length}
              </span>
              <span className="text-white/60">
                XP: {experience}/{level * 100}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-lg border border-white/20">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentQuestion + 1) / currentQuestions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-lg border-2 transition-all duration-300 ${
                timeLeft <= 10
                  ? "bg-red-500/20 border-red-400 animate-pulse"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <Clock
                className={`w-6 h-6 ${
                  timeLeft <= 10 ? "text-red-400" : "text-white"
                }`}
              />
              <span
                className={`text-2xl font-bold ${
                  timeLeft <= 10 ? "text-red-400" : "text-white"
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <div className="mb-8 p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-8xl mb-4 animate-bounce">
                  {currentQ.image}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {currentQ.question}
                </h2>
                {showHint && (
                  <div className="p-4 bg-yellow-400/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30 animate-pulse">
                    <p className="text-yellow-200 font-medium">
                      💡 Hint: {currentQ.hint}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {currentQ.options.map((option, index) => {
                let buttonClass =
                  "group p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-white font-bold text-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 cursor-pointer";

                if (showResult) {
                  if (index === currentQ.correct) {
                    buttonClass =
                      "group p-6 bg-green-500/30 backdrop-blur-lg rounded-2xl border-2 border-green-400 text-green-100 font-bold text-xl animate-pulse";
                  } else if (
                    index === selectedAnswer &&
                    selectedAnswer !== currentQ.correct
                  ) {
                    buttonClass =
                      "group p-6 bg-red-500/30 backdrop-blur-lg rounded-2xl border-2 border-red-400 text-red-100 font-bold text-xl";
                  }
                }

                return (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                      {showResult && index === currentQ.correct && (
                        <CheckCircle className="w-8 h-8 text-green-400 animate-bounce" />
                      )}
                      {showResult &&
                        index === selectedAnswer &&
                        selectedAnswer !== currentQ.correct && (
                          <XCircle className="w-8 h-8 text-red-400" />
                        )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Power-ups */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePowerUp("hint")}
                disabled={powerUps.hint <= 0}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-lg rounded-full border border-yellow-400/30 text-yellow-200 hover:bg-yellow-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Target className="w-5 h-5" />
                <span>Hint ({powerUps.hint})</span>
              </button>

              <button
                onClick={() => handlePowerUp("extraTime")}
                disabled={powerUps.extraTime <= 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-lg rounded-full border border-blue-400/30 text-blue-200 hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className="w-5 h-5" />
                <span>+15s ({powerUps.extraTime})</span>
              </button>

              <button
                onClick={() => handlePowerUp("skipQuestion")}
                disabled={powerUps.skipQuestion <= 0}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-lg rounded-full border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                <span>Skip ({powerUps.skipQuestion})</span>
              </button>
            </div>
          </div>

          {/* Result Popup */}
          {showResult && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div
                className={`p-8 rounded-3xl backdrop-blur-lg border-2 shadow-2xl transform scale-110 animate-bounce ${
                  isCorrect
                    ? "bg-green-500/20 border-green-400"
                    : "bg-red-500/20 border-red-400"
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{isCorrect ? "🎉" : "😔"}</div>
                  <h3
                    className={`text-3xl font-bold mb-2 ${
                      isCorrect ? "text-green-200" : "text-red-200"
                    }`}
                  >
                    {isCorrect ? "Correct!" : "Wrong!"}
                  </h3>
                  <p className="text-white/80 text-lg">
                    {isCorrect
                      ? `+${Math.max(10, timeLeft * 2)} points!`
                      : `Correct answer: ${currentQ.options[currentQ.correct]}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Star className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Vocabulary Variety Star
            </h1>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-white/80">Choose Your Adventure in Words!</p>
        </div>

        {/* Main Selection Area */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Class Selection Column */}
          <div className="md:col-span-1 space-y-3">
            <h2 className="text-xl font-bold text-white mb-2">Class Group</h2>
            {classGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleClassSelect(group.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  group.color
                } ${
                  selectedClass === group.id
                    ? "ring-2 ring-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{group.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{group.name}</h3>
                    <p className="text-xs text-white/80">{group.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Selection Column */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xl font-bold text-white mb-2">Game Mode</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    selectedClass && handleCategorySelect(category.id)
                  }
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    category.color
                  } ${
                    selectedCategory === category.id
                      ? "ring-2 ring-yellow-400"
                      : "opacity-80 hover:opacity-100"
                  } ${!selectedClass ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl mb-1">{category.icon}</span>
                    <h3 className="font-bold text-white text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/80">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        {selectedClass && selectedCategory && (
          <div className="text-center mt-8">
            <button
              onClick={handleStartGame}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold hover:from-yellow-500 hover:to-orange-600 transition-all"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Stats Footer */}
        <div className="flex justify-center gap-4 mt-8 text-sm">
          <div className="px-3 py-1 bg-white/10 rounded-full text-white">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>12,486 Players</span>
            </span>
          </div>
          <div className="px-3 py-1 bg-white/10 rounded-full text-white">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>5,000+ Words</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyVarietyStar;
