import React, { useState, useEffect, useRef } from 'react';
import { Play, Mic, SkipForward, Star, Trophy, Target, Clock, Volume2, Home, RotateCcw } from 'lucide-react';

// Word Database by Class Level
const WORD_DATABASE = {
  'Class I-II': {
    words: ['cat', 'dog', 'sun', 'ball', 'tree', 'fish', 'bird', 'cake', 'book', 'star'],
    timeLimit: 60,
    difficultyLevel: 'Elementary'
  },
  'Class III-V': {
    words: ['elephant', 'butterfly', 'rainbow', 'computer', 'bicycle', 'penguin', 'telescope', 'adventure', 'mountain', 'wonderful'],
    timeLimit: 90,
    difficultyLevel: 'Intermediate'
  },
  'Class VI-X': {
    words: ['pronunciation', 'extraordinary', 'philosophical', 'metamorphosis', 'sophisticated', 'revolutionary', 'incomprehensible', 'interdisciplinary', 'entrepreneurship', 'circumstantial'],
    timeLimit: 120,
    difficultyLevel: 'Advanced'
  }
};

const DIFFICULTY_LEVELS = [
  { id: 'rookie', name: 'Rookie', icon: '🌱', color: 'from-green-400 to-blue-500' },
  { id: 'racer', name: 'Racer', icon: '🚀', color: 'from-blue-500 to-purple-600' },
  { id: 'master', name: 'Master', icon: '🎯', color: 'from-purple-600 to-pink-600' },
  { id: 'prodigy', name: 'Prodigy', icon: '🧠', color: 'from-pink-600 to-red-600' },
  { id: 'wizard', name: 'Wizard', icon: '🧙‍♂️', color: 'from-red-600 to-orange-600' }
];

const GlassCard = ({ children, className = "", onClick = null, hover = true }) => (
  <div 
    className={`
      backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl
      ${hover ? 'hover:bg-white/20 hover:scale-105 hover:shadow-3xl' : ''}
      transition-all duration-300 transform-gpu
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </div>
);

const AnimatedButton = ({ children, onClick, variant = 'primary', className = "", disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        text-white font-bold py-4 px-8 rounded-2xl shadow-lg
        transform transition-all duration-200 hover:scale-110 hover:shadow-xl
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-3 text-lg
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default function PronunciationPowerStar() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, summary
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    attempts: 0,
    skipped: 0,
    accuracy: 0,
    totalTime: 0
  });
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const timerRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handlePronunciationResult(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Game Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState]);

  const startGame = () => {
    if (!selectedClass || !selectedDifficulty) return;
    
    const words = WORD_DATABASE[selectedClass].words;
    const timeLimit = WORD_DATABASE[selectedClass].timeLimit;
    
    setCurrentWord(words[0]);
    setCurrentWordIndex(0);
    setTimeLeft(timeLimit);
    setScore(0);
    setGameStats({
      correct: 0,
      attempts: 0,
      skipped: 0,
      accuracy: 0,
      totalTime: timeLimit
    });
    setGameState('playing');
  };

  const startRecording = () => {
    if (recognition && !isListening) {
      setIsRecording(true);
      setIsListening(true);
      recognition.start();
    }
  };

  const handlePronunciationResult = (transcript) => {
    const isCorrect = transcript === currentWord.toLowerCase();
    
    setGameStats(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      accuracy: Math.round(((prev.correct + (isCorrect ? 1 : 0)) / (prev.attempts + 1)) * 100)
    }));
    
    if (isCorrect) {
      setScore(prev => prev + getScoreForClass());
      nextWord();
    }
  };

  const getScoreForClass = () => {
    const baseScore = {
      'Class I-II': 10,
      'Class III-V': 15,
      'Class VI-X': 25
    };
    return baseScore[selectedClass] || 10;
  };

  const nextWord = () => {
    const words = WORD_DATABASE[selectedClass].words;
    const nextIndex = currentWordIndex + 1;
    
    if (nextIndex < words.length) {
      setCurrentWord(words[nextIndex]);
      setCurrentWordIndex(nextIndex);
    } else {
      endGame();
    }
  };

  const skipWord = () => {
    setGameStats(prev => ({
      ...prev,
      skipped: prev.skipped + 1
    }));
    nextWord();
  };

  const playWordAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const endGame = () => {
    setGameState('summary');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedClass('');
    setSelectedDifficulty('');
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              🎯 Pronunciation Power Star 🌟
            </h1>
            <p className="text-xl text-white/80">Practice reading and become a reading champion!</p>
          </div>

          {/* Main Menu Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Your Class */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🎓</div>
                <h3 className="text-2xl font-bold text-white mb-6">Your Class</h3>
                <div className="space-y-4">
                  {Object.keys(WORD_DATABASE).map((classLevel) => (
                    <button
                      key={classLevel}
                      onClick={() => setSelectedClass(classLevel)}
                      className={`w-full p-4 rounded-xl font-bold transition-all duration-300 ${
                        selectedClass === classLevel
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg transform scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ⭐ {classLevel}
                      <div className="text-sm opacity-80">{WORD_DATABASE[classLevel].difficultyLevel}</div>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Difficulty */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-6">Difficulty</h3>
                <div className="space-y-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`w-full p-3 rounded-xl font-bold transition-all duration-300 ${
                        selectedDifficulty === level.id
                          ? `bg-gradient-to-r ${level.color} text-white shadow-lg transform scale-105`
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {level.icon} {level.name}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Content */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-6">Content</h3>
                <div className="space-y-4">
                  <div className="bg-cyan-500/20 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📖</div>
                    <h4 className="font-bold text-white">Words</h4>
                    <p className="text-sm text-white/80">Single word adventures</p>
                  </div>
                  <div className="bg-orange-500/20 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📝</div>
                    <h4 className="font-bold text-white">Sentences</h4>
                    <p className="text-sm text-white/80">Complete sentence journeys</p>
                  </div>
                  <div className="bg-pink-500/20 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📄</div>
                    <h4 className="font-bold text-white">Paragraphs</h4>
                    <p className="text-sm text-white/80">Epic paragraph quests</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <AnimatedButton
              onClick={startGame}
              disabled={!selectedClass || !selectedDifficulty}
              className="text-2xl py-6 px-12"
            >
              <Mic className="w-8 h-8" />
              START THE ADVENTURE!
              <Star className="w-8 h-8" />
            </AnimatedButton>
          </div>

          {/* Instructions */}
          <GlassCard className="mt-8 p-6">
            <div className="text-center">
              <p className="text-white/80 text-lg">
                ⭐ Please select your class, difficulty, and content type to begin your reading adventure! ⭐
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-6 h-6" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">{score}</span>
              </div>
              
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold">{timeLeft}s</span>
              </div>
              
              <button 
                onClick={endGame}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                End Game
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-white/20 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                style={{ 
                  width: `${((currentWordIndex + 1) / WORD_DATABASE[selectedClass].words.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Main Game Area */}
          <GlassCard className="p-12 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Volume2 className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Read this word:</h2>
              </div>
              
              <p className="text-blue-300 text-lg mb-8">
                Ready for the next one? Click the microphone!
              </p>
              
              <div className="text-8xl font-bold text-white mb-12 tracking-wider">
                {currentWord}
              </div>
              
              <div className="flex justify-center items-center gap-6 mb-8">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
                    transition-all duration-300 transform hover:scale-110
                    ${isRecording 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-green-500 hover:bg-green-600 shadow-lg'
                    }
                  `}
                >
                  <Mic className={`w-10 h-10 ${isRecording ? 'animate-bounce' : ''}`} />
                </button>
                
                <AnimatedButton onClick={playWordAudio} variant="secondary">
                  <Volume2 className="w-6 h-6" />
                  Play Audio
                </AnimatedButton>
                
                <AnimatedButton onClick={skipWord} variant="warning">
                  <SkipForward className="w-6 h-6" />
                  Skip Word
                </AnimatedButton>
              </div>
              
              <p className="text-white/60">
                {isRecording ? 'Listening... Speak now!' : 'Click to start speaking'}
              </p>
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-blue-300">{gameStats.correct}</div>
              <div className="text-white/80">Correct</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-green-300">{gameStats.accuracy}%</div>
              <div className="text-white/80">Accuracy</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-purple-300">{gameStats.attempts}</div>
              <div className="text-white/80">Attempts</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-orange-300">{gameStats.skipped}</div>
              <div className="text-white/80">Skipped</div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const totalPossibleScore = WORD_DATABASE[selectedClass].words.length * getScoreForClass();
    const scorePercentage = Math.round((score / totalPossibleScore) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
              Keep Practicing!
            </h1>
          </div>

          {/* Session Summary */}
          <GlassCard className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              📊 Session Summary
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">📖 Words</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Completed: <span className="text-white font-bold">{gameStats.correct}</span></div>
                  <div>Skipped: <span className="text-white font-bold">{gameStats.skipped}</span></div>
                  <div>Display Class: <span className="text-white font-bold">{WORD_DATABASE[selectedClass].difficultyLevel}</span></div>
                  <div>Difficulty: <span className="text-white font-bold">Easy</span></div>
                </div>
              </div>
              
              <div className="bg-green-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">📝 Sentences</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Completed: <span className="text-white font-bold">0</span></div>
                  <div>Skipped: <span className="text-white font-bold">0</span></div>
                  <div>Display Class: <span className="text-white font-bold">Intermediate</span></div>
                  <div>Difficulty: <span className="text-white font-bold">Medium</span></div>
                </div>
              </div>
              
              <div className="bg-pink-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">📄 Paragraphs</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Completed: <span className="text-white font-bold">0</span></div>
                  <div>Skipped: <span className="text-white font-bold">0</span></div>
                  <div>Display Class: <span className="text-white font-bold">Advanced</span></div>
                  <div>Difficulty: <span className="text-white font-bold">Hard</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-500/20 p-4 rounded-xl text-center">
              <span className="text-yellow-300">⚠️</span>
              <span className="text-white font-bold ml-2">Total Skipped: {gameStats.skipped}</span>
            </div>
          </GlassCard>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-blue-400 mb-2">{score}</div>
              <div className="text-white/80">Total Score</div>
              <div className="text-sm text-white/60">Points Earned</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-green-400 mb-2">{gameStats.accuracy}%</div>
              <div className="text-white/80">Overall Accuracy</div>
              <div className="text-sm text-white/60">Precision Rate</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-purple-400 mb-2">{gameStats.correct}</div>
              <div className="text-white/80">Correct Readings</div>
              <div className="text-sm text-white/60">Well Done!</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-orange-400 mb-2">{WORD_DATABASE[selectedClass].timeLimit - timeLeft}s</div>
              <div className="text-white/80">Time Taken</div>
              <div className="text-sm text-white/60">Duration</div>
            </GlassCard>
          </div>

          {/* Recent Results */}
          <GlassCard className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              📋 Recent Results
            </h2>
            <div className="text-white/60 text-center py-8">
              Session completed! Check your progress above.
            </div>
          </GlassCard>

          {/* Play Again */}
          <div className="text-center">
            <AnimatedButton
              onClick={resetGame}
              className="text-2xl py-6 px-12"
            >
              <RotateCcw className="w-8 h-8" />
              🎮 Play Again!
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}