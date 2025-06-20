import React, { useState, useEffect } from 'react';
import { Star, Zap, Shield, Target, Trophy, Book, Sparkles } from 'lucide-react';

const SuperHeroReadingAcademy = () => {
  const [gameState, setGameState] = useState('menu');
  const [currentMission, setCurrentMission] = useState(0);
  const [score, setScore] = useState(0);
  const [powers, setPowers] = useState([]);
  const [showTransformation, setShowTransformation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [heroLevel, setHeroLevel] = useState(1);
  const [heroName, setHeroName] = useState('');

  const missions = [
    {
      id: 1,
      title: "The Mystery of the Missing Books",
      passage: "Captain Knowledge rushed into the library to find all the adventure books had vanished! The librarian explained that the Shadow Reader had stolen them to prevent children from experiencing exciting stories. 'We must get them back,' declared Captain Knowledge, 'or children everywhere will lose their love of reading!'",
      question: "Why did the Shadow Reader steal the books?",
      options: [
        "To sell them for money",
        "To prevent children from enjoying stories",
        "To read them all himself",
        "To hide them from the librarian"
      ],
      correct: 1,
      villain: "Shadow Reader",
      power: "Speed Reading"
    },
    {
      id: 2,
      title: "The Puzzle of the Backwards Words",
      passage: "Word Wizard discovered that Confusion Master had cast a spell making all the words in the city appear backwards! Signs read 'potS' instead of 'Stop' and 'loohcS' instead of 'School'. Children couldn't read directions to get home safely. Word Wizard knew she had to reverse the spell by solving three word puzzles before sunset.",
      question: "What problem did the backwards spell create?",
      options: [
        "People couldn't tell time",
        "Children couldn't find their way home",
        "Books became invisible",
        "Everyone forgot how to write"
      ],
      correct: 1,
      villain: "Confusion Master",
      power: "Word Vision"
    },
    {
      id: 3,
      title: "The Case of the Sleepy Students",
      passage: "Professor Page-Turner noticed that students were falling asleep during story time. The villain Boredom Beast had cast a drowsiness spell over the school, making every book seem dull and uninteresting. To break the spell, Professor Page-Turner had to find the most exciting story in the school library and read it aloud with incredible enthusiasm and expression.",
      question: "How could Professor Page-Turner break the spell?",
      options: [
        "By writing a new book",
        "By reading excitingly and with expression",
        "By closing all the books",
        "By singing instead of reading"
      ],
      correct: 1,
      villain: "Boredom Beast",
      power: "Story Magic"
    }
  ];

  const superheroPowers = [
    { name: "Speed Reading", icon: "⚡", description: "Read faster than lightning!" },
    { name: "Word Vision", icon: "👁️", description: "See through confusing words!" },
    { name: "Story Magic", icon: "✨", description: "Bring stories to life!" },
    { name: "Knowledge Shield", icon: "🛡️", description: "Protected by wisdom!" },
    { name: "Comprehension Blast", icon: "💥", description: "Understand anything instantly!" }
  ];

  const heroLevels = [
    { level: 1, title: "Reading Rookie", color: "from-blue-400 to-blue-600" },
    { level: 2, title: "Story Sleuth", color: "from-green-400 to-green-600" },
    { level: 3, title: "Word Warrior", color: "from-purple-400 to-purple-600" },
    { level: 4, title: "Literature Legend", color: "from-yellow-400 to-yellow-600" },
    { level: 5, title: "Reading Master", color: "from-red-400 to-red-600" }
  ];

  const startGame = () => {
    if (heroName.trim()) {
      setGameState('playing');
      setCurrentMission(0);
    }
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const mission = missions[currentMission];
    const isCorrect = answerIndex === mission.correct;
    
    if (isCorrect) {
      setScore(score + 100);
      const newPower = mission.power;
      if (!powers.includes(newPower)) {
        setPowers([...powers, newPower]);
        setShowTransformation(true);
        setTimeout(() => setShowTransformation(false), 3000);
      }
      
      // Level up based on score
      const newLevel = Math.min(5, Math.floor(score / 200) + 1);
      if (newLevel > heroLevel) {
        setHeroLevel(newLevel);
      }
    }
  };

  const nextMission = () => {
    if (currentMission < missions.length - 1) {
      setCurrentMission(currentMission + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameState('complete');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentMission(0);
    setScore(0);
    setPowers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setHeroLevel(1);
    setHeroName('');
  };

  const getCurrentHero = () => heroLevels.find(h => h.level === heroLevel);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 animate-pulse">
            <div className="text-8xl mb-4">🦸‍♂️</div>
            <h1 className="text-6xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
              READING SUPERHERO ACADEMY
            </h1>
            <p className="text-xl text-white mb-8">
              Train to become the ultimate reading superhero! Complete missions, defeat villains, and unlock amazing powers!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Create Your Hero</h2>
            <input
              type="text"
              placeholder="Enter your superhero name..."
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              className="w-full p-3 rounded-lg text-lg font-semibold text-center bg-white/20 text-white placeholder-gray-300 border-2 border-yellow-400/50 focus:border-yellow-400 focus:outline-none"
            />
          </div>
          
          <button 
            onClick={startGame}
            disabled={!heroName.trim()}
            className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Zap className="inline mr-2" />
            START TRAINING
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 animate-bounce">
            <div className="text-8xl mb-4">🏆</div>
            <h1 className="text-5xl font-bold text-white mb-4">MISSION COMPLETE!</h1>
            <p className="text-2xl text-white mb-4">Congratulations, {heroName}!</p>
            <p className="text-xl text-white/90">You've become a true Reading Superhero!</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 mb-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{score}</div>
                <div className="text-white/80">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{powers.length}</div>
                <div className="text-white/80">Powers Unlocked</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3">Your Superpowers:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {powers.map((power, index) => (
                  <span key={index} className="bg-white/30 px-3 py-1 rounded-full text-white font-semibold">
                    {power}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={resetGame}
            className="px-8 py-3 bg-white text-purple-600 font-bold text-lg rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            TRAIN AGAIN
          </button>
        </div>
      </div>
    );
  }

  const mission = missions[currentMission];
  const currentHero = getCurrentHero();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 p-4">
      {/* Transformation Animation */}
      {showTransformation && (
        <div className="fixed inset-0 bg-yellow-400/90 z-50 flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="text-9xl mb-4 animate-spin">⚡</div>
            <h2 className="text-4xl font-bold text-white mb-2">POWER UNLOCKED!</h2>
            <p className="text-2xl text-white">{mission.power}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentHero.color} flex items-center justify-center text-2xl font-bold text-white`}>
                {heroName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{heroName}</h2>
                <p className="text-yellow-400">{currentHero.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{score}</div>
                <div className="text-white/80 text-sm">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{powers.length}</div>
                <div className="text-white/80 text-sm">Powers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-yellow-400">{mission.title}</h1>
            <div className="text-6xl animate-pulse">🦹‍♂️</div>
          </div>
          
          <div className="bg-white/20 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <Book className="text-yellow-400 mt-1 flex-shrink-0" size={24} />
              <p className="text-lg text-white leading-relaxed">{mission.passage}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="mr-2 text-red-400" />
              Mission Question:
            </h3>
            <p className="text-lg text-yellow-400 font-semibold">{mission.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {mission.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`p-4 rounded-lg text-left transition-all duration-200 font-semibold ${
                  showResult
                    ? index === mission.correct
                      ? 'bg-green-500 text-white'
                      : selectedAnswer === index
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-white/60'
                    : selectedAnswer === index
                    ? 'bg-yellow-400 text-purple-900 scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                }`}
              >
                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="text-center">
              {selectedAnswer === mission.correct ? (
                <div className="mb-4">
                  <div className="text-6xl mb-2">🎉</div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">EXCELLENT WORK!</h3>
                  <p className="text-white mb-4">You defeated the {mission.villain}!</p>
                  {!powers.includes(mission.power) && (
                    <p className="text-yellow-400 font-semibold">You unlocked: {mission.power}!</p>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <div className="text-6xl mb-2">💪</div>
                  <h3 className="text-xl font-bold text-orange-400 mb-2">Keep Training!</h3>
                  <p className="text-white">The {mission.villain} escaped this time, but you're getting stronger!</p>
                </div>
              )}
              
              <button
                onClick={nextMission}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                {currentMission < missions.length - 1 ? 'NEXT MISSION' : 'COMPLETE TRAINING'}
                <Sparkles className="inline ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Powers Display */}
        {powers.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
              <Star className="mr-2" />
              Your Superpowers:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {powers.map((power, index) => {
                const powerData = superheroPowers.find(p => p.name === power);
                return (
                  <div key={index} className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-1">{powerData?.icon}</div>
                    <div className="text-white font-semibold text-sm">{power}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperHeroReadingAcademy;