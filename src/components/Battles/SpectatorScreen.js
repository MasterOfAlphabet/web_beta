import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../services/firebase';
import { FaShare, FaUsers, FaTrophy, FaTimes, FaClock, FaCopy, FaCheck, FaEye, FaVolumeUp, FaVolumeOff, FaStar, FaChartBar, FaSearch, FaHeart, FaPlus } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
const PLAYER_EMOJIS = ["🚀", "⚡", "🔥", "💎", "🌟", "🎯"];

export default function SpectatorScreen() {
  const { battleId } = useParams();
  const [battleData, setBattleData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [localScores, setLocalScores] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showFavModal, setShowFavModal] = useState(false);
  const [favInput, setFavInput] = useState('');
  const [myFavs, setMyFavs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [spectatorCount, setSpectatorCount] = useState(12);

  // Live Firestore subscription
  useEffect(() => {
    if (!battleId) return;

    const unsub = onSnapshot(doc(firestore, "battles", battleId), (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      setBattleData(data);
      setPlayers(data.players || []);
      if (data.scores) setLocalScores(data.scores);

      // Timer: always calculate true remaining time
      let end = 0;
      if (data.startTime && data.settings?.timeLimit) {
        end = data.startTime + data.settings.timeLimit * 1000;
      } else if (data.createdAt?.toDate && data.settings?.timeLimit) {
        end = data.createdAt.toDate().getTime() + data.settings.timeLimit * 1000;
      }
      setTimeRemaining(end ? Math.max(0, Math.floor((end - Date.now()) / 1000)) : 0);
    });
    return () => unsub();
  }, [battleId]);

  // Timer tick per second (keeps timeRemaining up to date)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated activity and spectator count (remove in prod)
  useEffect(() => {
    const interval = setInterval(() => {
      setSpectatorCount(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      const activities = [
        "🎯 Player answered correctly!",
        "⚡ Someone is on fire!",
        "🔥 Great comeback move!",
        "💎 Perfect score achieved!",
        "🌟 New leader emerges!",
        "🚀 Speed bonus earned!"
      ];
      if (Math.random() > 0.7) {
        const newActivity = activities[Math.floor(Math.random() * activities.length)];
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Share logic
  const shareUrl = `${window.location.origin}/spectate/${battleId}`;
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };
  const shareSpectatorLink = () => {
    copyShareLink();
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  // Player progress, leaderboard, etc.
  const getPlayerProgress = playerName => {
    if (!battleData?.questions) return { answered: 0, total: 0 };
    const answeredCount = Object.keys(battleData.playerAnswers?.[playerName] || {}).length;
    return { answered: answeredCount, total: battleData.questions.length };
  };
  const getCurrentQuestionForPlayer = playerName => {
    const answers = battleData.playerAnswers?.[playerName] || {};
    const answeredQuestions = Object.keys(answers).map(Number);
    return answeredQuestions.length > 0 ? Math.max(...answeredQuestions) + 1 : 0;
  };
  const leaderboard = [...players]
    .map(player => ({
      ...player,
      score: localScores[player.name] || 0,
      progress: getPlayerProgress(player.name),
      currentQuestion: getCurrentQuestionForPlayer(player.name)
    }))
    .sort((a, b) => b.score - a.score);

  // Favourites logic - show dynamic rank/points/ques for each
  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(favInput.toLowerCase())
  );
  function toggleFav(player) {
    setMyFavs(prev =>
      prev.find(f => f.name === player.name)
        ? prev.filter(f => f.name !== player.name)
        : prev.length < 3
          ? [...prev, player]
          : prev
    );
  }
  function removeFav(player) {
    setMyFavs(prev => prev.filter(f => f.name !== player.name));
  }

  // Dynamically sort/position myFavs as per current leaderboard
  const myFavsLive = leaderboard
    .filter(l => myFavs.some(f => f.name === l.name))
    .map(l => ({
      ...l,
      rank: leaderboard.findIndex(lb => lb.name === l.name) + 1,
    }));

  // Utility
  const formatTime = sec => {
    if (!sec || sec < 0) return "0:00";
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const totalQuestions = battleData?.questions?.length || 0;
  const isLive = battleData?.status === "ongoing";
  const isEnded = battleData?.status === "ended";
  const isWaiting = !isLive && !isEnded;

  const BattleStatsHeader = (
    <div className="grid grid-cols-4 gap-4 mt-6">
      {/* Time Remaining */}
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl px-6 py-8 text-center shadow-lg">
        <div className="flex flex-col items-center">
          <FaClock className="text-4xl text-blue-600 mb-3" />
          <div className="text-3xl font-black text-blue-800">{formatTime(timeRemaining)}</div>
          <div className="text-lg font-semibold text-blue-700 mt-1">Time Remaining</div>
        </div>
      </div>
      
      {/* Total Questions */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl px-6 py-8 text-center shadow-lg">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-black text-purple-800 mb-2">{totalQuestions}</div>
          <div className="text-lg font-semibold text-purple-700">Total Questions</div>
        </div>
      </div>
      
      {/* Players */}
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl px-6 py-8 text-center shadow-lg">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-black text-green-800 mb-2">{players.length}</div>
          <div className="text-lg font-semibold text-green-700">Players</div>
        </div>
      </div>
      
      {/* Difficulty */}
      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl px-6 py-8 text-center shadow-lg">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-black text-orange-800 mb-2">{battleData?.difficultyLevel || "Rookie"}</div>
          <div className="text-lg font-semibold text-orange-700">Difficulty</div>
        </div>
      </div>
    </div>
  );

  // Header Battle Data Grid (as per screenshot)
  const BattleStatsGrid = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      {/* Time Remaining */}
      <div className="rounded-2xl px-10 py-8 text-center" style={{background: "linear-gradient(90deg, #d8f0fd 0%, #c6fbff 100%)"}}>
        <div className="flex flex-col items-center">
          <span className="text-5xl text-blue-700 mb-2">
            <FaClock />
          </span>
          <span className="text-3xl font-black text-blue-700 tracking-wide">{formatTime(timeRemaining)}</span>
        </div>
        <div className="mt-2 text-xl text-blue-700 font-semibold">Time Remaining</div>
      </div>
      {/* Total Questions */}
      <div className="rounded-2xl px-10 py-8 text-center" style={{background: "linear-gradient(90deg, #f8eaff 0%, #ffeefd 100%)"}}>
        <div className="text-5xl font-extrabold text-purple-700 mb-2">{totalQuestions}</div>
        <div className="mt-2 text-xl text-purple-700 font-semibold">Total Questions</div>
      </div>
      {/* Players */}
      <div className="rounded-2xl px-10 py-8 text-center" style={{background: "linear-gradient(90deg, #d0f7ea 0%, #c6ffef 100%)"}}>
        <div className="text-5xl font-extrabold text-green-700 mb-2">{players.length}</div>
        <div className="mt-2 text-xl text-green-700 font-semibold">Players</div>
      </div>
      {/* Difficulty */}
      <div className="rounded-2xl px-10 py-8 text-center" style={{background: "linear-gradient(90deg, #fff0db 0%, #ffe0e0 100%)"}}>
        <div className="text-5xl font-extrabold text-orange-700 mb-2">{battleData?.difficultyLevel || "Rookie"}</div>
        <div className="mt-2 text-xl text-orange-600 font-semibold">Difficulty</div>
      </div>
    </div>
  );

  // Enhanced My Favs Section with fixed sizing
  const MyFavsSection = () => {
    const emptySlots = 3 - myFavsLive.length;
    
    return (
      <div className="w-full mt-6 mb-8">
        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
          <FaHeart className="text-pink-400" /> My Favorite Players
        </h2>
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-6 shadow-2xl">
          <div className="grid grid-cols-3 gap-4">
            {/* Filled Favorite Slots */}
            {myFavsLive.map((player, idx) => {
              const playerIndex = players.findIndex(p => p.name === player.name);
              const progress = player.progress;
              const progressPercentage = progress.total > 0 ? (progress.answered / progress.total) * 100 : 0;
              
              return (
                <div key={player.name} className="bg-white rounded-2xl shadow-lg p-5 relative min-h-[200px] flex flex-col">
                  {/* Rank Badge - More Visible */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-lg px-4 py-2 rounded-full shadow-lg border-4 border-white">
                    #{player.rank}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFav(player)}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                  >
                    ✕
                  </button>
                  
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg mb-3"
                      style={{ background: COLORS[playerIndex % COLORS.length] }}>
                      {PLAYER_EMOJIS[playerIndex % PLAYER_EMOJIS.length]}
                    </div>
                    
                    <div className="font-black text-xl text-gray-800 text-center mb-2">{player.name}</div>
                    <div className="text-2xl font-black text-purple-600 mb-2">{player.score} pts</div>
                    <div className="text-sm text-gray-600 mb-3">{progress.answered} of {progress.total} questions</div>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Empty Slots */}
            {Array(emptySlots).fill().map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-white/50 border-2 border-dashed border-gray-300 rounded-2xl p-5 min-h-[200px] flex flex-col items-center justify-center">
                <button
                  onClick={() => setShowFavModal(true)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 flex items-center justify-center text-white text-2xl transition-all shadow-lg"
                >
                  <FaPlus />
                </button>
                <div className="text-gray-500 font-semibold mt-3 text-center">Add Favorite</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Combined Live Ranks and Player Progress
  const CombinedLeaderboard = () => (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
      <h2 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
        <FaTrophy className="text-yellow-500" /> Live Leaderboard & Progress
      </h2>
      <div className="space-y-4">
        {leaderboard.map((player, index) => {
          const playerIndex = players.findIndex(p => p.name === player.name);
          const progress = player.progress;
          const progressPercentage = progress.total > 0 ? (progress.answered / progress.total) * 100 : 0;
          
          return (
            <div key={player.name} className={`p-5 rounded-2xl transition-all duration-300 ${
              index === 0 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-lg' :
              index === 1 ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-400 shadow-lg' :
              index === 2 ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 shadow-lg' :
              'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
            }`}>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-3xl font-black text-gray-700">#{index + 1}</div>
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg"
                  style={{ background: COLORS[playerIndex % COLORS.length] }}>
                  {PLAYER_EMOJIS[playerIndex % COLORS.length]}
                </div>
                <div className="flex-1">
                  <div className="font-black text-xl text-gray-800">{player.name}</div>
                  <div className="text-lg font-bold text-purple-600">{player.score} points</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 font-semibold">
                    {progress.answered} of {progress.total} questions
                  </div>
                  {index < 3 && <div className="text-3xl mt-1">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: `${progressPercentage}%`,
                    background: `linear-gradient(90deg, ${COLORS[playerIndex % COLORS.length]}, ${COLORS[playerIndex % COLORS.length]}aa)`
                  }}
                >
                  <div className="absolute inset-0 bg-white/40 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- RENDER ---
  if (!battleData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-2xl font-bold">Loading battle data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {isLive ? (
                  <FaEye className="text-purple-600 text-4xl animate-pulse" />
                ) : (
                  <FaEye className="text-gray-400 text-4xl" />
                )}
                <div className="absolute -top-3 -right-5">
                  {isLive
                    ? <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs animate-bounce">LIVE</span>
                    : isEnded
                      ? <span className="bg-gray-500 text-white px-3 py-1 rounded-full font-bold text-xs">ENDED</span>
                      : <span className="bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-xs">WAITING</span>
                  }
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  {battleData.module || 'Battle Arena'}
                </h1>
                {isWaiting && (
                  <div className="text-yellow-700 font-bold mt-2 animate-pulse">
                    Stay Tuned! The battle will be live any minute...
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-full font-bold transition-all duration-300 ${
                  soundEnabled 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-400 text-white hover:bg-gray-500'
                }`}
              >
                {soundEnabled ? <FaVolumeUp /> : <FaVolumeOff />}
              </button>
              <button
                onClick={shareSpectatorLink}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaShare /> Share Link
              </button>
              <button
                onClick={() => setShowFavModal(true)}
                className="bg-gradient-to-r from-pink-400 to-yellow-400 text-white px-5 py-3 rounded-full font-bold hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 shadow-lg flex items-center gap-2"
              >
                <FaHeart className="text-red-500" /> My Favs
              </button>
            </div>
          </div>
          {BattleStatsHeader}
        </div>

        {/* My Favs Section - Always show with fixed size */}
        <MyFavsSection />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* MAIN: Combined Leaderboard */}
          <div className="xl:col-span-2">
            <CombinedLeaderboard />
          </div>

          {/* SIDEBAR: Live Activity */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
              <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                <FaChartBar className="text-purple-500" /> Live Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div key={idx} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 text-purple-800 font-semibold animate-fadeIn">
                      {activity}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <div className="text-4xl mb-2">👀</div>
                    <div>Watching for activity...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-gray-800">Share Spectator Link</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 p-2">
                <FaTimes />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Share this link with parents or friends to let them watch the battle live:
            </p>
            <div className="flex gap-2 mb-6">
              <input type="text" readOnly value={shareUrl} className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-800" />
              <button onClick={copyShareLink}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all text-white font-semibold">
                {isLinkCopied ? <FaCheck /> : <FaCopy />}
                {isLinkCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="text-center text-sm text-gray-500">
              This link will remain active until the battle ends
            </div>
          </div>
        </div>
      )}

      {/* Favourites Modal */}
      {showFavModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-pink-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-pink-600">Select Your 3 Favourites</h3>
              <button onClick={() => setShowFavModal(false)} className="text-gray-400 hover:text-red-400 p-2"><FaTimes /></button>
            </div>
            <input
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Search players..."
              value={favInput}
              onChange={e => setFavInput(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto space-y-3">
              {filteredPlayers.length === 0 && (
                <div className="text-gray-500 text-center py-8">No players found with that name</div>
              )}
              {filteredPlayers.map((player, idx) => {
                const isFav = myFavs.some(f => f.name === player.name);
                return (
                  <div key={player.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-pink-50 transition">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ background: COLORS[idx % COLORS.length] }}>
                      {PLAYER_EMOJIS[idx % COLORS.length]}
                    </div>
                    <div className="flex-1 font-bold text-gray-800">{player.name}</div>
                    <button
                      className={`ml-2 px-3 py-1 rounded-full font-bold text-xs 
                        ${isFav ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      disabled={!isFav && myFavs.length >= 3}
                      onClick={() => toggleFav(player)}
                    >
                      {isFav ? "Remove" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowFavModal(false)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-600 to-yellow-500 text-white font-bold hover:from-pink-500 hover:to-yellow-400 transition-all">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}