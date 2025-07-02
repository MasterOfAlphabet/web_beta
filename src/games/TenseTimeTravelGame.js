import React, { useState, useEffect } from 'react';
import { Clock, Star, Trophy, Zap, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';

const TenseTimeTravelGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeTokens, setTimeTokens] = useState(0);
  const [currentEra, setCurrentEra] = useState('present');
  const [gameState, setGameState] = useState('menu'); // menu, playing, levelComplete, paradox
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [paradoxAnimation, setParadoxAnimation] = useState(false);

  const eras = {
    past: {
      name: 'Stone Age',
      bg: 'from-amber-600 to-orange-700',
      icon: '🦕',
      color: 'text-amber-100',
      particles: '🌿🦖🔥'
    },
    present: {
      name: 'Modern Day', 
      bg: 'from-blue-500 to-purple-600',
      icon: '🏙️',
      color: 'text-blue-100',
      particles: '🚗✈️🏢'
    },
    future: {
      name: '3024 AD',
      bg: 'from-purple-600 to-pink-600',
      icon: '🚀',
      color: 'text-purple-100',
      particles: '🤖🛸⚡'
    }
  };

  const questions = [
    // Level 1: Simple Tenses
    {
      level: 1,
      era: 'past',
      sentence: "Yesterday, the dinosaur ___ (roar) loudly in the jungle.",
      options: ['roar', 'roared', 'will roar', 'is roaring'],
      correct: 'roared',
      hint: 'Yesterday indicates past time',
      paradox: 'A T-Rex appears in a modern city! 🦖🏙️'
    },
    {
      level: 1,
      era: 'present',
      sentence: "Right now, the robot ___ (dance) in the lab.",
      options: ['danced', 'is dancing', 'will dance', 'dance'],
      correct: 'is dancing',
      hint: 'Right now indicates present continuous',
      paradox: 'The robot starts breakdancing with cavemen! 🤖💃'
    },
    {
      level: 1,
      era: 'future',
      sentence: "Tomorrow, space travelers ___ (visit) Mars.",
      options: ['visit', 'visited', 'will visit', 'are visiting'],
      correct: 'will visit',
      hint: 'Tomorrow indicates future time',
      paradox: 'Martians arrive on Earth instead! 👽🌍'
    },
    // Level 2: Complex Tenses
    {
      level: 2,
      era: 'past',
      sentence: "The caveman ___ (hunt) for three hours when he found the mammoth.",
      options: ['hunted', 'had been hunting', 'was hunting', 'has hunted'],
      correct: 'had been hunting',
      hint: 'Action completed before another past action',
      paradox: 'The mammoth starts hunting the caveman! 🦣👨‍🦲'
    },
    {
      level: 2,
      era: 'present',
      sentence: "Scientists ___ (study) time travel since 2020.",
      options: ['study', 'studied', 'have been studying', 'will study'],
      correct: 'have been studying',
      hint: 'Action started in past, continues to present',
      paradox: 'Time machines start studying scientists! ⏰🔬'
    },
    {
      level: 2,
      era: 'future',
      sentence: "By 3025, humans ___ (colonize) five planets.",
      options: ['colonize', 'colonized', 'will colonize', 'will have colonized'],
      correct: 'will have colonized',
      hint: 'Action completed before a future time',
      paradox: 'Planets start colonizing humans! 🌍👨‍🚀'
    }
  ];

  const currentQuestion = questions[questionIndex];
  const currentEraData = eras[currentEra];

  useEffect(() => {
    if (currentQuestion) {
      setCurrentEra(currentQuestion.era);
    }
  }, [questionIndex]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.correct) {
      setScore(prev => prev + 100);
      setTimeTokens(prev => prev + 10);
      setStreak(prev => prev + 1);
      setFeedback('Excellent! Time flows correctly! ⏰✨');
      
      setTimeout(() => {
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(prev => prev + 1);
          setSelectedAnswer('');
          setFeedback('');
        } else {
          setGameState('levelComplete');
        }
      }, 2000);
    } else {
      setStreak(0);
      setFeedback('Time paradox detected! ' + currentQuestion.paradox);
      setParadoxAnimation(true);
      
      setTimeout(() => {
        setParadoxAnimation(false);
        setSelectedAnswer('');
        setFeedback('');
      }, 3000);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setQuestionIndex(0);
    setSelectedAnswer('');
    setFeedback('');
    setCurrentLevel(1);
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setGameState('playing');
    setQuestionIndex(questions.findIndex(q => q.level === currentLevel + 1));
  };

  const restartGame = () => {
    setGameState('menu');
    setScore(0);
    setTimeTokens(0);
    setCurrentLevel(1);
    setQuestionIndex(0);
    setStreak(0);
  };

  if (gameState === 'menu') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentEraData.bg} flex items-center justify-center p-4`}>
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white drop-shadow-2xl animate-pulse">
              ⏰ Tense Time Travel
            </h1>
            <p className="text-2xl text-white/90 font-medium">
              Master verb tenses across the ages!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(eras).map(([key, era]) => (
                <div key={key} className="text-center space-y-2">
                  <div className="text-4xl">{era.icon}</div>
                  <div className="text-white font-semibold">{era.name}</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white text-xl font-semibold">How to Play:</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• Choose the correct verb tense for each sentence</li>
                <li>• Travel through different time periods</li>
                <li>• Avoid time paradoxes (wrong answers!)</li>
                <li>• Collect Time Tokens to unlock new eras</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-bold hover:bg-purple-100 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            <span className="flex items-center gap-2">
              Start Adventure <ChevronRight className="w-6 h-6" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentEraData.bg} transition-all duration-1000`}>
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({length: 6}).map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl opacity-20 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {currentEraData.particles.split('')[i % 3]}
            </div>
          ))}
        </div>

        {/* Header Stats */}
        <div className="relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">{score}</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">{timeTokens}</span>
                  </div>
                </div>
                {streak > 0 && (
                  <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2 text-yellow-100">
                      <Zap className="w-5 h-5" />
                      <span className="font-bold">{streak} streak!</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="text-white/80 text-sm">Current Era</div>
                <div className="text-white font-bold text-lg flex items-center gap-2">
                  <span>{currentEraData.icon}</span>
                  {currentEraData.name}
                </div>
              </div>
            </div>

            {/* Time Machine Interface */}
            <div className={`bg-white/10 backdrop-blur-md rounded-3xl p-8 space-y-6 ${paradoxAnimation ? 'animate-pulse bg-red-500/30' : ''}`}>
              <div className="text-center space-y-2">
                <div className="text-6xl">{currentEraData.icon}</div>
                <h2 className="text-2xl font-bold text-white">
                  Time Machine Console
                </h2>
                <div className="text-white/80">
                  Level {currentLevel} • Question {questionIndex + 1} of {questions.filter(q => q.level === currentLevel).length}
                </div>
              </div>

              {/* Question */}
              <div className="bg-white/20 rounded-2xl p-6 space-y-4">
                <div className="text-white text-xl font-medium leading-relaxed">
                  {currentQuestion.sentence}
                </div>
                
                {/* Hint */}
                <div className="bg-blue-500/20 rounded-lg p-3">
                  <div className="text-blue-100 text-sm flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Hint: {currentQuestion.hint}
                  </div>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== ''}
                    className={`p-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                      selectedAnswer === option
                        ? option === currentQuestion.correct
                          ? 'bg-green-500 text-white shadow-lg transform scale-105'
                          : 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:transform hover:scale-105'
                    } ${selectedAnswer !== '' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`text-center p-4 rounded-xl ${
                  feedback.includes('Excellent') 
                    ? 'bg-green-500/20 text-green-100' 
                    : 'bg-red-500/20 text-red-100'
                }`}>
                  <div className="text-lg font-semibold">{feedback}</div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${((questionIndex + 1) / questions.filter(q => q.level === currentLevel).length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'levelComplete') {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentEraData.bg} flex items-center justify-center p-4`}>
        <div className="text-center space-y-8 max-w-2xl">
          <div className="space-y-4">
            <div className="text-8xl animate-bounce">🏆</div>
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
              Level Complete!
            </h1>
            <p className="text-xl text-white/90">
              You've mastered {currentEraData.name}!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-white/80">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{timeTokens}</div>
                <div className="text-white/80">Time Tokens</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            {currentLevel < 2 && (
              <button
                onClick={nextLevel}
                className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-bold hover:bg-purple-100 transform hover:scale-105 transition-all duration-200 shadow-2xl"
              >
                Next Level
              </button>
            )}
            <button
              onClick={restartGame}
              className="bg-white/20 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-white/30 transform hover:scale-105 transition-all duration-200 backdrop-blur-md"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Play Again
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default TenseTimeTravelGame;