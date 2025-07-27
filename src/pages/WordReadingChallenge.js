import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Star, Trophy, Clock, RotateCcw, Play, Volume2, 
  Users, GraduationCap, Timer, BarChart3, CheckCircle, 
  XCircle, Target, Zap, Brain, Award, Pause
} from 'lucide-react';

// Enhanced Time Tracking Hook
const useTimeTracking = () => {
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [currentWordStartTime, setCurrentWordStartTime] = useState(null);
  const [wordTimes, setWordTimes] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const startSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsActive(true);
    setIsPaused(false);
  };

  const endSession = () => {
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startWordTimer = (wordIndex) => {
    setCurrentWordStartTime(Date.now());
  };

  const endWordTimer = (wordIndex, isCorrect) => {
    if (currentWordStartTime) {
      const wordTime = Date.now() - currentWordStartTime;
      setWordTimes(prev => [...prev, {
        wordIndex,
        time: wordTime,
        isCorrect,
        timestamp: new Date().toISOString()
      }]);
      setCurrentWordStartTime(null);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTracking = () => {
    setSessionStartTime(null);
    setTotalSessionTime(0);
    setCurrentWordStartTime(null);
    setWordTimes([]);
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive && !isPaused && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        setTotalSessionTime(Date.now() - sessionStartTime);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, sessionStartTime]);

  const getStats = () => {
    if (wordTimes.length === 0) return {
      averageTimePerWord: 0,
      fastestWord: 0,
      slowestWord: 0,
      accuracyRate: 0,
      totalWords: 0,
      correctWords: 0
    };

    const times = wordTimes.map(w => w.time);
    const correctWords = wordTimes.filter(w => w.isCorrect).length;
    return {
      averageTimePerWord: times.reduce((a, b) => a + b, 0) / times.length,
      fastestWord: Math.min(...times),
      slowestWord: Math.max(...times),
      accuracyRate: (correctWords / wordTimes.length) * 100,
      totalWords: wordTimes.length,
      correctWords
    };
  };

  return {
    sessionStartTime,
    totalSessionTime,
    currentWordStartTime,
    wordTimes,
    isActive,
    isPaused,
    startSession,
    endSession,
    startWordTimer,
    endWordTimer,
    togglePause,
    resetTracking,
    getStats
  };
};

// Time Display Component
const TimeDisplay = ({ time, label, className = "" }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
};

// Enhanced Statistics Panel
const StatisticsPanel = ({ stats, wordTimes, streak, bestStreak }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds > 60 ? `${Math.floor(seconds/60)}m ${seconds%60}s` : `${seconds}s`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6" /> Performance Stats
      </h3>
      {stats.totalWords > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalWords}</div>
            <div className="text-sm text-white/70">Words Read</div>
          </div>
          <div className="text-center bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-green-400">{Math.round(stats.accuracyRate)}%</div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          <div className="text-center bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-purple-400">{streak}</div>
            <div className="text-sm text-white/70">Current Streak</div>
          </div>
          <div className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-yellow-400">{bestStreak}</div>
            <div className="text-sm text-white/70">Best Streak</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white/60">
          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Start reading words to see your performance!</p>
        </div>
      )}
    </div>
  );
};

// Word Card Component
const WordCard = ({ 
  word, 
  isSelected, 
  isCorrect, 
  isWrong, 
  isRevealed, 
  onClick, 
  difficulty,
  index,
  isAnimating 
}) => {
  const getCardStyle = () => {
    if (isCorrect) return 'bg-gradient-to-br from-green-400/30 to-emerald-600/30 border-green-400/60 text-green-100 shadow-green-500/30';
    if (isWrong) return 'bg-gradient-to-br from-red-400/30 to-pink-600/30 border-red-400/60 text-red-100 shadow-red-500/30';
    if (isSelected) return 'bg-gradient-to-br from-yellow-400/30 to-orange-600/30 border-yellow-400/60 text-yellow-100 shadow-yellow-500/30';
    return 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/30';
  };

  const getDifficultySize = () => {
    switch (difficulty) {
      case 'Easy': return 'text-lg md:text-xl';
      case 'Medium': return 'text-base md:text-lg';
      case 'Hard': return 'text-sm md:text-base';
      default: return 'text-lg md:text-xl';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 
        cursor-pointer backdrop-blur-lg shadow-xl hover:shadow-2xl
        ${getCardStyle()}
        ${isAnimating ? 'animate-pulse scale-110' : ''}
      `}
      style={{ 
        animationDelay: `${index * 50}ms`,
        minHeight: '80px'
      }}
    >
      <div className={`font-bold text-center ${getDifficultySize()}`}>
        {word}
      </div>
      
      {isCorrect && (
        <div className="absolute -top-2 -right-2">
          <CheckCircle className="w-6 h-6 text-green-400 bg-white rounded-full" />
        </div>
      )}
      
      {isWrong && (
        <div className="absolute -top-2 -right-2">
          <XCircle className="w-6 h-6 text-red-400 bg-white rounded-full" />
        </div>
      )}
      
      {isSelected && !isCorrect && !isWrong && (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

// Main Word Reading Challenge Component
const WordReadingChallenge = () => {
  // Word sets for different difficulty levels
  const wordSets = {
    'Class I-II': {
      words: [
        'cat', 'dog', 'sun', 'run', 'big', 'red', 'hat', 'bat', 'map', 'cup',
        'pen', 'bag', 'sit', 'top', 'box', 'fox', 'egg', 'leg', 'net', 'wet',
        'bus', 'fun', 'gun', 'hut', 'jam', 'kit', 'log', 'mom', 'nap', 'owl'
      ],
      difficulty: 'Easy',
      gridSize: { cols: 5, rows: 6 },
      timeLimit: 300000 // 5 minutes
    },
    'Class III-V': {
      words: [
        'school', 'friend', 'family', 'happy', 'garden', 'student', 'teacher', 'library',
        'science', 'history', 'english', 'drawing', 'painting', 'reading', 'writing',
        'computer', 'kitchen', 'bedroom', 'bathroom', 'morning', 'evening', 'chicken',
        'elephant', 'giraffe', 'butterfly', 'mountain', 'rainbow', 'thunder', 'lightning', 'beautiful'
      ],
      difficulty: 'Medium',
      gridSize: { cols: 5, rows: 6 },
      timeLimit: 420000 // 7 minutes
    },
    'Class VI-X': {
      words: [
        'imagination', 'responsibility', 'environment', 'technology', 'development',
        'communication', 'independence', 'opportunity', 'achievement', 'literature',
        'mathematics', 'geography', 'democracy', 'philosophy', 'psychology',
        'architecture', 'photography', 'archaeology', 'astronomy', 'biology',
        'chemistry', 'economics', 'sociology', 'anthropology', 'encyclopedia',
        'extraordinary', 'consciousness', 'appreciation', 'sophisticated', 'magnificent'
      ],
      difficulty: 'Hard',
      gridSize: { cols: 5, rows: 6 },
      timeLimit: 600000 // 10 minutes
    }
  };

  // Game state
  const [selectedClass, setSelectedClass] = useState('Class I-II');
  const [currentWords, setCurrentWords] = useState([]);
  const [targetWord, setTargetWord] = useState('');
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [correctWords, setCorrectWords] = useState(new Set());
  const [wrongWords, setWrongWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState('listen'); // 'listen' or 'find'
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [animatingWord, setAnimatingWord] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Refs and time tracking
  const speechSynthesis = useRef(window.speechSynthesis);
  const timeTracking = useTimeTracking();
  const [currentWordTime, setCurrentWordTime] = useState(0);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, [selectedClass]);

  // Current word timer
  useEffect(() => {
    let interval;
    if (timeTracking.currentWordStartTime && timeTracking.isActive && !timeTracking.isPaused) {
      interval = setInterval(() => {
        setCurrentWordTime(Date.now() - timeTracking.currentWordStartTime);
      }, 1000);
    } else {
      setCurrentWordTime(0);
    }
    return () => clearInterval(interval);
  }, [timeTracking.currentWordStartTime, timeTracking.isActive, timeTracking.isPaused]);

  // Game functions
  const resetGame = () => {
    const words = [...wordSets[selectedClass].words];
    const shuffled = words.sort(() => Math.random() - 0.5);
    setCurrentWords(shuffled.slice(0, wordSets[selectedClass].gridSize.cols * wordSets[selectedClass].gridSize.rows));
    setTargetWord('');
    setSelectedWordIndex(null);
    setCorrectWords(new Set());
    setWrongWords(new Set());
    setScore(0);
    setStreak(0);
    setGameStarted(false);
    setCurrentWordIndex(0);
    setGameCompleted(false);
    setAnimatingWord(null);
    timeTracking.resetTracking();
  };

  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    timeTracking.startSession();
    nextWord();
  };

  const nextWord = () => {
    if (currentWordIndex >= currentWords.length) {
      endGame();
      return;
    }

    const word = currentWords[currentWordIndex];
    setTargetWord(word);
    setSelectedWordIndex(null);
    setAnimatingWord(currentWordIndex);
    timeTracking.startWordTimer(currentWordIndex);
    
    // Speak the word
    if (speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = selectedClass === 'Class I-II' ? 0.8 : selectedClass === 'Class III-V' ? 0.9 : 1.0;
      utterance.lang = 'en-US';
      speechSynthesis.current.speak(utterance);
    }

    setTimeout(() => setAnimatingWord(null), 1000);
  };

  const selectWord = (wordIndex) => {
    if (!gameStarted || correctWords.has(wordIndex) || wrongWords.has(wordIndex)) return;
    
    setSelectedWordIndex(wordIndex);
    const selectedWord = currentWords[wordIndex];
    
    if (selectedWord === targetWord) {
      // Correct answer
      setCorrectWords(prev => new Set([...prev, wordIndex]));
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      timeTracking.endWordTimer(currentWordIndex, true);
      
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        nextWord();
      }, 1000);
    } else {
      // Wrong answer
      setWrongWords(prev => new Set([...prev, wordIndex]));
      setStreak(0);
      timeTracking.endWordTimer(currentWordIndex, false);
      
      setTimeout(() => {
        setSelectedWordIndex(null);
        setWrongWords(prev => {
          const newSet = new Set(prev);
          newSet.delete(wordIndex);
          return newSet;
        });
      }, 1500);
    }
  };

  const repeatWord = () => {
    if (targetWord && speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.rate = selectedClass === 'Class I-II' ? 0.8 : selectedClass === 'Class III-V' ? 0.9 : 1.0;
      utterance.lang = 'en-US';
      speechSynthesis.current.speak(utterance);
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    timeTracking.endSession();
  };

  const getClassIcon = (classLevel) => {
    switch (classLevel) {
      case 'Class I-II': return <BookOpen className="w-5 h-5" />;
      case 'Class III-V': return <Users className="w-5 h-5" />;
      case 'Class VI-X': return <GraduationCap className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-400 to-emerald-600';
      case 'Medium': return 'from-yellow-400 to-orange-600';
      case 'Hard': return 'from-red-400 to-pink-600';
      default: return 'from-blue-400 to-purple-600';
    }
  };

  const stats = timeTracking.getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Word Reading Challenge
            </span>
          </h1>
          <p className="text-xl text-white/80 drop-shadow-lg">
            Listen, Find & Learn - Master Your Reading Skills!
          </p>
        </div>

        {/* Class Selection */}
        {!gameStarted && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Select Your Class Level
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {Object.keys(wordSets).map((classLevel) => (
                <button
                  key={classLevel}
                  onClick={() => setSelectedClass(classLevel)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border flex items-center gap-2 ${
                    selectedClass === classLevel
                      ? 'bg-white/20 border-white/40 text-white shadow-2xl shadow-white/20'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {getClassIcon(classLevel)}
                  {classLevel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Stats and Timer */}
        {gameStarted && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Clock className="w-6 h-6" /> Game Timer
                </h3>
                <button
                  onClick={timeTracking.togglePause}
                  className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    timeTracking.isPaused
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30'
                  }`}
                >
                  {timeTracking.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TimeDisplay time={timeTracking.totalSessionTime} label="Total Time" />
                <TimeDisplay time={currentWordTime} label="Current Word" />
              </div>
            </div>
            
            <StatisticsPanel 
              stats={stats} 
              wordTimes={timeTracking.wordTimes} 
              streak={streak}
              bestStreak={bestStreak}
            />
          </div>
        )}

        {/* Game Progress */}
        {gameStarted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">Progress</span>
                <span className="text-white/80">{currentWordIndex} / {currentWords.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(currentWordIndex / currentWords.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-white/80 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Score: {score}
                  </span>
                  <span className="text-white/80 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Streak: {streak}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(wordSets[selectedClass].difficulty)} text-white font-semibold text-sm`}>
                  {wordSets[selectedClass].difficulty}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Word Display */}
        {gameStarted && !gameCompleted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Find this word in the grid:
              </h3>
              <div className="text-4xl font-bold text-cyan-400 mb-4 animate-pulse">
                "{targetWord}"
              </div>
              <button
                onClick={repeatWord}
                className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/30 flex items-center gap-2 mx-auto"
              >
                <Volume2 className="w-5 h-5" />
                Repeat Word
              </button>
            </div>
          </div>
        )}

        {/* Word Grid */}
        {gameStarted && !gameCompleted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className={`grid gap-4 ${
                wordSets[selectedClass].gridSize.cols === 5 ? 'grid-cols-5' : 
                wordSets[selectedClass].gridSize.cols === 6 ? 'grid-cols-6' : 'grid-cols-4'
              }`}>
                {currentWords.map((word, index) => (
                  <WordCard
                    key={`${word}-${index}`}
                    word={word}
                    isSelected={selectedWordIndex === index}
                    isCorrect={correctWords.has(index)}
                    isWrong={wrongWords.has(index)}
                    onClick={() => selectWord(index)}
                    difficulty={wordSets[selectedClass].difficulty}
                    index={index}
                    isAnimating={animatingWord === index}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Start Game Button */}
        {!gameStarted && (
          <div className="text-center mb-8">
            <button
              onClick={startGame}
              className="px-12 py-6 rounded-3xl font-bold text-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 flex items-center gap-3 mx-auto"
            >
              <Play className="w-8 h-8" />
              Start Word Challenge
            </button>
          </div>
        )}

        {/* Game Completed */}
        {gameCompleted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-4">Congratulations!</h2>
              <p className="text-xl text-white/80 mb-6">
                You've completed the {selectedClass} Word Reading Challenge!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-400">{score}</div>
                  <div className="text-sm text-white/70">Words Found</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-400">{Math.round(stats.accuracyRate)}%</div>
                  <div className="text-sm text-white/70">Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-yellow-400">{bestStreak}</div>
                  <div className="text-sm text-white/70">Best Streak</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.round(timeTracking.totalSessionTime / 1000)}s
                  </div>
                  <div className="text-sm text-white/70">Total Time</div>
                </div>
              </div>
              <button
                onClick={resetGame}
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Instructions Panel */}
        {showInstructions && !gameStarted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                How to Play
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-white/80">
                <div>
                  <h4 className="font-semibold text-white mb-2">🎯 Game Objective</h4>
                  <ul className="space-y-2">
                    <li>• Listen to the spoken word carefully</li>
                    <li>• Find and click the matching word in the grid</li>
                    <li>• Build your reading and listening skills</li>
                    <li>• Achieve the highest streak possible!</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">⚡ Game Features</h4>
                  <ul className="space-y-2">
                    <li>• Three difficulty levels (Class I-II, III-V, VI-X)</li>
                    <li>• Real-time performance tracking</li>
                    <li>• Streak counter and accuracy metrics</li>
                    <li>• Repeat word function for clarity</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-400/30">
                <h4 className="font-semibold text-blue-200 mb-2">💡 Pro Tips</h4>
                <div className="text-blue-100/80 text-sm">
                  <p>• Use the "Repeat Word" button if you need to hear it again</p>
                  <p>• Take your time - accuracy is more important than speed</p>
                  <p>• Watch for visual feedback: green = correct, red = wrong</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Controls */}
        {gameStarted && !gameCompleted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameCompleted(false);
                    timeTracking.endSession();
                  }}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl shadow-red-500/30 flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  End Game
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl shadow-gray-500/30 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Restart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Badges */}
        {gameStarted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  streak >= 5 ? 'bg-gradient-to-br from-yellow-400/30 to-orange-600/30 border-2 border-yellow-400/60' : 'bg-white/5 border border-white/10'
                }`}>
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm font-medium text-white">Hot Streak</div>
                  <div className="text-xs text-white/70">5 in a row</div>
                </div>
                
                <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  stats.accuracyRate >= 90 ? 'bg-gradient-to-br from-green-400/30 to-emerald-600/30 border-2 border-green-400/60' : 'bg-white/5 border border-white/10'
                }`}>
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-sm font-medium text-white">Sharp Shooter</div>
                  <div className="text-xs text-white/70">90% accuracy</div>
                </div>
                
                <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  stats.totalWords >= 20 ? 'bg-gradient-to-br from-blue-400/30 to-purple-600/30 border-2 border-blue-400/60' : 'bg-white/5 border border-white/10'
                }`}>
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-sm font-medium text-white">Word Master</div>
                  <div className="text-xs text-white/70">20 words read</div>
                </div>
                
                <div className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  bestStreak >= 10 ? 'bg-gradient-to-br from-purple-400/30 to-pink-600/30 border-2 border-purple-400/60' : 'bg-white/5 border border-white/10'
                }`}>
                  <div className="text-2xl mb-1">👑</div>
                  <div className="text-sm font-medium text-white">Champion</div>
                  <div className="text-xs text-white/70">10 streak record</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Information */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Learning Benefits
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-white/80">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Reading Skills</h4>
              <p className="text-sm">Improves word recognition, phonics awareness, and reading fluency through interactive practice.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Volume2 className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Listening Skills</h4>
              <p className="text-sm">Enhances auditory processing, pronunciation understanding, and active listening abilities.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Cognitive Development</h4>
              <p className="text-sm">Strengthens memory, attention span, and pattern recognition through engaging gameplay.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p className="text-sm">
            Educational Word Reading Challenge • Designed for Classes I-X • 
            <span className="text-cyan-400"> Enhanced Learning Experience</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordReadingChallenge;