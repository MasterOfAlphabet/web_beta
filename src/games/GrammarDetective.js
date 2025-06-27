import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Lightbulb, CheckCircle, XCircle, 
  FileText, Search as Magnifier, Trophy, Star, Clock,
  AlertTriangle, Shield, Target, RotateCcw
} from 'lucide-react';

const mysteryQuests = [
  {
    id: 1,
    title: "The Case of the Missing Comma",
    location: "Sherlock's Study",
    suspect: "Dr. Watson",
    evidence: "A hastily written note",
    mystery: "Dr. Watson left a note but something's wrong with it!",
    clue: "I went to the store bought milk bread and cheese",
    options: [
      { text: "I went to the store bought milk bread and cheese.", correct: false, feedback: "Items in a list need separation!" },
      { text: "I went to the store, bought milk, bread, and cheese.", correct: true, feedback: "Perfect! Commas separate items in a list." },
      { text: "I went to the store bought milk, bread, and cheese.", correct: false, feedback: "Missing comma after 'store'!" },
      { text: "I went to the store, bought milk bread, and cheese.", correct: false, feedback: "Missing comma between 'milk' and 'bread'!" }
    ],
    solution: "Use commas to separate items in a list and to separate clauses.",
    points: 100,
    difficulty: "Rookie Detective"
  },
  {
    id: 2,
    title: "The Mystery of the Question Mark",
    location: "The Library",
    suspect: "Miss Marple",
    evidence: "A library inquiry card",
    mystery: "Someone filled out a library card incorrectly!",
    clue: "Do you have any books about grammar",
    options: [
      { text: "Do you have any books about grammar", correct: false, feedback: "Questions need proper ending punctuation!" },
      { text: "Do you have any books about grammar?", correct: true, feedback: "Excellent! Questions end with question marks." },
      { text: "Do you have any books about grammar.", correct: false, feedback: "Periods are for statements, not questions!" },
      { text: "Do you have any books about grammar!", correct: false, feedback: "Exclamation marks show excitement, not questions!" }
    ],
    solution: "Questions must end with a question mark (?).",
    points: 150,
    difficulty: "Junior Detective"
  },
  {
    id: 3,
    title: "The Apostrophe Incident",
    location: "The Bakery",
    suspect: "Chef Pierre",
    evidence: "A menu board",
    mystery: "The bakery's menu has a grammatical error!",
    clue: "Todays special is the bakers fresh croissants",
    options: [
      { text: "Todays special is the bakers fresh croissants.", correct: false, feedback: "Missing apostrophes for possession!" },
      { text: "Today's special is the baker's fresh croissants.", correct: true, feedback: "Perfect! Apostrophes show possession." },
      { text: "Todays' special is the bakers' fresh croissants.", correct: false, feedback: "Apostrophe placement is incorrect!" },
      { text: "Today's special is the bakers fresh croissant's.", correct: false, feedback: "Don't add apostrophes to plural nouns!" }
    ],
    solution: "Use apostrophes to show possession (baker's = belonging to the baker).",
    points: 200,
    difficulty: "Senior Detective"
  },
  {
    id: 4,
    title: "The Capital Crime",
    location: "City Hall",
    suspect: "Mayor Johnson",
    evidence: "An official letter",
    mystery: "The mayor's letter has capitalization errors!",
    clue: "dear citizens of new york city, please join us on monday",
    options: [
      { text: "dear citizens of new york city, please join us on monday.", correct: false, feedback: "Many words need capitalization!" },
      { text: "Dear citizens of New York City, please join us on Monday.", correct: true, feedback: "Excellent! Proper nouns and sentence beginnings are capitalized." },
      { text: "Dear Citizens Of New York City, Please Join Us On Monday.", correct: false, feedback: "Don't capitalize every word!" },
      { text: "Dear citizens of new york city, Please join us on monday.", correct: false, feedback: "City names and days of the week need capitals!" }
    ],
    solution: "Capitalize proper nouns (names of places, days) and sentence beginnings.",
    points: 250,
    difficulty: "Master Detective"
  }
];

const GrammarDetective = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameState, setGameState] = useState('investigating'); // 'investigating', 'solved', 'failed', 'complete'
  const [showEvidence, setShowEvidence] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [detectiveStats, setDetectiveStats] = useState({
    rank: "Rookie Detective",
    points: 0,
    casessolved: 0,
    accuracy: 100,
    badge: "🔍"
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  const mystery = mysteryQuests[currentCase];

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0 && gameState === 'investigating') {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'investigating') {
      setGameState('failed');
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, gameState]);

  const getRankFromPoints = (points) => {
    if (points >= 700) return { rank: "Master Detective", badge: "🏆" };
    if (points >= 500) return { rank: "Senior Detective", badge: "⭐" };
    if (points >= 300) return { rank: "Detective", badge: "🥇" };
    if (points >= 100) return { rank: "Junior Detective", badge: "🥈" };
    return { rank: "Rookie Detective", badge: "🔍" };
  };

  const handleOptionSelect = (optionIndex) => {
    if (gameState !== 'investigating') return;
    setSelectedOption(optionIndex);
  };

  const solveCase = () => {
    if (selectedOption === null) return;
    
    setTimerActive(false);
    const isCorrect = mystery.options[selectedOption].correct;
    
    if (isCorrect) {
      setGameState('solved');
      const bonusPoints = Math.floor(timeLeft / 10) * 10; // Time bonus
      const totalPoints = mystery.points + bonusPoints;
      
      setDetectiveStats(prev => {
        const newPoints = prev.points + totalPoints;
        const newCasesolved = prev.casesolved + 1;
        const rankInfo = getRankFromPoints(newPoints);
        
        return {
          ...prev,
          points: newPoints,
          casesolved: newCasesolved,
          rank: rankInfo.rank,
          badge: rankInfo.badge
        };
      });
    } else {
      setGameState('failed');
    }
  };

  const nextCase = () => {
    if (currentCase < mysteryQuests.length - 1) {
      setCurrentCase(prev => prev + 1);
      setSelectedOption(null);
      setGameState('investigating');
      setShowEvidence(false);
      setShowSolution(false);
      setTimeLeft(60);
      setTimerActive(true);
    } else {
      setGameState('complete');
    }
  };

  const resetCase = () => {
    setSelectedOption(null);
    setGameState('investigating');
    setShowEvidence(false);
    setShowSolution(false);
    setTimeLeft(60);
    setTimerActive(true);
  };

  const startInvestigation = () => {
    setTimerActive(true);
  };

  if (gameState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-yellow-400/20 to-amber-500/20 backdrop-blur-xl rounded-3xl p-8 text-center max-w-2xl border border-yellow-500/30 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-24 h-24 text-yellow-400 animate-bounce" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 text-2xl">
                {detectiveStats.badge}
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
            CASE CLOSED!
          </h1>
          <p className="text-2xl text-amber-300 mb-2">Detective {detectiveStats.rank}</p>
          <p className="text-lg text-gray-300 mb-6">All grammar mysteries solved!</p>
          
          <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{detectiveStats.points}</div>
                <div className="text-sm text-gray-400">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{detectiveStats.casesolved}</div>
                <div className="text-sm text-gray-400">Cases Solved</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-full
              shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Search className="inline-block w-6 h-6 mr-2" />
            New Investigation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900 p-4 relative">
      {/* Detective office ambiance */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-amber-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Detective Dashboard */}
        <div className="bg-amber-900/40 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-amber-500/30 shadow-xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-amber-400" />
                <span className="text-amber-300 font-bold">{detectiveStats.rank}</span>
                <span className="text-2xl">{detectiveStats.badge}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300">{detectiveStats.points} pts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-green-300">{detectiveStats.casesolved} solved</span>
              </div>
              {timerActive && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  timeLeft <= 10 ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">{timeLeft}s</span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-300">
              Case {currentCase + 1} of {mysteryQuests.length}
            </div>
          </div>
        </div>

        {/* Case File */}
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-lg rounded-3xl p-8 border border-amber-400/30 shadow-2xl">
          {/* Case Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                  CASE
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-amber-300 mb-2">{mystery.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300 bg-gray-900/30 rounded-xl p-4">
              <div><strong>Location:</strong> {mystery.location}</div>
              <div><strong>Suspect:</strong> {mystery.suspect}</div>
              <div><strong>Evidence:</strong> {mystery.evidence}</div>
            </div>
          </div>

          {/* Mystery Description */}
          <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-300 mb-2">The Mystery</h3>
                <p className="text-gray-300">{mystery.mystery}</p>
              </div>
            </div>
          </div>

          {/* Evidence Section */}
          <div className="bg-gray-900/50 rounded-2xl p-6 mb-6 border-2 border-dashed border-yellow-400/50">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Eye className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-yellow-300">Evidence Found</h3>
              </div>
              <div className="bg-yellow-100 text-gray-900 p-4 rounded-lg font-mono text-lg border-2 border-yellow-300">
                "{mystery.clue}"
              </div>
              <div className="mt-4 text-sm text-yellow-200">
                🔍 Examine this evidence carefully for grammatical clues!
              </div>
            </div>
          </div>

          {/* Investigation Options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-amber-300 text-center mb-4 flex items-center justify-center">
              <Search className="w-6 h-6 mr-2" />
              Which correction solves the case?
            </h3>
            {mystery.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={gameState !== 'investigating'}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left relative
                  ${selectedOption === index
                    ? gameState === 'solved' && option.correct
                      ? 'border-green-500 bg-green-500/20 text-green-300'
                      : gameState === 'failed' && !option.correct
                      ? 'border-red-500 bg-red-500/20 text-red-300'
                      : 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : gameState === 'failed' && option.correct
                    ? 'border-green-500 bg-green-500/10 text-green-300'
                    : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-amber-400 hover:bg-amber-500/10'
                  }
                  ${gameState !== 'investigating' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-[1.02]'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold
                    ${selectedOption === index ? 'border-current bg-current/20' : 'border-gray-500'}
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-mono">"{option.text}"</span>
                </div>
                {(gameState === 'solved' || gameState === 'failed') && selectedOption === index && (
                  <div className="mt-2 text-sm italic">
                    💡 {option.feedback}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {!timerActive && gameState === 'investigating' && (
              <button
                onClick={startInvestigation}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-full
                  shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Start Investigation</span>
              </button>
            )}
            
            {timerActive && gameState === 'investigating' && (
              <button
                onClick={solveCase}
                disabled={selectedOption === null}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2
                  ${selectedOption === null
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
                  }`}
              >
                <Target className="w-5 h-5" />
                <span>Solve Case</span>
              </button>
            )}
            
            <button
              onClick={resetCase}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset Case</span>
            </button>

            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full
                shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>{showEvidence ? 'Hide' : 'Show'} Clue</span>
            </button>
          </div>

          {/* Game State Feedback */}
          {gameState === 'solved' && (
            <div className="text-center mb-6 animate-fade-in">
              <div className="bg-green-600/20 border border-green-500 rounded-2xl p-6 backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">Case Solved! 🕵️</h3>
                <p className="text-green-200 mb-2">+{mystery.points} points earned!</p>
                {timeLeft > 50 && <p className="text-yellow-300 text-sm">⚡ Speed bonus: +{Math.floor(timeLeft/10)*10} points!</p>}
                <button
                  onClick={nextCase}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full
                    shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <FileText className="w-5 h-5" />
                  <span>Next Case</span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'failed' && (
            <div className="text-center mb-6 animate-shake">
              <div className="bg-red-600/20 border border-red-500 rounded-2xl p-6 backdrop-blur-sm">
                <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-red-300 mb-2">Case Unsolved! 🔍</h3>
                <p className="text-red-200">The mystery remains... Try again, detective!</p>
              </div>
            </div>
          )}

          {/* Evidence Panel */}
          {showEvidence && (
            <div className="bg-indigo-900/30 border border-indigo-500/50 rounded-2xl p-6 backdrop-blur-sm animate-fade-in">
              <h4 className="text-lg font-bold text-indigo-300 mb-3 flex items-center">
                <Magnifier className="w-5 h-5 mr-2" />
                Detective's Notes
              </h4>
              <p className="text-indigo-200">
                <span className="font-semibold">Grammar Rule:</span> {mystery.solution}
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

export default GrammarDetective;