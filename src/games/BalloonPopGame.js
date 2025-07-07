import React, { useState, useEffect, useRef } from "react";

const BalloonPopGame = () => {
  const wordsByDifficulty = {
    easy: [
      "CAT",
      "DOG",
      "SUN",
      "CAR",
      "BAT",
      "HAT",
      "BIG",
      "RED",
      "BLUE",
      "FUN",
    ],
    medium: [
      "APPLE",
      "GRAPE",
      "LEMON",
      "PEACH",
      "MANGO",
      "TIGER",
      "HORSE",
      "EAGLE",
      "OCEAN",
      "PLANE",
    ],
    hard: [
      "ELEPHANT",
      "BUTTERFLY",
      "KANGAROO",
      "CROCODILE",
      "RHINOCEROS",
      "AEROPLANE",
      "UNIVERSE",
      "MOUNTAIN",
      "HOSPITAL",
      "BASKETBALL",
    ],
  };

  // Game state
  const [gameStage, setGameStage] = useState("setup");
  const [gameSettings, setGameSettings] = useState({
    difficulty: "medium",
    skillLevel: 2,
    totalWords: 5,
  });
  const [gameResults, setGameResults] = useState(null);

  // Active game state
  const [selectedWord, setSelectedWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [poppedIndices, setPoppedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showWrongPop, setShowWrongPop] = useState(null);
  const [showCorrectPop, setShowCorrectPop] = useState(null);
  const gameContainerRef = useRef(null);

  const [selectedWords, setSelectedWords] = useState([]);
  const [wordStats, setWordStats] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [wordTimeLeft, setWordTimeLeft] = useState(0);
  const [gameTimeLeft, setGameTimeLeft] = useState(0);

  // Add these state variables
  const [wordStartTimes, setWordStartTimes] = useState([]);
  const [completedWords, setCompletedWords] = useState([]);

  // Vibrant balloon colors
  const balloonColors = [
    "from-pink-400 to-rose-500",
    "from-purple-400 to-indigo-500",
    "from-blue-400 to-cyan-500",
    "from-green-400 to-emerald-500",
    "from-yellow-400 to-orange-500",
    "from-red-400 to-pink-500",
    "from-indigo-400 to-purple-500",
  ];

  // Results screen state
  const [showStats, setShowStats] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [confettiActive, setConfettiActive] = useState(true);

  const skillLevels = [
    { name: "Rookie", timeMultiplier: 1.5, scoreMultiplier: 1 },
    { name: "Racer", timeMultiplier: 1.3, scoreMultiplier: 1.2 },
    { name: "Master", timeMultiplier: 1.0, scoreMultiplier: 1.5 },
    { name: "Prodigy", timeMultiplier: 0.8, scoreMultiplier: 2 },
    { name: "Wizard", timeMultiplier: 0.6, scoreMultiplier: 3 },
  ];

  const difficultyLevels = [
    { key: "easy", label: "Easy", icon: "🌱" },
    { key: "medium", label: "Medium", icon: "⚡" },
    { key: "hard", label: "Hard", icon: "🔥" },
  ];

  const scrambleLetters = (word) => {
    const letters = word.split("").map((letter, index) => ({
      letter,
      originalIndex: index,
    }));

    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    setScrambledLetters(letters);
  };

  const handleStartGame = () => {
    const difficultyWords = [...wordsByDifficulty[gameSettings.difficulty]];
    const selectedWords = [];

    // Shuffle words
    for (let i = difficultyWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [difficultyWords[i], difficultyWords[j]] = [
        difficultyWords[j],
        difficultyWords[i],
      ];
    }

    // Select words
    for (
      let i = 0;
      i < Math.min(gameSettings.totalWords, difficultyWords.length);
      i++
    ) {
      selectedWords.push(difficultyWords[i]);
    }

    // Initialize game state
    setScore(0);
    setLives(3);
    setCurrentWordIndex(0);
    setPoppedIndices([]);
    setSelectedWords(selectedWords);
    setSelectedWord(selectedWords[0]);
    setWordStats([]);
    setCompletedWords([]);
    setWordStartTimes([Date.now()]); // Track first word start time
    setStartTime(Date.now());

    // Initialize timers
    const wordTime = Math.floor(
      60 * skillLevels[gameSettings.skillLevel].timeMultiplier
    );
    setWordTimeLeft(wordTime);
    setGameTimeLeft(wordTime * gameSettings.totalWords);

    scrambleLetters(selectedWords[0]);
    setGameStage("active");
  };

  const handleWordTimeout = () => {
    const now = Date.now();
    const wordTime = Math.floor(
      (now - wordStartTimes[currentWordIndex]) / 1000
    );

    setWordStats((prev) => [
      ...prev,
      {
        word: selectedWord,
        time: wordTime,
        score: 0,
        perfect: false,
        attempts: poppedIndices.length,
      },
    ]);

    if (currentWordIndex + 1 < selectedWords.length) {
      setTimeout(() => {
        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);
        setPoppedIndices([]);
        setSelectedWord(selectedWords[nextIndex]);
        setWordStartTimes((prev) => [...prev, Date.now()]);
        scrambleLetters(selectedWords[nextIndex]);
        setWordTimeLeft(
          Math.floor(60 * skillLevels[gameSettings.skillLevel].timeMultiplier)
        );
      }, 1000);
    } else {
      endGame(false);
    }
  };

  const handlePop = (originalIndex, scrambledIndex) => {
    if (poppedIndices.includes(scrambledIndex)) return;

    const nextExpectedLetter = selectedWord[poppedIndices.length];
    const isCorrect =
      scrambledLetters[scrambledIndex].letter === nextExpectedLetter;

    if (isCorrect) {
      const newPoppedIndices = [...poppedIndices, scrambledIndex];
      setPoppedIndices(newPoppedIndices);
      setScore(
        (prev) =>
          prev + 50 * skillLevels[gameSettings.skillLevel].scoreMultiplier
      );
      setShowCorrectPop(scrambledIndex);
      setTimeout(() => setShowCorrectPop(null), 1000);

      // If word is completed, handle it
      if (newPoppedIndices.length === selectedWord.length) {
        handleWordCompletion(); // No delay needed now
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setShowWrongPop(scrambledIndex);
      setTimeout(() => setShowWrongPop(null), 1000);

      // If this was the last life, end the game with current progress
      if (newLives <= 0) {
        // If we just completed the word (last correct letter + wrong click)
        if (poppedIndices.length + 1 === selectedWord.length) {
          handleWordCompletion().then(() => endGame(false));
        } else {
          endGame(false);
        }
      }
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (gameStage !== "active") return;

    const wordTimer = setInterval(() => {
      setWordTimeLeft((prev) => {
        if (prev <= 1) {
          handleWordTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const gameTimer = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(wordTimer);
      clearInterval(gameTimer);
    };
  }, [gameStage, currentWordIndex, wordStartTimes]);

  const endGame = (
    completed,
    finalWordStats = wordStats,
    finalScore = score
  ) => {
    const now = Date.now();
    const totalTime = Math.floor((now - wordStartTimes[0]) / 1000);

    // Use passed-in stats if available, else fall back to state
    const allWordStats = finalWordStats || [...wordStats];
    const finalScoreValue = finalScore || score;

    // Check if the last word was completed but not recorded
    const lastWordCompleted = poppedIndices.length === selectedWord.length;

    if (lastWordCompleted && !completedWords.includes(selectedWord)) {
      const wordTime = Math.floor(
        (now - wordStartTimes[currentWordIndex]) / 1000
      );
      const wordScore =
        50 *
        selectedWord.length *
        skillLevels[gameSettings.skillLevel].scoreMultiplier;

      allWordStats.push({
        word: selectedWord,
        time: wordTime,
        score: wordScore,
        perfect: true,
        attempts: selectedWord.length,
      });

      setScore((prev) => prev + wordScore);
      setCompletedWords((prev) => [...prev, selectedWord]);
    }

    // Include current word if incomplete
    if (!lastWordCompleted && allWordStats.length <= currentWordIndex) {
      const wordTime = Math.floor(
        (now - wordStartTimes[currentWordIndex]) / 1000
      );
      allWordStats.push({
        word: selectedWord,
        time: wordTime,
        score:
          poppedIndices.length *
          50 *
          skillLevels[gameSettings.skillLevel].scoreMultiplier,
        perfect: false,
        attempts: poppedIndices.length,
      });
    }
    const perfectWords = allWordStats.filter(
      (stat) => stat.perfect || stat.attempts === stat.word.length
    ).length;
    const totalAttempts = allWordStats.reduce(
      (acc, stat) => acc + stat.attempts,
      0
    );
    const totalLetters = allWordStats.reduce(
      (acc, stat) => acc + stat.word.length,
      0
    );
    const accuracy =
      totalLetters > 0
        ? Math.round((totalLetters / totalAttempts) * 1000) / 10
        : 0;

    const results = {
      gameCompleted: completed,
      finalScore: score + perfectWords * 100,
      totalTime,
      wordsCompleted: allWordStats.length,
      totalWords: gameSettings.totalWords,
      lives,
      difficulty: gameSettings.difficulty,
      skillLevel: skillLevels[gameSettings.skillLevel].name,
      accuracy,
      averageTimePerWord:
        allWordStats.length > 0
          ? Math.round(totalTime / allWordStats.length)
          : 0,
      bestWordTime:
        allWordStats.length > 0
          ? Math.min(...allWordStats.map((stat) => stat.time))
          : 0,
      slowestWordTime:
        allWordStats.length > 0
          ? Math.max(...allWordStats.map((stat) => stat.time))
          : 0,
      perfectWords,
      bonusPoints: perfectWords * 100,
      wordBreakdown: allWordStats,
    };

    setGameResults(results);
    setGameStage("results");
  };

  const handleWordCompletion = () => {
    const now = Date.now();
    const wordTime = Math.floor(
      (now - wordStartTimes[currentWordIndex]) / 1000
    );

    const wordScore =
      50 *
      selectedWord.length *
      skillLevels[gameSettings.skillLevel].scoreMultiplier;

    // Compute new state in memory first
    const newWordStat = {
      word: selectedWord,
      time: wordTime,
      score: wordScore,
      perfect: true,
      attempts: selectedWord.length,
    };
    const newWordStats = [...wordStats, newWordStat];
    const newScore = score + wordScore;

    // Update state
    setWordStats(newWordStats);
    setScore(newScore);
    setCompletedWords((prev) => [...prev, selectedWord]);

    if (currentWordIndex + 1 < selectedWords.length) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setPoppedIndices([]);
      setSelectedWord(selectedWords[nextIndex]);
      setWordStartTimes((prev) => [...prev, Date.now()]);
      scrambleLetters(selectedWords[nextIndex]);
      setWordTimeLeft(
        Math.floor(60 * skillLevels[gameSettings.skillLevel].timeMultiplier)
      );
    } else {
      // Pass computed values directly to avoid state delay issues
      endGame(true, newWordStats, newScore);
    }
  };

  const handleEndGame = () => endGame(false);
  const handlePlayAgain = () => setGameStage("setup");
  const handleMainMenu = () => setGameStage("setup");
  const handleSettings = () => setGameStage("setup");

  // Results screen animations
  useEffect(() => {
    if (gameStage !== "results") return;

    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1000);
    const timer3 = setTimeout(() => setShowStats(true), 1500);
    const timer4 = setTimeout(() => setConfettiActive(false), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [gameStage]);

  const currentProgress = () => selectedWord.slice(0, poppedIndices.length);

  const progressPercentage = () => {
    const currentWordProgress = poppedIndices.length / selectedWord.length;
    const totalProgress = currentWordIndex + currentWordProgress;
    return (totalProgress / gameSettings.totalWords) * 100;
  };

  const letterProgressPercentage = () =>
    (poppedIndices.length / selectedWord.length) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreGrade = (score) => {
    if (score >= 4500)
      return { grade: "S", color: "from-yellow-400 to-orange-500" };
    if (score >= 4000)
      return { grade: "A", color: "from-green-400 to-emerald-500" };
    if (score >= 3500)
      return { grade: "B", color: "from-blue-400 to-cyan-500" };
    if (score >= 3000)
      return { grade: "C", color: "from-purple-400 to-pink-500" };
    return { grade: "D", color: "from-gray-400 to-gray-500" };
  };

  // Render Setup Screen
  if (gameStage === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8 px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-6">
              <div className="text-8xl animate-bounce mb-4">🎈</div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
                Balloon Pop
              </h1>
              <div className="text-2xl font-semibold text-white/90 mb-2">
                Challenge
              </div>
            </div>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Pop the balloons in the correct order to spell the word!
              <br />
              <span className="text-cyan-300">
                Choose your settings and let's begin!
              </span>
            </p>
          </div>

          {/* Main Settings Card */}
          <div className="w-full max-w-2xl">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
              {/* Difficulty Selection */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Difficulty Level
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.key}
                      onClick={() =>
                        setGameSettings({
                          ...gameSettings,
                          difficulty: level.key,
                        })
                      }
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                        gameSettings.difficulty === level.key
                          ? "border-white/80 bg-white/30 shadow-lg ring-4 ring-white/20"
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3 group-hover:animate-bounce">
                          {level.icon}
                        </div>
                        <div
                          className={`text-lg font-bold mb-2 ${
                            gameSettings.difficulty === level.key
                              ? "text-white"
                              : "text-white/80"
                          }`}
                        >
                          {level.label}
                        </div>
                        <div className="text-sm text-white/60">
                          {level.key === "easy" && "3-4 letters"}
                          {level.key === "medium" && "5-6 letters"}
                          {level.key === "hard" && "7+ letters"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Level Selection */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  Skill Level
                </h3>
                <div className="space-y-3">
                  {skillLevels.map((level, index) => (
                    <button
                      key={level.name}
                      onClick={() =>
                        setGameSettings({ ...gameSettings, skillLevel: index })
                      }
                      className={`group w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                        gameSettings.skillLevel === index
                          ? "border-white/50 bg-white/20 shadow-lg"
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              index === 0
                                ? "bg-blue-400"
                                : index === 1
                                ? "bg-green-400"
                                : index === 2
                                ? "bg-yellow-400"
                                : index === 3
                                ? "bg-orange-400"
                                : "bg-red-400"
                            } shadow-lg`}
                          />
                          <div>
                            <div className="text-lg font-bold text-white text-left">
                              {level.name}
                            </div>
                            <div className="text-sm text-white/60 text-left">
                              {index === 0 && "Perfect for beginners"}
                              {index === 1 && "Getting faster"}
                              {index === 2 && "Skilled player"}
                              {index === 3 && "Advanced challenger"}
                              {index === 4 && "Ultimate master"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white/80 font-medium">
                            Time: {level.timeMultiplier}x
                          </div>
                          <div className="text-sm text-white/80 font-medium">
                            Score: {level.scoreMultiplier}x
                          </div>
                        </div>
                      </div>

                      {gameSettings.skillLevel === index && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-purple-400/10 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Words */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">📝</span>
                  Number of Words
                </h3>
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-white mb-2">
                      {gameSettings.totalWords}
                    </div>
                    <div className="text-white/60">words to complete</div>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={gameSettings.totalWords}
                      onChange={(e) =>
                        setGameSettings({
                          ...gameSettings,
                          totalWords: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, 
                          rgb(59 130 246) 0%, 
                          rgb(59 130 246) ${
                            ((gameSettings.totalWords - 3) / 7) * 100
                          }%, 
                          rgba(255,255,255,0.2) ${
                            ((gameSettings.totalWords - 3) / 7) * 100
                          }%, 
                          rgba(255,255,255,0.2) 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-3 px-1">
                      <span>3 (Quick)</span>
                      <span>5 (Normal)</span>
                      <span>7 (Long)</span>
                      <span>10 (Marathon)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartGame}
                className="group w-full py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-3xl group-hover:animate-bounce">
                    🚀
                  </span>
                  <span>Start Adventure</span>
                  <span className="text-3xl group-hover:animate-bounce">
                    🎈
                  </span>
                </div>
              </button>

              {/* Game Preview */}
              <div className="mt-8 text-center">
                <div className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-2">Game Preview</div>
                  <div className="text-white/80 font-medium">
                    {gameSettings.difficulty.charAt(0).toUpperCase() +
                      gameSettings.difficulty.slice(1)}{" "}
                    • {skillLevels[gameSettings.skillLevel].name} •{" "}
                    {gameSettings.totalWords} words
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    Estimated time:{" "}
                    {Math.round(
                      (gameSettings.totalWords *
                        60 *
                        skillLevels[gameSettings.skillLevel].timeMultiplier) /
                        60
                    )}{" "}
                    minutes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm">
              🎈 Click balloons in the correct order to spell words • Test your
              speed and accuracy! 🎈
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }

          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #06b6d4, #8b5cf6);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
          }

          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          }

          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #06b6d4, #8b5cf6);
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    );
  }

  // Render Active Game Screen
  if (gameStage === "active") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/30 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>

        <div className="relative z-10 py-6 px-4">
          {/* Top Progress Bar */}
          <div className="mb-6 flex items-center w-full max-w-6xl mx-auto">
            <div className="w-3/4 pr-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-white/80">
                  Word {currentWordIndex + 1} of {gameSettings.totalWords}
                </span>
                <span className="text-sm font-medium text-white/80">
                  {Math.round(progressPercentage())}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm border border-white/30">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progressPercentage()}%` }}
                >
                  <div className="h-full bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="w-1/4">
              <button
                onClick={handleEndGame}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 backdrop-blur-sm"
              >
                End Game
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Score */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl mb-2 group-hover:animate-bounce">
                  🏆
                </div>
                <div className="text-sm text-white/60 mb-1">Score</div>
                <div className="text-2xl font-bold text-white">
                  {score.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Lives */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl mb-2 group-hover:animate-bounce">
                  💕
                </div>
                <div className="text-sm text-white/60 mb-1">Lives</div>
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl transition-all duration-300 ${
                        i < lives
                          ? "text-red-400 animate-pulse"
                          : "text-white/20"
                      }`}
                    >
                      ♥
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl mb-2 group-hover:animate-bounce">
                  ⏱️
                </div>
                <div className="text-sm text-white/60 mb-1">Word Time</div>
                <div
                  className={`text-2xl font-bold ${
                    wordTimeLeft <= 10
                      ? "text-red-400 animate-pulse"
                      : "text-white"
                  }`}
                >
                  {wordTimeLeft}s
                </div>
                <div className="text-sm text-white/60 mt-2">
                  Total: {formatTime(gameTimeLeft)}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-center">
                <div className="text-2xl mb-2 group-hover:animate-bounce">
                  📊
                </div>
                <div className="text-sm text-white/60 mb-1">Progress</div>
                <div className="text-lg font-bold text-white">
                  {poppedIndices.length}/{selectedWord.length}
                </div>
              </div>
            </div>
          </div>

          {/* Word Display */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                  Pop the letters in order
                </div>
                <div className="text-5xl font-bold font-mono tracking-wider mb-4">
                  <span className="text-green-400 drop-shadow-lg">
                    {currentProgress()}
                  </span>
                  <span className="text-white/40">
                    {selectedWord.slice(poppedIndices.length)}
                  </span>
                </div>
                <div className="text-sm text-white/60 mb-2">
                  Word {currentWordIndex + 1} of {selectedWords.length}:{" "}
                  {selectedWord}
                </div>

                {/* Letter Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm border border-white/30">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${letterProgressPercentage()}%` }}
                  >
                    <div className="h-full bg-white/30 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-white/60 mt-2">
                  {poppedIndices.length} of {selectedWord.length} letters
                  completed
                </div>
              </div>
            </div>
          </div>

          {/* Balloons Grid */}
          <div
            ref={gameContainerRef}
            className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-8 min-h-[400px] items-center relative"
          >
            {scrambledLetters.map(
              ({ letter, originalIndex }, scrambledIndex) => (
                <div key={scrambledIndex} className="relative">
                  <button
                    onClick={() => handlePop(originalIndex, scrambledIndex)}
                    disabled={poppedIndices.includes(scrambledIndex)}
                    className={`relative transition-all duration-500 ease-in-out transform ${
                      poppedIndices.includes(scrambledIndex)
                        ? "scale-0 opacity-0 rotate-180"
                        : "hover:scale-110 hover:-translate-y-2 hover:rotate-3"
                    } ${
                      showWrongPop === scrambledIndex ? "animate-wiggle" : ""
                    } ${
                      showCorrectPop === scrambledIndex ? "animate-bounce" : ""
                    }`}
                  >
                    {/* Balloon */}
                    <div
                      className={`w-20 h-24 md:w-24 md:h-28 rounded-full bg-gradient-to-br ${
                        balloonColors[scrambledIndex % balloonColors.length]
                      } shadow-2xl flex items-center justify-center text-white font-bold text-2xl md:text-3xl border-2 border-white/30 backdrop-blur-sm relative overflow-hidden group`}
                    >
                      {/* Balloon highlight */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-full blur-sm"></div>

                      {/* Letter */}
                      <span className="relative z-10 drop-shadow-lg">
                        {letter}
                      </span>

                      {/* Balloon shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent group-hover:from-white/30 transition-all duration-300"></div>
                    </div>

                    {/* Balloon string */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-8 md:h-10 bg-white/60 -mb-6 md:-mb-8 rounded-full shadow-sm"></div>
                  </button>

                  {/* Pop effects */}
                  {showCorrectPop === scrambledIndex && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping">
                        ✨
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-400 font-bold text-lg animate-bounce">
                        +50
                      </div>
                    </div>
                  )}

                  {showWrongPop === scrambledIndex && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping">
                        💥
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-400 font-bold text-lg animate-bounce">
                        -1 ♥
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          {/* Time Warning */}
          {wordTimeLeft <= 10 && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="backdrop-blur-xl bg-red-500/20 rounded-3xl p-8 border border-red-500/30 animate-pulse">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">⏰</div>
                  <div className="text-2xl font-bold">TIME RUNNING OUT!</div>
                  <div className="text-4xl font-bold">{wordTimeLeft}s</div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-white/70 text-lg">
                🎈 Click the balloons in the correct order to spell{" "}
                <span className="font-bold text-cyan-300">
                  "{selectedWord}"
                </span>{" "}
                🎈
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes wiggle {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-3deg);
            }
            75% {
              transform: rotate(3deg);
            }
          }

          .animate-wiggle {
            animation: wiggle 0.3s ease-in-out infinite;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Render Results Screen
  if (gameStage === "results" && gameResults) {
    const scoreGrade = getScoreGrade(gameResults.finalScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/4 right-1/3 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        {/* Confetti Animation */}
        {confettiActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div
                  className={`w-3 h-3 rotate-45 ${
                    [
                      "bg-yellow-400",
                      "bg-pink-400",
                      "bg-blue-400",
                      "bg-green-400",
                      "bg-purple-400",
                    ][i % 5]
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="relative z-10 py-8 px-4">
          {/* Main Results Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              animationPhase >= 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="mb-6">
              <div className="text-8xl mb-4 animate-bounce">
                {gameResults.gameCompleted ? "🎉" : "💔"}
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {gameResults.gameCompleted ? "Congratulations!" : "Game Over"}
              </h1>
              <div className="text-2xl font-semibold text-white/90 mb-4">
                {gameResults.gameCompleted
                  ? "You completed the challenge!"
                  : "Better luck next time!"}
              </div>
            </div>
          </div>

          {/* Score Display */}
          <div
            className={`max-w-4xl mx-auto mb-8 transition-all duration-1000 delay-500 ${
              animationPhase >= 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="flex justify-center items-center gap-6 mb-6">
                  <div
                    className={`w-24 h-24 rounded-full bg-gradient-to-r ${scoreGrade.color} flex items-center justify-center text-4xl font-bold text-white shadow-2xl animate-pulse`}
                  >
                    {scoreGrade.grade}
                  </div>
                  <div>
                    <div className="text-6xl font-bold text-white mb-2">
                      {gameResults.finalScore.toLocaleString()}
                    </div>
                    <div className="text-white/60 text-lg">Final Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">⏱️</div>
                    <div className="text-2xl font-bold text-white">
                      {formatTime(gameResults.totalTime)}
                    </div>
                    <div className="text-white/60 text-sm">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-2xl font-bold text-white">
                      {gameResults.accuracy}%
                    </div>
                    <div className="text-white/60 text-sm">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💖</div>
                    <div className="text-2xl font-bold text-white">
                      {gameResults.lives}
                    </div>
                    <div className="text-white/60 text-sm">Lives Left</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-2xl font-bold text-white">
                      {gameResults.perfectWords}
                    </div>
                    <div className="text-white/60 text-sm">Perfect Words</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          {showStats && (
            <div className="max-w-6xl mx-auto mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Word Analysis ({gameResults.wordBreakdown.length} of{" "}
                    {gameResults.totalWords})
                  </h3>
                  <div className="space-y-4">
                    {gameResults.wordBreakdown.map((word, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">{word.word}</span>
                          <span
                            className={
                              word.perfect
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {word.perfect
                              ? `+${word.score}`
                              : word.attempts > 0
                              ? `+${word.score}`
                              : "Incomplete"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 text-sm mt-2 gap-2">
                          <span>Time: {word.time || 0}s</span>
                          <span>
                            Letters: {word.attempts}/{word.word.length}
                          </span>
                          <span className="text-right">
                            {word.perfect
                              ? "✨ Perfect"
                              : word.attempts === word.word.length
                              ? "✅ Completed"
                              : `Score: ${word.score}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Performance Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-white/60">Total Time</div>
                      <div className="text-2xl font-bold">
                        {formatTime(gameResults.totalTime)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-white/60">
                        Words Completed
                      </div>
                      <div className="text-2xl font-bold">
                        {gameResults.wordsCompleted}/{gameResults.totalWords}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-white/60">Average Time</div>
                      <div className="text-2xl font-bold">
                        {gameResults.averageTimePerWord}s
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-sm text-white/60">Accuracy</div>
                      <div className="text-2xl font-bold">
                        {gameResults.accuracy}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Action Buttons */}
          <div
            className={`max-w-2xl mx-auto transition-all duration-1000 delay-1000 ${
              showStats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handlePlayAgain}
                className="group py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-spin">🔄</span>
                  <span>Play Again</span>
                </div>
              </button>

              <button
                onClick={handleSettings}
                className="group py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-spin">⚙️</span>
                  <span>Settings</span>
                </div>
              </button>

              <button
                onClick={handleMainMenu}
                className="group py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-bounce">
                    🏠
                  </span>
                  <span>Main Menu</span>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Message */}
          <div
            className={`mt-12 text-center transition-all duration-1000 delay-1500 ${
              showStats ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/10 max-w-2xl mx-auto">
              <p className="text-white/70 text-lg">
                🎈 Thanks for playing Balloon Pop Challenge! 🎈
              </p>
              <p className="text-white/50 text-sm mt-2">
                Keep practicing to improve your speed and accuracy!
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }

          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }

          .confetti-piece {
            animation: confetti-fall 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export default BalloonPopGame;
