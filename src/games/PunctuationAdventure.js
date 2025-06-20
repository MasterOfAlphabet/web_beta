import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Heart, Star, Zap, Crown, Shield, Wand2, 
  CheckCircle, XCircle, RotateCcw, Lightbulb, 
  ChevronRight, Trophy, Target, Flame
} from "lucide-react";

// Enhanced adventure-themed punctuation cases
const questData = [
  {
    id: 'q1',
    title: "The Missing Magic Spell",
    story: "A wizard's spell is incomplete! Help restore the magic words.",
    sentence: ["Abracadabra", "[SLOT]", "make the rabbit appear", "[SLOT]"],
    correctSequence: ["!", "!"],
    hint: "Magic spells need excitement marks to work properly!",
    explanation: "Exclamation marks (!) show strong emotion and excitement, perfect for magical spells!",
    fullSentence: "Abracadabra! Make the rabbit appear!",
    difficulty: "easy",
    xp: 10,
    background: "from-purple-900 to-indigo-900"
  },
  {
    id: 'q2',
    title: "The Friendly Dragon's Question",
    story: "A curious dragon wants to know something important!",
    sentence: ["Hello little knight", "[SLOT]", "are you here to be my friend", "[SLOT]"],
    correctSequence: [",", "?"],
    hint: "Dragons are polite! They greet first, then ask questions.",
    explanation: "Use a comma (,) after greetings and a question mark (?) for questions!",
    fullSentence: "Hello little knight, are you here to be my friend?",
    difficulty: "easy",
    xp: 15,
    background: "from-green-900 to-emerald-900"
  },
  {
    id: 'q3',
    title: "The Treasure Hunter's List",
    story: "Our hero found amazing treasures in the ancient cave!",
    sentence: ["I discovered gold coins", "[SLOT]", "sparkling gems", "[SLOT]", "and a magic sword", "[SLOT]"],
    correctSequence: [",", ",", "!"],
    hint: "Separate the treasures with commas, and end with excitement!",
    explanation: "Use commas (,) to separate items in a list, and exclamation marks (!) for excitement!",
    fullSentence: "I discovered gold coins, sparkling gems, and a magic sword!",
    difficulty: "medium",
    xp: 20,
    background: "from-amber-900 to-orange-900"
  },
  {
    id: 'q4',
    title: "The Royal Announcement",
    story: "The king has important news for the kingdom!",
    sentence: ["Hear ye", "[SLOT]", "hear ye", "[SLOT]", "the princess has returned safely", "[SLOT]"],
    correctSequence: ["!", "!", "!"],
    hint: "Royal announcements are always exciting and important!",
    explanation: "Exclamation marks (!) show the excitement and importance of royal proclamations!",
    fullSentence: "Hear ye! Hear ye! The princess has returned safely!",
    difficulty: "medium",
    xp: 25,
    background: "from-red-900 to-pink-900"
  },
  {
    id: 'q5',
    title: "The Wise Owl's Wisdom",
    story: "The forest's wisest owl shares ancient knowledge.",
    sentence: ["The ancient tree", "[SLOT]", "over 500 years old", "[SLOT]", "holds many secrets", "[SLOT]"],
    correctSequence: [",", ",", "."],
    hint: "Extra information about the tree needs to be set apart, and wisdom ends calmly.",
    explanation: "Commas (,) set off extra information, and periods (.) end statements of fact.",
    fullSentence: "The ancient tree, over 500 years old, holds many secrets.",
    difficulty: "hard",
    xp: 30,
    background: "from-teal-900 to-cyan-900"
  },
  {
    id: 'q6',
    title: "The Pirate's Discovery",
    story: "Captain Blackbeard found something incredible on the island!",
    sentence: ["Ahoy mateys", "[SLOT]", "I found the legendary treasure", "[SLOT]"],
    correctSequence: ["!", "!"],
    hint: "Pirates are always excited about their adventures and discoveries!",
    explanation: "Exclamation marks (!) show the pirate's excitement about greeting his crew and finding treasure!",
    fullSentence: "Ahoy mateys! I found the legendary treasure!",
    difficulty: "easy",
    xp: 15,
    background: "from-blue-900 to-indigo-900"
  },
  {
    id: 'q7',
    title: "The Mysterious Castle",
    story: "Two brave knights approach an enchanted castle.",
    sentence: ["Is this the haunted castle", "[SLOT]", "asked Sir Brave", "[SLOT]"],
    correctSequence: ["?", "."],
    hint: "One knight asks a question, and we need to show who spoke.",
    explanation: "Question marks (?) end questions, and periods (.) end statements about who said something.",
    fullSentence: "Is this the haunted castle? asked Sir Brave.",
    difficulty: "medium",
    xp: 20,
    background: "from-gray-900 to-slate-900"
  },
  {
    id: 'q8',
    title: "The Fairy's Garden",
    story: "A magical fairy tends to her enchanted garden.",
    sentence: ["The flowers bloomed beautifully", "[SLOT]", "and the butterflies danced around them", "[SLOT]"],
    correctSequence: [",", "."],
    hint: "Two magical things happen - connect them with a comma before 'and'.",
    explanation: "Use a comma (,) before 'and' when connecting two complete thoughts, and a period (.) to end the sentence.",
    fullSentence: "The flowers bloomed beautifully, and the butterflies danced around them.",
    difficulty: "medium",
    xp: 25,
    background: "from-pink-900 to-rose-900"
  }
];

const PunctuationAdventure = () => {
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'correct', 'incorrect', 'complete'
  const [showHint, setShowHint] = useState(false);
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    xp: 0,
    totalXP: 0,
    lives: 3,
    streak: 0,
    questsCompleted: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuest = questData[currentQuestIndex];
  const punctuationPowers = useMemo(() => [
    { symbol: ".", name: "Period Power", color: "from-blue-500 to-blue-600", glow: "shadow-blue-500/50" },
    { symbol: ",", name: "Comma Magic", color: "from-green-500 to-green-600", glow: "shadow-green-500/50" },
    { symbol: "?", name: "Question Quest", color: "from-yellow-500 to-yellow-600", glow: "shadow-yellow-500/50" },
    { symbol: "!", name: "Excitement Energy", color: "from-red-500 to-red-600", glow: "shadow-red-500/50" },
    { symbol: "'", name: "Apostrophe Aura", color: "from-purple-500 to-purple-600", glow: "shadow-purple-500/50" },
    { symbol: '"', name: "Quote Shield", color: "from-pink-500 to-pink-600", glow: "shadow-pink-500/50" }
  ], []);

  // Initialize player answer when quest changes
  useEffect(() => {
    if (currentQuest) {
      const slotsCount = currentQuest.sentence.filter(part => part === "[SLOT]").length;
      setPlayerAnswer(new Array(slotsCount).fill(''));
      setGameState('playing');
      setShowHint(false);
    }
  }, [currentQuestIndex, currentQuest]);

  // Level up system
  useEffect(() => {
    const newLevel = Math.floor(playerStats.totalXP / 100) + 1;
    if (newLevel > playerStats.level) {
      setPlayerStats(prev => ({ ...prev, level: newLevel }));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [playerStats.totalXP, playerStats.level]);

  const handlePunctuationSelect = (slotIndex, symbol) => {
    if (gameState !== 'playing') return;

    setPlayerAnswer(prev => {
      const newAnswer = [...prev];
      newAnswer[slotIndex] = symbol;
      return newAnswer;
    });
  };

  const checkAnswer = () => {
    const isCorrect = playerAnswer.every((answer, index) => 
      answer === currentQuest.correctSequence[index]
    );

    if (isCorrect) {
      setGameState('correct');
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + currentQuest.xp,
        totalXP: prev.totalXP + currentQuest.xp,
        streak: prev.streak + 1,
        questsCompleted: prev.questsCompleted + 1
      }));
    } else {
      setGameState('incorrect');
      setPlayerStats(prev => ({
        ...prev,
        lives: Math.max(0, prev.lives - 1),
        streak: 0
      }));
    }
  };

  const nextQuest = () => {
    if (currentQuestIndex < questData.length - 1) {
      setCurrentQuestIndex(prev => prev + 1);
    } else {
      setGameState('complete');
    }
  };

  const resetQuest = () => {
    const slotsCount = currentQuest.sentence.filter(part => part === "[SLOT]").length;
    setPlayerAnswer(new Array(slotsCount).fill(''));
    setGameState('playing');
    setShowHint(false);
  };

  const renderSentence = () => {
    let slotIndex = -1;
    return currentQuest.sentence.map((part, index) => {
      if (part === "[SLOT]") {
        slotIndex++;
        const currentAnswer = playerAnswer[slotIndex];
        const isCorrect = gameState === 'correct' || 
          (gameState === 'incorrect' && currentAnswer === currentQuest.correctSequence[slotIndex]);
        const isIncorrect = gameState === 'incorrect' && 
          currentAnswer !== currentQuest.correctSequence[slotIndex] && currentAnswer !== '';

        return (
          <div key={`slot-${index}`} className="relative inline-block">
            <div
              className={`w-16 h-16 rounded-xl border-4 flex items-center justify-center text-2xl font-bold
                transition-all duration-300 cursor-pointer transform hover:scale-105 mx-1
                ${isCorrect ? 'border-green-400 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/30' :
                  isIncorrect ? 'border-red-400 bg-red-500/20 text-red-300 animate-shake' :
                  'border-cyan-400 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                }`}
              onClick={() => setShowHint(true)}
            >
              {currentAnswer || (
                <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
              )}
            </div>
            {isIncorrect && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                {currentQuest.correctSequence[slotIndex]}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <span key={`text-${index}`} className="text-xl md:text-2xl text-gray-100 mx-1 font-medium">
            {part}
          </span>
        );
      }
    });
  };

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 text-center max-w-2xl border border-yellow-500/30 shadow-2xl">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl font-bold text-yellow-300 mb-4 animate-pulse">
            🎉 QUEST COMPLETE! 🎉
          </h1>
          <p className="text-2xl text-gray-100 mb-6">
            Congratulations, Punctuation Hero!
          </p>
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-cyan-300">{playerStats.level}</div>
                <div className="text-sm text-gray-300">Final Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-300">{playerStats.totalXP}</div>
                <div className="text-sm text-gray-300">Total XP</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentQuestIndex(0);
              setPlayerStats({
                level: 1,
                xp: 0,
                totalXP: 0,
                lives: 3,
                streak: 0,
                questsCompleted: 0
              });
              setGameState('playing');
            }}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full
              shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="inline-block w-5 h-5 mr-2" />
            New Adventure
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentQuest.background} p-4 transition-all duration-1000`}>
      {/* Floating celebration particles */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header with player stats */}
        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-gray-700/50">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-300 font-bold">Level {playerStats.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300">{playerStats.xp} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(3)].map((_, i) => (
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
              Quest {currentQuestIndex + 1} of {questData.length}
            </div>
          </div>
        </div>

        {/* Main quest area */}
        <div className="bg-gray-900/30 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          {/* Quest title and story */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-300 mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 mr-3 text-cyan-400" />
              {currentQuest.title}
            </h1>
            <p className="text-xl text-gray-200 italic">{currentQuest.story}</p>
          </div>

          {/* Sentence puzzle */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 border-2 border-dashed border-cyan-400/50 min-h-[120px]">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center leading-relaxed">
              {renderSentence()}
            </div>
          </div>

          {/* Punctuation powers */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center justify-center">
              <Wand2 className="w-6 h-6 mr-2 text-purple-400" />
              Choose Your Punctuation Powers
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-2xl mx-auto">
              {punctuationPowers.map((power, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const emptySlot = playerAnswer.findIndex(answer => answer === '');
                    if (emptySlot !== -1 && gameState === 'playing') {
                      handlePunctuationSelect(emptySlot, power.symbol);
                    }
                  }}
                  disabled={gameState !== 'playing'}
                  className={`group relative w-16 h-16 rounded-xl bg-gradient-to-br ${power.color} 
                    shadow-lg ${power.glow} flex items-center justify-center text-2xl font-bold text-white
                    transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95
                    ${gameState !== 'playing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {power.symbol}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100
                    bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap transition-opacity">
                    {power.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={checkAnswer}
              disabled={playerAnswer.includes('') || gameState !== 'playing'}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105
                ${playerAnswer.includes('') || gameState !== 'playing'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              <Target className="inline-block w-5 h-5 mr-2" />
              Cast Spell
            </button>
            
            <button
              onClick={resetQuest}
              disabled={playerAnswer.every(a => a === '')}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105
                ${playerAnswer.every(a => a === '')
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              <RotateCcw className="inline-block w-5 h-5 mr-2" />
              Reset Quest
            </button>

            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Lightbulb className="inline-block w-5 h-5 mr-2" />
              {showHint ? 'Hide' : 'Show'} Hint
            </button>
          </div>

          {/* Game state feedback */}
          {gameState === 'correct' && (
            <div className="text-center mb-6 animate-fade-in">
              <div className="bg-green-600/20 border border-green-500 rounded-2xl p-6 backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">Quest Complete!</h3>
                <p className="text-green-200 mb-4">+{currentQuest.xp} XP earned!</p>
                <button
                  onClick={nextQuest}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full
                    shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Next Adventure <ChevronRight className="inline-block w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {gameState === 'incorrect' && (
            <div className="text-center mb-6 animate-shake">
              <div className="bg-red-600/20 border border-red-500 rounded-2xl p-6 backdrop-blur-sm">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-red-300 mb-2">Quest Failed!</h3>
                <p className="text-red-200">Try again, brave adventurer!</p>
              </div>
            </div>
          )}

          {/* Hint panel */}
          {showHint && (
            <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-2xl p-6 backdrop-blur-sm animate-fade-in-down">
              <h4 className="text-lg font-bold text-indigo-300 mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Magical Guidance
              </h4>
              <p className="text-indigo-200 mb-3">
                <span className="font-semibold">Hint:</span> {currentQuest.hint}
              </p>
              <p className="text-indigo-200 mb-3">
                <span className="font-semibold">Rule:</span> {currentQuest.explanation}
              </p>
              <p className="text-indigo-200">
                <span className="font-semibold">Correct Answer:</span> 
                <span className="text-green-300 ml-2">{currentQuest.fullSentence}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default PunctuationAdventure;