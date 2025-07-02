import React, { useState, useEffect } from 'react';
import { Star, Trophy, Award, Target, Zap, BookOpen, Users, Clock, CheckCircle, XCircle, RotateCcw, Home, ArrowRight } from 'lucide-react';

import gameData from "../data/Games/SHARPStylishStar/SHARPQuizData_Canva.json";

const SHARPStylishStarGame = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stars, setStars] = useState(0);
  const [level, setLevel] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState('');

  // Sample data structure

  /**
  const gameData = {
    "I-II": {
      "Synonyms": [
        {"question": "What word means the same as 'big'?", "options": ["Large", "Small", "Tiny", "Little"], "answer": "Large"},
        {"question": "What word means the same as 'happy'?", "options": ["Sad", "Joyful", "Angry", "Tired"], "answer": "Joyful"},
        {"question": "What word means the same as 'fast'?", "options": ["Slow", "Quick", "Lazy", "Heavy"], "answer": "Quick"},
      ],
      "Antonyms": [
        {"question": "What is the opposite of 'hot'?", "options": ["Warm", "Cool", "Cold", "Fire"], "answer": "Cold"},
        {"question": "What is the opposite of 'up'?", "options": ["Over", "Down", "Side", "Near"], "answer": "Down"},
        {"question": "What is the opposite of 'day'?", "options": ["Sun", "Light", "Night", "Morning"], "answer": "Night"},
      ],
      "Homonyms": [
        {"question": "Which word sounds like 'see'?", "options": ["Say", "Sea", "She", "So"], "answer": "Sea"},
        {"question": "Which word sounds like 'know'?", "options": ["Now", "No", "New", "Nice"], "answer": "No"},
        {"question": "Which word sounds like 'one'?", "options": ["Two", "Won", "Win", "Own"], "answer": "Won"},
      ],
      "Rhymes": [
        {"question": "What rhymes with 'cat'?", "options": ["Dog", "Hat", "Fish", "Bird"], "answer": "Hat"},
        {"question": "What rhymes with 'fun'?", "options": ["Play", "Sun", "Game", "Joy"], "answer": "Sun"},
        {"question": "What rhymes with 'book'?", "options": ["Read", "Look", "Page", "Story"], "answer": "Look"},
      ],
      "Plurals": [
        {"question": "What is the plural of 'cat'?", "options": ["Cat", "Cats", "Cates", "Catty"], "answer": "Cats"},
        {"question": "What is the plural of 'box'?", "options": ["Boxs", "Boxes", "Boxies", "Boxen"], "answer": "Boxes"},
        {"question": "What is the plural of 'toy'?", "options": ["Toys", "Toyes", "Toies", "Toy"], "answer": "Toys"},
      ]
    },
    "III-V": {
      "Synonyms": [
        {"question": "What word means the same as 'enormous'?", "options": ["Tiny", "Huge", "Medium", "Small"], "answer": "Huge"},
        {"question": "What word means the same as 'intelligent'?", "options": ["Dumb", "Smart", "Lazy", "Weak"], "answer": "Smart"},
        {"question": "What word means the same as 'brave'?", "options": ["Scared", "Courageous", "Weak", "Shy"], "answer": "Courageous"},
      ],
      "Antonyms": [
        {"question": "What is the opposite of 'victory'?", "options": ["Success", "Defeat", "Win", "Triumph"], "answer": "Defeat"},
        {"question": "What is the opposite of 'ancient'?", "options": ["Old", "Modern", "Historic", "Past"], "answer": "Modern"},
        {"question": "What is the opposite of 'generous'?", "options": ["Kind", "Selfish", "Giving", "Nice"], "answer": "Selfish"},
      ],
      "Homonyms": [
        {"question": "Which word sounds like 'break'?", "options": ["Brick", "Brake", "Brook", "Broke"], "answer": "Brake"},
        {"question": "Which word sounds like 'meat'?", "options": ["Meet", "Mate", "Mute", "Mat"], "answer": "Meet"},
        {"question": "Which word sounds like 'peace'?", "options": ["Place", "Piece", "Please", "Price"], "answer": "Piece"},
      ],
      "Rhymes": [
        {"question": "What rhymes with 'bright'?", "options": ["Dark", "Light", "Sun", "Day"], "answer": "Light"},
        {"question": "What rhymes with 'create'?", "options": ["Make", "Great", "Build", "Form"], "answer": "Great"},
        {"question": "What rhymes with 'dream'?", "options": ["Sleep", "Team", "Hope", "Night"], "answer": "Team"},
      ],
      "Plurals": [
        {"question": "What is the plural of 'child'?", "options": ["Childs", "Children", "Childes", "Childish"], "answer": "Children"},
        {"question": "What is the plural of 'mouse'?", "options": ["Mouses", "Mice", "Mooses", "Mouse"], "answer": "Mice"},
        {"question": "What is the plural of 'leaf'?", "options": ["Leafs", "Leaves", "Leafes", "Leaf"], "answer": "Leaves"},
      ]
    },
    "VI-X": {
      "Synonyms": [
        {"question": "What word means the same as 'meticulous'?", "options": ["Careless", "Careful", "Quick", "Lazy"], "answer": "Careful"},
        {"question": "What word means the same as 'ubiquitous'?", "options": ["Rare", "Everywhere", "Hidden", "Unique"], "answer": "Everywhere"},
        {"question": "What word means the same as 'exemplary'?", "options": ["Poor", "Outstanding", "Average", "Weak"], "answer": "Outstanding"},
      ],
      "Antonyms": [
        {"question": "What is the opposite of 'abundant'?", "options": ["Plentiful", "Scarce", "Many", "Rich"], "answer": "Scarce"},
        {"question": "What is the opposite of 'eloquent'?", "options": ["Articulate", "Inarticulate", "Fluent", "Expressive"], "answer": "Inarticulate"},
        {"question": "What is the opposite of 'ephemeral'?", "options": ["Temporary", "Permanent", "Brief", "Fleeting"], "answer": "Permanent"},
      ],
      "Homonyms": [
        {"question": "Which word sounds like 'complement'?", "options": ["Complete", "Compliment", "Complex", "Compose"], "answer": "Compliment"},
        {"question": "Which word sounds like 'principal'?", "options": ["Principle", "Primary", "Private", "Price"], "answer": "Principle"},
        {"question": "Which word sounds like 'stationary'?", "options": ["Standing", "Stationery", "Station", "Static"], "answer": "Stationery"},
      ],
      "Rhymes": [
        {"question": "What rhymes with 'education'?", "options": ["Learning", "Nation", "School", "Study"], "answer": "Nation"},
        {"question": "What rhymes with 'inspiration'?", "options": ["Motivation", "Creation", "Thinking", "Ideas"], "answer": "Creation"},
        {"question": "What rhymes with 'determination'?", "options": ["Will", "Dedication", "Strong", "Focus"], "answer": "Dedication"},
      ],
      "Plurals": [
        {"question": "What is the plural of 'analysis'?", "options": ["Analysises", "Analyses", "Analysis", "Analyzers"], "answer": "Analyses"},
        {"question": "What is the plural of 'phenomenon'?", "options": ["Phenomenons", "Phenomena", "Phenomenas", "Phenomenon"], "answer": "Phenomena"},
        {"question": "What is the plural of 'criterion'?", "options": ["Criterions", "Criteria", "Criterias", "Criterion"], "answer": "Criteria"},
      ]
    }
  };
*/

  const categories = {
    'S': { name: 'Synonyms', icon: '🔗', color: 'from-purple-400 to-pink-400' },
    'H': { name: 'Homonyms', icon: '🔊', color: 'from-blue-400 to-cyan-400' },
    'A': { name: 'Antonyms', icon: '⚡', color: 'from-orange-400 to-red-400' },
    'R': { name: 'Rhymes', icon: '🎵', color: 'from-green-400 to-emerald-400' },
    'P': { name: 'Plurals', icon: '📚', color: 'from-indigo-400 to-purple-400' }
  };

  const classGroups = ['I-II', 'III-V', 'VI-X'];

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && currentScreen === 'game') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      handleAnswer('');
    }
  }, [timeLeft, gameStarted, currentScreen]);

  const startGame = () => {
    if (!selectedClass || !selectedCategory) return;
    setCurrentScreen('game');
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setStreak(0);
    setTimeLeft(30);
    setShowFeedback(false);
  };

  const handleAnswer = (answer) => {
    const currentData = gameData[selectedClass][categories[selectedCategory].name];
    const correct = currentData[currentQuestion].answer;
    const isCorrect = answer === correct;
    
    setLastAnswer(isCorrect ? 'correct' : 'incorrect');
    setShowFeedback(true);
    
    const newAnswers = [...answers, { question: currentQuestion, answer, correct: isCorrect }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      const points = timeLeft > 20 ? 100 : timeLeft > 10 ? 75 : 50;
      setScore(score + points);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setStars(stars + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < currentData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(30);
      } else {
        endGame();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameStarted(false);
    setCurrentScreen('summary');
    const correctAnswers = answers.filter(a => a.correct).length;
    const totalQuestions = answers.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    if (percentage >= 80) setLevel(Math.min(level + 1, 10));
  };

  const resetGame = () => {
    setCurrentScreen('home');
    setSelectedClass('');
    setSelectedCategory('');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
    setGameStarted(false);
    setStreak(0);
    setShowFeedback(false);
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <Star className="text-white opacity-20" size={Math.random() * 20 + 10} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 animate-pulse">
            SHARP
          </h1>
          <div className="text-4xl font-light text-white mb-2">Stylish Star</div>
          <div className="text-lg text-purple-200">Educational Word Game Challenge</div>
        </div>

        {/* Stats Display */}
        <div className="flex gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Trophy className="mx-auto mb-2 text-yellow-400" size={32} />
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-purple-200 text-sm">Total Score</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Star className="mx-auto mb-2 text-yellow-400" size={32} />
            <div className="text-2xl font-bold text-white">{stars}</div>
            <div className="text-purple-200 text-sm">Stars Earned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Target className="mx-auto mb-2 text-green-400" size={32} />
            <div className="text-2xl font-bold text-white">{level}</div>
            <div className="text-purple-200 text-sm">Current Level</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center border border-white/20">
            <Zap className="mx-auto mb-2 text-orange-400" size={32} />
            <div className="text-2xl font-bold text-white">{maxStreak}</div>
            <div className="text-purple-200 text-sm">Best Streak</div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Select Your Class Group</h2>
          <div className="flex gap-4">
            {classGroups.map((classGroup) => (
              <button
                key={classGroup}
                onClick={() => setSelectedClass(classGroup)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedClass === classGroup
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg shadow-yellow-400/50'
                    : 'bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                <Users className="inline mr-2" size={20} />
                Class {classGroup}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        {selectedClass && (
          <div className="mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose SHARP Category</h2>
            <div className="flex gap-4 flex-wrap justify-center">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white/10 backdrop-blur-lg text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <span className="text-2xl mr-2">{category.icon}</span>
                  <div>
                    <div className="font-bold">{key}</div>
                    <div className="text-sm opacity-80">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        {selectedClass && selectedCategory && (
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-4 px-12 rounded-xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-400/50 animate-bounce"
          >
            <Zap className="inline mr-2" size={24} />
            Start Game!
            <ArrowRight className="inline ml-2" size={24} />
          </button>
        )}
      </div>
    </div>
  );

  const GameScreen = () => {
    const currentData = gameData[selectedClass][categories[selectedCategory].name];
    const question = currentData[currentQuestion];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <button onClick={resetGame} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Home className="text-white" size={20} />
              </button>
              <div className="text-white font-bold text-lg">
                Class {selectedClass} • {categories[selectedCategory].name}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-white">
                <Clock className="inline mr-1" size={16} />
                {timeLeft}s
              </div>
              <div className="text-white">
                <Target className="inline mr-1" size={16} />
                {currentQuestion + 1}/{currentData.length}
              </div>
              <div className="text-white">
                <Trophy className="inline mr-1" size={16} />
                {score}
              </div>
              <div className="text-white">
                <Zap className="inline mr-1" size={16} />
                Streak: {streak}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mb-8">
            <div className="bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / currentData.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{categories[selectedCategory].icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{question.question}</h2>
              <div className="text-purple-200">Choose the correct answer</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Timer Bar */}
            <div className="mt-6">
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${timeLeft > 15 ? 'bg-green-400' : timeLeft > 5 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl backdrop-blur-lg ${lastAnswer === 'correct' ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'} border`}>
              <div className="flex items-center justify-center text-white">
                {lastAnswer === 'correct' ? (
                  <>
                    <CheckCircle className="mr-2 text-green-400" size={24} />
                    <span className="font-bold">Correct! +{timeLeft > 20 ? 100 : timeLeft > 10 ? 75 : 50} points</span>
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 text-red-400" size={24} />
                    <span className="font-bold">Incorrect! The answer was: {question.answer}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SummaryScreen = () => {
    const correctAnswers = answers.filter(a => a.correct).length;
    const totalQuestions = answers.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const currentData = gameData[selectedClass][categories[selectedCategory].name];

    const getGrade = () => {
      if (percentage >= 90) return { grade: 'A+', color: 'text-green-400', message: 'Outstanding!' };
      if (percentage >= 80) return { grade: 'A', color: 'text-green-400', message: 'Excellent!' };
      if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', message: 'Good Job!' };
      if (percentage >= 60) return { grade: 'C', color: 'text-yellow-400', message: 'Keep Trying!' };
      return { grade: 'D', color: 'text-red-400', message: 'Practice More!' };
    };

    const gradeInfo = getGrade();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        {/* Celebration Animation */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Star className="text-yellow-400 opacity-60" size={Math.random() * 15 + 10} />
            </div>
          ))}
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4">
                Game Complete!
              </h1>
              <div className="text-xl text-purple-200">
                Class {selectedClass} • {categories[selectedCategory].name}
              </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <Trophy className="mx-auto mb-4 text-yellow-400" size={48} />
                <div className="text-3xl font-bold text-white mb-2">{score}</div>
                <div className="text-purple-200">Final Score</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <div className={`text-6xl font-bold mb-2 ${gradeInfo.color}`}>{gradeInfo.grade}</div>
                <div className="text-white text-xl mb-1">{percentage}%</div>
                <div className="text-purple-200">{gradeInfo.message}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
                <Zap className="mx-auto mb-4 text-orange-400" size={48} />
                <div className="text-3xl font-bold text-white mb-2">{maxStreak}</div>
                <div className="text-purple-200">Best Streak</div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <CheckCircle className="mx-auto mb-2 text-green-400" size={24} />
                <div className="text-xl font-bold text-white">{correctAnswers}</div>
                <div className="text-purple-200 text-sm">Correct</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <XCircle className="mx-auto mb-2 text-red-400" size={24} />
                <div className="text-xl font-bold text-white">{totalQuestions - correctAnswers}</div>
                <div className="text-purple-200 text-sm">Incorrect</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <Star className="mx-auto mb-2 text-yellow-400" size={24} />
                <div className="text-xl font-bold text-white">{correctAnswers}</div>
                <div className="text-purple-200 text-sm">Stars Earned</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10">
                <Target className="mx-auto mb-2 text-blue-400" size={24} />
                <div className="text-xl font-bold text-white">{level}</div>
                <div className="text-purple-200 text-sm">New Level</div>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Question Review</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {answers.map((answer, index) => (
                  <div key={index} className={`p-3 rounded-lg ${answer.correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Q{index + 1}: {currentData[answer.question].question}</span>
                      {answer.correct ? (
                        <CheckCircle className="text-green-400" size={20} />
                      ) : (
                        <XCircle className="text-red-400" size={20} />
                      )}
                    </div>
                    {!answer.correct && (
                      <div className="text-purple-200 text-sm mt-1">
                        Your answer: {answer.answer} | Correct: {currentData[answer.question].answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setCurrentScreen('home');
                  setSelectedCategory('');
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RotateCcw className="inline mr-2" size={20} />
                Try Another Category
              </button>
              
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Zap className="inline mr-2" size={20} />
                Play Again
              </button>
              
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Home className="inline mr-2" size={20} />
                Main Menu
              </button>
            </div>

            {/* Achievement Badges */}
            {percentage >= 80 && (
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-2 px-6 rounded-full inline-flex items-center animate-pulse">
                  <Award className="mr-2" size={20} />
                  Achievement Unlocked: {percentage >= 95 ? 'Perfect Master' : percentage >= 90 ? 'Excellence Award' : 'Great Performer'}!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add custom CSS for animations
  const customStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
    
    .glassmorphism {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `;

  return (
    <div className="font-sans">
      <style>{customStyles}</style>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'game' && <GameScreen />}
      {currentScreen === 'summary' && <SummaryScreen />}
    </div>
  );
};

export default SHARPStylishStarGame;