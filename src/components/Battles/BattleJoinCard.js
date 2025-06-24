import React, { useState, useEffect } from "react";
import { FaUsers, FaClock, FaShare, FaTrophy, FaShieldAlt, FaBolt, FaStar, FaFire } from "react-icons/fa";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { HiLightningBolt } from "react-icons/hi";

export default function BattleJoinCard() {
  const [name, setName] = useState("");
  const [timeLeft, setTimeLeft] = useState(323); // 5:23 in seconds
  const [showShareModal, setShowShareModal] = useState(false);
  const [players, setPlayers] = useState([
    { id: 1, name: "Alex Thunder", avatar: "A", joinedAt: Date.now() - 30000 },
    { id: 2, name: "Sarah Bolt", avatar: "S", joinedAt: Date.now() - 15000 }
  ]);
  const [battleStats] = useState({
    module: "Spelling Challenge",
    difficulty: "Advanced",
    questionsCount: 15,
    maxPlayers: 5
  });

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 180) return "text-green-500";
    if (timeLeft > 60) return "text-yellow-500";
    return "text-red-500";
  };

  const joinBattle = () => {
    if (!name.trim()) return;
    
    const newPlayer = {
      id: Date.now(),
      name: name.trim(),
      avatar: name.charAt(0).toUpperCase(),
      joinedAt: Date.now()
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    setName("");
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  const getPlayerJoinTime = (joinedAt) => {
    const seconds = Math.floor((Date.now() - joinedAt) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <FaTrophy className="text-yellow-300" />
                    Join Battle
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-lg font-medium">LIVE - {battleStats.module}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-sm opacity-90">Difficulty</div>
                    <div className="font-bold flex items-center gap-1">
                      <FaFire className="text-orange-300" />
                      {battleStats.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <FaBolt className="text-6xl animate-pulse" />
            </div>
          </div>

          {/* Battle Rules Section - Moved to Top */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <h3 className="flex items-center gap-3 text-xl font-bold mb-4 text-gray-800">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FaShieldAlt className="text-white" />
              </div>
              Battle Rules & Info
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Battle starts with 2+ players</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">15 seconds per question</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">{battleStats.questionsCount} total questions</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Correct answers earn points</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Speed bonus for quick answers</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="font-medium">Winner takes all glory!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <FaUsers className="text-4xl" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-blue-700 mb-2">
                    <FaUsers className="text-xl" />
                    <span className="font-bold text-lg">Players</span>
                  </div>
                  <div className="text-4xl font-black text-blue-800">
                    {players.length}/{battleStats.maxPlayers}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    {battleStats.maxPlayers - players.length} spots left
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-2xl border border-orange-200 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-10">
                  <FaClock className="text-4xl" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-orange-700 mb-2">
                    <FaClock className="text-xl" />
                    <span className="font-bold text-lg">Time Left</span>
                  </div>
                  <div className={`text-4xl font-black ${timeLeft <= 60 ? 'text-red-600' : 'text-orange-800'} ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-orange-600 mt-1">
                    {timeLeft <= 60 ? 'Hurry up!' : 'to join battle'}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Players Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Current Warriors ({players.length})
              </h3>
              
              {players.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaUsers className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-lg">No players yet. Be the first to join!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {player.avatar}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <FaTrophy className="text-xs text-yellow-800" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{player.name}</div>
                        <div className="text-sm text-gray-500">Joined {getPlayerJoinTime(player.joinedAt)}</div>
                      </div>
                      <div className="text-green-500">
                        <IoMdCheckmark className="text-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Join Form */}
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <HiLightningBolt className="text-yellow-500" />
                Enter the Battle Arena
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg font-medium placeholder-gray-400"
                    placeholder="Your warrior name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && joinBattle()}
                  />
                </div>
                <button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  onClick={joinBattle}
                  disabled={!name.trim() || timeLeft === 0}
                >
                  Join Battle
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                disabled={players.length < 2}
              >
                <FaTrophy />
                {players.length < 2 ? 'Waiting for Players...' : 'Ready to Battle!'}
              </button>
              
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                onClick={copyShareLink}
              >
                <FaShare />
                Invite Friends
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                🔥 Battle ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">BT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">May the best speller win! Good luck, warriors!</p>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 relative shadow-2xl animate-pulse">
              <button 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowShareModal(false)}
              >
                <IoMdClose size={24} />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdCheckmark className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Link Copied!</h3>
                <p className="text-gray-600">Share this battle with your friends and let the competition begin!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}