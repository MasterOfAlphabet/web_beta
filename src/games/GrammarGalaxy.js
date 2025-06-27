import React, { useState, useEffect } from 'react';
import { 
  Rocket, Star, Zap, Shield, Target, CheckCircle, 
  XCircle, RotateCcw, Lightbulb, Trophy, Heart,
  Sparkles, Crown, Flame
} from 'lucide-react';

const spaceQuests = [
  {
    id: 1,
    planet: "Punctuation Prime",
    mission: "Repair the Communication Array",
    story: "The space station's messages are broken! Help fix them to contact Earth.",
    sentence: "Houston we have a problem",
    options: [
      { text: "Houston we have a problem", correct: false },
      { text: "Houston, we have a problem!", correct: true },
      { text: "Houston we have a problem.", correct: false },
      { text: "Houston! we have a problem", correct: false }
    ],
    explanation: "Use a comma after addressing someone directly, and an exclamation mark for urgent messages!",
    xp: 100,
    difficulty: "Rookie"
  },
  {
    id: 2,
    planet: "Question Nebula",
    mission: "Decode Alien Messages",
    story: "Strange signals from space! Are they questions or statements?",
    sentence: "Are there other life forms in this galaxy",
    options: [
      { text: "Are there other life forms in this galaxy.", correct: false },
      { text: "Are there other life forms in this galaxy?", correct: true },
      { text: "Are there other life forms in this galaxy!", correct: false },
      { text: "are there other life forms in this galaxy", correct: false }
    ],
    explanation: "Questions always end with a question mark (?), even in space communication!",
    xp: 150,
    difficulty: "Cadet"
  },
  {
    id: 3,
    planet: "Comma Constellation",
    mission: "List Space Supplies",
    story: "Prepare for the long journey by organizing your space supplies correctly.",
    sentence: "Pack oxygen tanks food supplies and navigation tools",
    options: [
      { text: "Pack oxygen tanks food supplies and navigation tools.", correct: false },
      { text: "Pack oxygen tanks, food supplies, and navigation tools.", correct: true },
      { text: "Pack oxygen tanks food supplies, and navigation tools.", correct: false },
      { text: "Pack, oxygen tanks, food supplies, and navigation tools.", correct: false }
    ],
    explanation: "Use commas to separate items in a list, including before 'and' (Oxford comma)!",
    xp: 200,
    difficulty: "Navigator"
  },
  {
    id: 4,
    planet: "Apostrophe Asteroid",
    mission: "Fix the Robot's Memory",
    story: "The ship's AI is malfunctioning! Help restore its memory files.",
    sentence: "The robots memory banks need repair",
    options: [
      { text: "The robots memory banks need repair.", correct: false },
      { text: "The robot's memory banks need repair.", correct: true },
      { text: "The robots' memory banks need repair.", correct: false },
      { text: "The robot's memory bank's need repair.", correct: false }
    ],
    explanation: "Use an apostrophe + s ('s) to show that something belongs to someone or something!",
    xp: 250,
    difficulty: "Commander"
  }
];

const GrammarGalaxy = () => {
  const [currentQuest, setCurrentQuest] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameState, setGameState] = useState('playing');
  const [showHint, setShowHint] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    rank: "Space Cadet",
    xp: 0,
    lives: 3,
    streak: 0,
    planetsVisited: 0
  });
  const [particles, setParticles] = useState([]);

  const quest = spaceQuests[currentQuest];

  const createParticles = (type) => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: type,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleOptionSelect = (optionIndex) => {
    if (gameState !== 'playing') return;
    setSelectedOption(optionIndex);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = quest.options[selectedOption].correct;
    
    if (isCorrect) {
      setGameState('correct');
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + quest.xp,
        streak: prev.streak + 1,
        planetsVisited: prev.planetsVisited + 1
      }));
      createParticles('success');
    } else {
      setGameState('incorrect');
      setPlayerStats(prev => ({
        ...prev,
        lives: Math.max(0, prev.lives - 1),
        streak: 0
      }));
      createParticles('failure');
    }
  };

  const nextQuest = () => {
    if (currentQuest < spaceQuests.length - 1) {
      setCurrentQuest(prev => prev + 1);
      setSelectedOption(null);
      setGameState('playing');
      setShowHint(false);
    } else {
      setGameState('complete');
    }
  };

  const resetQuest = () => {
    setSelectedOption(null);
    setGameState('playing');
    setShowHint(false);
  };

  const getRankFromXP = (xp) => {
    if (xp >= 1000) return "Galaxy Commander";
    if (xp >= 700) return "Star Navigator";
    if (xp >= 400) return "Space Pilot";
    if (xp >= 200) return "Cosmic Cadet";
    return "Space Rookie";
  };

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 text-center max-w-2xl border border-yellow-500/30 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            MISSION ACCOMPLISHED!
          </h1>
          <p className="text-2xl text-cyan-300 mb-2">Welcome to the Grammar Galaxy Hall of Fame!</p>
          <p className="text-lg text-gray-300 mb-6">You've mastered the art of space communication!</p>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{getRankFromXP(playerStats.xp)}</div>
                <div className="text-sm text-gray-400">Final Rank</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{playerStats.xp}</div>
                <div className="text-sm text-gray-400">Total XP</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-full
              shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:rotate-1"
          >
            <Rocket className="inline-block w-6 h-6 mr-2" />
            Launch New Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black p-4 relative overflow-hidden">
      {/* Animated star field */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Particle effects */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-4 h-4 pointer-events-none animate-ping z-50 ${
            particle.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        >
          {particle.type === 'success' ? <Star /> : <Zap />}
        </div>
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-gray-900/40 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-cyan-500/30">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                <span className="text-cyan-300 font-bold">{getRankFromXP(playerStats.xp)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300">{playerStats.xp} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 ${i < playerStats.lives ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              {playerStats.streak > 0 && (
                <div className="flex items-center space-x-1 bg-orange-500/20 px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-300 text-sm font-bold">{playerStats.streak}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-300">
              Planet {currentQuest + 1} of {spaceQuests.length}
            </div>
          </div>
        </div>

        {/* Mission briefing */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-cyan-400/30">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full px-2 py-1 text-xs font-bold text-white">
                  {quest.difficulty}
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-cyan-300 mb-2">{quest.planet}</h1>
            <h2 className="text-xl text-yellow-300 mb-4">{quest.mission}</h2>
            <p className="text-gray-300 text-lg">{quest.story}</p>
          </div>

          {/* Sentence to fix */}
          <div className="bg-gray-900/50 rounded-2xl p-6 mb-6 border-2 border-dashed border-red-400/50">
            <div className="text-center">
              <div className="text-sm text-red-400 mb-2 font-semibold">⚠️ BROKEN TRANSMISSION ⚠️</div>
              <div className="text-2xl text-red-300 font-mono italic">"{quest.sentence}"</div>
            </div>
          </div>

          {/* Answer options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-cyan-300 text-center mb-4">
              Select the correct transmission:
            </h3>
            {quest.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={gameState !== 'playing'}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden
                  ${selectedOption === index
                    ? gameState === 'correct' && option.correct
                      ? 'border-green-500 bg-green-500/20 text-green-300'
                      : gameState === 'incorrect' && !option.correct
                      ? 'border-red-500 bg-red-500/20 text-red-300 animate-pulse'
                      : 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    : gameState === 'incorrect' && option.correct
                    ? 'border-green-500 bg-green-500/10 text-green-300'
                    : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-cyan-400 hover:bg-cyan-500/10'
                  }
                  ${gameState !== 'playing' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-[1.02]'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold
                    ${selectedOption === index ? 'border-current bg-current/20' : 'border-gray-500'}
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg font-mono">"{option.text}"</span>
                </div>
                {selectedOption === index && gameState === 'correct' && option.correct && (
                  <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-400" />
                )}
                {selectedOption === index && gameState === 'incorrect' && !option.correct && (
                  <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-400" />
                )}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={checkAnswer}
              disabled={selectedOption === null || gameState !== 'playing'}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2
                ${selectedOption === null || gameState !== 'playing'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              <Target className="w-5 h-5" />
              <span>Send Transmission</span>
            </button>
            
            <button
              onClick={resetQuest}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>{showHint ? 'Hide' : 'Show'} Hint</span>
            </button>
          </div>

          {/* Game state feedback */}
          {gameState === 'correct' && (
            <div className="text-center mb-6 animate-fade-in">
              <div className="bg-green-600/20 border border-green-500 rounded-2xl p-6 backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">Transmission Successful! 🚀</h3>
                <p className="text-green-200 mb-4">+{quest.xp} XP earned!</p>
                <button
                  onClick={nextQuest}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full
                    shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Next Planet</span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'incorrect' && (
            <div className="text-center mb-6 animate-shake">
              <div className="bg-red-600/20 border border-red-500 rounded-2xl p-6 backdrop-blur-sm">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-red-300 mb-2">Transmission Failed! 📡</h3>
                <p className="text-red-200">Check your grammar and try again, space cadet!</p>
              </div>
            </div>
          )}

          {/* Hint panel */}
          {showHint && (
            <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-2xl p-6 backdrop-blur-sm animate-fade-in">
              <h4 className="text-lg font-bold text-indigo-300 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Mission Intel
              </h4>
              <p className="text-indigo-200">
                <span className="font-semibold">Grammar Rule:</span> {quest.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default GrammarGalaxy;