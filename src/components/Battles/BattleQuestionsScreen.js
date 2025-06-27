import React, { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { FaTrophy, FaUsers, FaClock, FaStar, FaFire, FaBolt } from "react-icons/fa";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
const PLAYER_EMOJIS = ["🚀", "⚡", "🔥", "💎", "🌟", "🎯"];

export default function BattleQuestionsScreen({ battle, joinedPlayer }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [questionTime, setQuestionTime] = useState(15);
  const [matchTime, setMatchTime] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  const [localScores, setLocalScores] = useState({});
  const [battleData, setBattleData] = useState(battle);
  const [players, setPlayers] = useState(battle.players || []);
  const [streak, setStreak] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState({});
  const [completedPlayers, setCompletedPlayers] = useState([]);

  // Match timer
  useEffect(() => {
    if (showResult || showWaiting) return;
    
    const initialTime = battle?.timeLimit || 600;
    setMatchTime(initialTime);
    
    const timer = setInterval(() => {
      setMatchTime(prev => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          updateDoc(doc(firestore, "battles", battle.id), { status: "ended" });
          clearInterval(timer);
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showResult, showWaiting]);

  // Firestore listener
  useEffect(() => {
    if (!battle?.id) return;
    
    const unsubscribe = onSnapshot(doc(firestore, "battles", battle.id), (doc) => {
      if (!doc.exists()) return;
      
      const data = doc.data();
      setBattleData(data);
      setPlayers(data.players || []);
      
      if (data.scores) setLocalScores(data.scores);
      if (data.playerAnswers) setPlayerAnswers(data.playerAnswers);
      
      // Check if battle ended
      if (data.status === "ended") {
        setShowResult(true);
        setShowWaiting(false);
        return;
      }
      
      // Check if all players completed
      if (data.playerAnswers) {
        const allPlayers = data.players || [];
        const completed = allPlayers.filter(player => {
          const playerAnswers = data.playerAnswers[player.name] || {};
          return Object.keys(playerAnswers).length >= (data.questions?.length || 0);
        });
        
        setCompletedPlayers(completed);
        
        if (completed.length === allPlayers.length && allPlayers.length > 0) {
          updateDoc(doc(firestore, "battles", battle.id), { status: "ended" });
        }
      }
    });
    
    return () => unsubscribe();
  }, [battle?.id]);

  // Question timer
  useEffect(() => {
    if (showResult || showWaiting || !currentQ || isAnswered) return;

    const timer = setInterval(() => {
      setQuestionTime(prev => {
        if (prev <= 1) {
          handleAnswer(null);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQIndex, showResult, showWaiting, isAnswered]);

  const questions = battleData?.questions || [];
  const currentQ = questions[currentQIndex];

  const handleAnswer = async (idx) => {
    if (isAnswered || !currentQ) return;
    
    setSelected(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswer;
    const newScore = (localScores[joinedPlayer] || 0) + (isCorrect ? 10 : 0);
    
    if (isCorrect) setStreak(prev => prev + 1);
    else setStreak(0);

    const updatedScores = { ...localScores, [joinedPlayer]: newScore };
    setLocalScores(updatedScores);

    const updatedPlayerAnswers = {
      ...playerAnswers,
      [joinedPlayer]: {
        ...playerAnswers[joinedPlayer],
        [currentQIndex]: { answer: idx, correct: isCorrect, timestamp: Date.now() }
      }
    };
    setPlayerAnswers(updatedPlayerAnswers);

    try {
      await updateDoc(doc(firestore, "battles", battle.id), {
        [`scores.${joinedPlayer}`]: newScore,
        [`playerAnswers.${joinedPlayer}.${currentQIndex}`]: {
          answer: idx,
          correct: isCorrect,
          timestamp: Date.now()
        }
      });
    } catch (error) {
      console.error("Error updating answer:", error);
    }

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setQuestionTime(15);
        setSelected(null);
        setIsAnswered(false);
      } else {
        setShowWaiting(true);
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const determineWinner = () => {
    if (!localScores || !players.length) return null;
    
    let winner = players[0];
    let highestScore = localScores[winner.name] || 0;

    players.forEach(player => {
      const playerScore = localScores[player.name] || 0;
      if (playerScore > highestScore) {
        highestScore = playerScore;
        winner = player;
      }
    });

    return { winner, highestScore };
  };

  const getStreakMessage = () => {
    if (streak >= 5) return "🔥 ON FIRE! 🔥";
    if (streak >= 3) return "⚡ STREAK! ⚡";
    if (streak >= 2) return "🌟 NICE! 🌟";
    return "";
  };

  if (!battleData || battleData.status === "waiting") {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center max-w-md mx-auto transform hover:scale-105 transition-all duration-500">
          <div className="text-8xl mb-6 animate-spin">⚡</div>
          <h2 className="text-4xl font-black text-white mb-6 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Battle Loading...
          </h2>
          <button 
            className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-10 py-4 rounded-full font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300 hover:from-violet-500 hover:to-fuchsia-500"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Battle
          </button>
        </div>
      </div>
    );
  }

  if (showWaiting) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center max-w-2xl w-full mx-auto">
          <div className="text-9xl mb-6 animate-bounce">🎯</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Great Job!
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            You've completed all questions with {localScores[joinedPlayer] || 0} points!
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="text-2xl font-bold mb-4 text-blue-800">
              Waiting for others to finish...
            </h3>
            <div className="text-lg text-blue-700">
              {completedPlayers.length} of {players.length} players completed
            </div>
            <div className="w-full bg-blue-200 rounded-full h-4 mt-4 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedPlayers.length / players.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-gray-600 mb-8">
            <FaClock className="inline mr-2 text-2xl" />
            Time remaining: {formatTime(matchTime)}
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const sortedPlayers = [...players].sort((a, b) => {
      const scoreA = localScores[a.name] || 0;
      const scoreB = localScores[b.name] || 0;
      return scoreB - scoreA;
    });

    const { winner } = determineWinner();
    const isWinner = winner?.name === joinedPlayer;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center max-w-4xl w-full mx-auto">
          <div className="mb-8">
            <div className="text-9xl mb-6 animate-bounce">
              {isWinner ? "🎉" : "🏆"}
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
                Battle Complete!
              </span>
            </h2>
            <div className="text-3xl font-bold mb-8">
              {isWinner ? (
                <span className="text-emerald-600 animate-pulse bg-emerald-100 px-6 py-3 rounded-full">🎊 YOU WON! 🎊</span>
              ) : (
                <span className="text-blue-600 bg-blue-100 px-6 py-3 rounded-full">{winner?.name} Won! 👑</span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-8 text-gray-700 flex items-center justify-center gap-3">
              <FaTrophy className="text-yellow-500 text-4xl" />
              Final Rankings
              <FaTrophy className="text-yellow-500 text-4xl" />
            </h3>
            <div className="grid gap-4 md:gap-6">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between p-6 md:p-8 rounded-3xl transform hover:scale-105 transition-all duration-500 shadow-lg ${
                    index === 0 ? 
                      "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 border-4 border-yellow-400 shadow-yellow-300/50" : 
                    index === 1 ? 
                      "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 border-4 border-gray-400 shadow-gray-300/50" :
                    index === 2 ? 
                      "bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 border-4 border-orange-400 shadow-orange-300/50" :
                      "bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 border-2 border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl md:text-3xl shadow-2xl transform hover:scale-110 transition-transform"
                        style={{ background: COLORS[index % COLORS.length] }}
                      >
                        {PLAYER_EMOJIS[index % PLAYER_EMOJIS.length]}
                      </div>
                      {index < 3 && (
                        <div className="absolute -top-3 -right-3 text-3xl md:text-4xl animate-bounce">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-xl md:text-2xl text-gray-800">{player.name}</div>
                      <div className="text-base text-gray-600">
                        {player.name === joinedPlayer && "That's you! 👋"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {localScores[player.name] || 0}
                    </div>
                    <div className="text-lg text-gray-500 font-semibold">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-110 transition-all duration-300"
              onClick={() => window.location.reload()}
            >
              🎮 Battle Again
            </button>
            <button 
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300"
              onClick={() => window.location.href = '/'}
            >
              🏠 Home Base
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 p-4 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-6 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="relative">
                <FaFire className="text-orange-400 text-4xl animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Battle Arena
              </h1>
            </div>
            <div className="flex gap-8 text-white">
              <div className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-sm opacity-80 font-semibold">Question Time</div>
                <div className={`text-2xl font-black ${questionTime <= 5 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                  <FaClock className="inline mr-2" />
                  {formatTime(questionTime)}
                </div>
              </div>
              <div className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-sm opacity-80 font-semibold">Match Time</div>
                <div className="text-2xl font-black text-white">
                  <FaBolt className="inline mr-2" />
                  {formatTime(matchTime)}
                </div>
              </div>
            </div>
          </div>

          {streak > 1 && (
            <div className="text-center mb-4">
              <div className="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-black text-xl animate-bounce shadow-2xl">
                {getStreakMessage()}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 md:p-10 mb-6">
          <div className="text-center mb-8">
            <div className="text-lg text-gray-500 mb-4 font-semibold">
              Question {currentQIndex + 1} of {questions.length}
            </div>
            <div className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 mb-6 leading-relaxed">
              {currentQ?.question}
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full transition-all duration-500 relative shadow-lg"
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6">
            {currentQ?.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={`w-full px-6 md:px-8 py-6 md:py-8 rounded-2xl border-3 text-left transition-all duration-300 transform hover:scale-[1.02] font-bold text-lg md:text-xl shadow-lg hover:shadow-2xl ${
                  selected === idx
                    ? "border-purple-500 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 shadow-purple-300/50 scale-[1.02]"
                    : "border-gray-300 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 hover:border-purple-400 hover:shadow-purple-200/50"
                } ${isAnswered ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-purple-400'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-black text-white text-xl transition-all duration-300 ${
                    selected === idx 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110' 
                      : 'bg-gradient-to-r from-indigo-400 to-purple-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1">{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}