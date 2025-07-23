import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, Eye, Brain, Trophy, Star, Zap, Globe, Camera, Lightbulb, ChevronRight, RotateCcw, Target, Flame } from 'lucide-react';

const VisualVocabularyBuilder = () => {
  const [currentLevel, setCurrentLevel] = useState('Rookie');
  const [currentClass, setCurrentClass] = useState('I-II');
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [particles, setParticles] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showMemoryTrick, setShowMemoryTrick] = useState(false);

  const levels = ['Rookie', 'Racer', 'Master', 'Prodigy', 'Wizard'];
  const classes = ['I-II', 'III-V', 'VI-X'];

  const vocabularyData = {
    'I-II': {
      'Rookie': [
        {
          word: 'BUTTERFLY',
          image: '🦋',
          definition: 'A colorful flying insect with beautiful wings',
          context: 'The butterfly danced from flower to flower.',
          options: ['Bird', 'Butterfly', 'Bee', 'Fly'],
          correct: 1,
          memory: 'Think of BUTTER flying with colorful wings!',
          color: 'from-pink-400 to-purple-500'
        },
        {
          word: 'RAINBOW',
          image: '🌈',
          definition: 'Colorful arc in the sky after rain',
          context: 'We saw a beautiful rainbow after the storm.',
          options: ['Cloud', 'Rainbow', 'Sun', 'Moon'],
          correct: 1,
          memory: 'Rain creates a BOW of colors in the sky!',
          color: 'from-blue-400 to-green-500'
        },
        {
          word: 'ELEPHANT',
          image: '🐘',
          definition: 'A very large gray animal with a long trunk',
          context: 'The elephant sprayed water with its trunk.',
          options: ['Lion', 'Tiger', 'Elephant', 'Bear'],
          correct: 2,
          memory: 'ELE-PHANT: Elegant and fantastically big!',
          color: 'from-gray-400 to-slate-600'
        }
      ],
      'Racer': [
        {
          word: 'PLAYGROUND',
          image: '🏞️',
          definition: 'A place where children play with swings and slides',
          context: 'Children love to play at the playground.',
          options: ['School', 'Playground', 'Library', 'Store'],
          correct: 1,
          memory: 'PLAY + GROUND = where play meets the ground!',
          color: 'from-green-400 to-teal-500'
        }
      ],
      'Wizard': [
        {
          word: 'FRIENDSHIP',
          image: '👫',
          definition: 'A special bond between people who care for each other',
          context: 'Their friendship grew stronger every day.',
          options: ['Friendship', 'Family', 'School', 'Game'],
          correct: 0,
          memory: 'Friends are like a SHIP that sails together through life!',
          color: 'from-yellow-400 to-orange-500'
        }
      ]
    },
    'III-V': {
      'Rookie': [
        {
          word: 'ADVENTURE',
          image: '🏔️',
          definition: 'An exciting and unusual experience or activity',
          context: 'Their mountain adventure was unforgettable.',
          options: ['Adventure', 'Homework', 'Sleep', 'Eating'],
          correct: 0,
          memory: 'AD-VENTURE: You ADD excitement when you VENTURE out!',
          color: 'from-emerald-400 to-cyan-500'
        }
      ],
      'Wizard': [
        {
          word: 'IMAGINATION',
          image: '🌟',
          definition: 'The ability to create pictures and ideas in your mind',
          context: 'Her imagination helped her write amazing stories.',
          options: ['Memory', 'Imagination', 'Knowledge', 'Skill'],
          correct: 1,
          memory: 'I-MAGIC-NATION: A nation full of magic in your mind!',
          color: 'from-purple-400 to-indigo-500'
        }
      ]
    },
    'VI-X': {
      'Rookie': [
        {
          word: 'PERSEVERANCE',
          image: '🏔️',
          definition: 'Continuing to try despite difficulties and obstacles',
          context: 'Her perseverance helped her climb the mountain.',
          options: ['Giving up', 'Perseverance', 'Laziness', 'Fear'],
          correct: 1,
          memory: 'PER-SEVERE-ANCE: Through severe challenges, you advance!',
          color: 'from-indigo-400 to-purple-600'
        }
      ],
      'Wizard': [
        {
          word: 'SERENDIPITY',
          image: '✨',
          definition: 'A pleasant surprise or fortunate accidental discovery',
          context: 'Finding that rare book was pure serendipity.',
          options: ['Planning', 'Serendipity', 'Mistake', 'Routine'],
          correct: 1,
          memory: 'SERENE-DIPITY: A serene, happy discovery that dips into your life!',
          color: 'from-rose-400 to-pink-600'
        }
      ]
    }
  };

  const getCurrentWord = () => {
    const classData = vocabularyData[currentClass];
    const levelData = classData?.[currentLevel] || classData?.['Rookie'] || [];
    return levelData[currentCard % levelData.length] || vocabularyData['I-II']['Rookie'][0];
  };

  const createSuccessParticles = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 1,
      type: Math.random() > 0.5 ? 'star' : 'circle'
    }));
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => setParticles([]), 3000);
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    const word = getCurrentWord();
    
    if (optionIndex === word.correct) {
      setScore(score + (currentLevel === 'Wizard' ? 50 : currentLevel === 'Prodigy' ? 40 : currentLevel === 'Master' ? 30 : currentLevel === 'Racer' ? 20 : 10));
      setStreak(streak + 1);
      createSuccessParticles();
      
      // Auto advance after celebration
      setTimeout(() => {
        nextCard();
      }, 2500);
    } else {
      setStreak(0);
      // Show correct answer briefly
      setTimeout(() => {
        nextCard();
      }, 2000);
    }
  };

  const nextCard = () => {
    setCurrentCard(currentCard + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowDefinition(false);
    setShowMemoryTrick(false);
  };

  const resetProgress = () => {
    setCurrentCard(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowDefinition(false);
    setShowMemoryTrick(false);
    setParticles([]);
  };

  const word = getCurrentWord();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Success Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-3 h-3 ${particle.type === 'star' ? 'rotate-45' : 'rounded-full'} bg-gradient-to-r from-yellow-300 to-orange-400 opacity-90`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `floatUp 3s ease-out forwards`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
        
        {/* Floating Background Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500 rounded-full opacity-10 blur-2xl animate-pulse" 
          style={{ animationDelay: '1s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500 rounded-full opacity-8 blur-xl animate-pulse" 
          style={{ animationDelay: '2s' }} 
        />
        
        {/* Grid Pattern */}
<div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`} />
      </div>

      {/* Header Dashboard with Glassmorphism */}
      <div className="relative z-10 mb-8">
        <div className="backdrop-blur-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Side - Selectors */}
            <div className="flex gap-4 flex-wrap">
              <div className="relative">
                <select 
                  value={currentClass} 
                  onChange={(e) => { setCurrentClass(e.target.value); resetProgress(); }}
                  className="appearance-none bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 pr-10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls} className="bg-slate-800 text-white font-semibold">Class {cls}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-white/70 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  value={currentLevel} 
                  onChange={(e) => { setCurrentLevel(e.target.value); resetProgress(); }}
                  className="appearance-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/30 rounded-2xl px-6 py-3 pr-10 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                >
                  {levels.map(level => (
                    <option key={level} value={level} className="bg-slate-800 text-white font-semibold">{level}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-white/70 pointer-events-none" />
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-yellow-300/30">
                <Trophy className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="font-black text-white text-lg">{score}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-400/20 to-red-500/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-orange-300/30">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-black text-white text-lg">{streak}</span>
              </div>

              <button 
                onClick={resetProgress}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-400/20 to-gray-500/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-300/30 hover:from-slate-400/30 hover:to-gray-500/30 transition-all duration-300 group"
              >
                <RotateCcw className="w-4 h-4 text-slate-300 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Card */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="backdrop-blur-3xl bg-gradient-to-br from-white/15 via-white/5 to-white/10 rounded-[3rem] p-10 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.01]">
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md rounded-full px-6 py-2 border border-white/30">
              <div className="flex items-center gap-3 text-white/80">
                <Target className="w-4 h-4" />
                <span className="font-semibold text-sm">Card {currentCard + 1}</span>
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                <span className="text-xs">{currentLevel} Level</span>
              </div>
            </div>
          </div>

          {/* Main Word Display */}
          <div className="text-center mb-10">
            <div className="relative inline-block group">
              <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r ${word.color} bg-clip-text text-transparent mb-6 tracking-wide hover:tracking-wider transition-all duration-500 cursor-default select-none`}>
                {word.word}
              </h1>
              
              {/* Glowing Effect */}
              <div className={`absolute -inset-6 bg-gradient-to-r ${word.color} opacity-20 blur-2xl rounded-full group-hover:opacity-30 group-hover:blur-xl transition-all duration-500 -z-10`} />
              
              {/* Letter Count Hint */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                  {word.word.split('').map((_, index) => (
                    <div key={index} className="w-2 h-1 bg-white/30 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element with 3D Effect */}
          <div className="flex justify-center mb-10">
            <div className="relative group cursor-pointer" onClick={() => setShowDefinition(!showDefinition)}>
              <div className="relative">
                <div 
                  className="text-[10rem] md:text-[14rem] hover:scale-110 transition-all duration-500 filter drop-shadow-2xl transform hover:rotate-3 select-none"
                  style={{
                    textShadow: '0 0 50px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.3)'
                  }}
                >
                  {word.image}
                </div>
                
                {/* 3D Base Shadow */}
                <div className="absolute top-6 left-6 text-[10rem] md:text-[14rem] opacity-20 blur-sm -z-10 text-black transform rotate-1">
                  {word.image}
                </div>
              </div>
              
              {/* Hover Glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${word.color} opacity-0 group-hover:opacity-30 blur-3xl transition-all duration-500 -z-10`} />
              
              {/* Click Instruction */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center gap-2 text-white/70 text-sm bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
                  <Eye className="w-4 h-4" />
                  <span>Click for definition</span>
                </div>
              </div>
            </div>
          </div>

          {/* Definition Panel */}
          {showDefinition && (
            <div className="mb-8 transform animate-in slide-in-from-bottom-4 fade-in duration-700">
              <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-400/15 via-cyan-400/10 to-teal-400/15 rounded-3xl p-8 border border-white/30 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 shadow-lg">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-3">Definition</h3>
                    <p className="text-white/90 text-lg font-medium mb-4 leading-relaxed">{word.definition}</p>
                    
                    <div className="bg-blue-400/20 rounded-2xl p-4 mb-4 border border-blue-300/30">
                      <h4 className="text-blue-200 font-semibold mb-2">Example:</h4>
                      <p className="text-blue-100 italic text-lg">"{word.context}"</p>
                    </div>
                    
                    <button 
                      onClick={() => setShowMemoryTrick(!showMemoryTrick)}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-2xl p-4 border border-purple-300/30 transition-all duration-300 w-full group"
                    >
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-purple-300 group-hover:animate-pulse" />
                        <span className="text-purple-200 font-semibold">Memory Trick</span>
                        <ChevronRight className={`w-4 h-4 text-purple-300 transition-transform duration-300 ${showMemoryTrick ? 'rotate-90' : ''}`} />
                      </div>
                      
                      {showMemoryTrick && (
                        <div className="mt-4 pt-4 border-t border-purple-300/20">
                          <p className="text-purple-100 text-left font-medium">{word.memory}</p>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {word.options.map((option, index) => {
              let buttonClass = "group relative backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 rounded-3xl p-6 text-white font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform overflow-hidden";
              let iconElement = null;
              
              if (selectedOption === index) {
                if (index === word.correct) {
                  buttonClass = "group relative bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 border-2 border-green-300 rounded-3xl p-6 text-white font-black text-xl shadow-2xl transform scale-105 animate-pulse";
                  iconElement = <Star className="w-6 h-6 animate-spin ml-2" />;
                } else {
                  buttonClass = "group relative bg-gradient-to-r from-red-400 via-pink-500 to-red-600 border-2 border-red-300 rounded-3xl p-6 text-white font-black text-xl shadow-xl transform scale-95 opacity-75";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  {/* Ripple Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  <div className="relative flex items-center justify-center">
                    <span className="relative z-10">{option}</span>
                    {iconElement}
                  </div>
                  
                  {/* Show correct answer highlight */}
                  {isAnswered && index === word.correct && selectedOption !== word.correct && (
                    <div className="absolute inset-0 bg-green-400/30 rounded-3xl border-2 border-green-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Audio & Action Buttons */}
          <div className="flex justify-center gap-4">
            <button className="group backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/30 rounded-2xl p-4 text-white transition-all duration-300 hover:scale-110 hover:shadow-xl">
              <Volume2 className="w-6 h-6 group-hover:animate-pulse" />
            </button>
            
            <button 
              onClick={() => setShowDefinition(!showDefinition)}
              className="group backdrop-blur-md bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-white/30 rounded-2xl p-4 text-white transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              <Eye className="w-6 h-6 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="backdrop-blur-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-full px-8 py-4 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-6 text-white">
            <Globe 
              className="w-5 h-5 text-blue-300 animate-spin" 
              style={{ animationDuration: '10s' }} 
            />
            <span className="font-bold text-sm bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Vocabulary Universe
            </span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes floatUp {
            0% { 
              transform: translateY(0px) scale(0) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: translateY(-100px) scale(1) rotate(180deg);
              opacity: 0.8;
            }
            100% { 
              transform: translateY(-200px) scale(0.3) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

export default VisualVocabularyBuilder;