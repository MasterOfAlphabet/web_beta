import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../services/firebase";
import {
  FaTrophy,
  FaUsers,
  FaClock,
  FaFire,
  FaBook,
  FaSpellCheck,
  FaMicrophone,
  FaLanguage,
  FaPenFancy,
  FaHeadphones,
  FaStar,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaGamepad,
  FaBolt,
  FaEye,
  FaPlay,
  FaGlobe,
  FaAward,
  FaRocket,
  FaShieldAlt,
  FaShare
} from "react-icons/fa";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { HiLightningBolt } from "react-icons/hi";

const BattlesHub = () => {
  const navigate = useNavigate();
  const [availableBattles, setAvailableBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [notifications, setNotifications] = useState([]);
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);

  // Load all battles from Firestore
  useEffect(() => {
    const battlesRef = collection(firestore, "battles");
    const q = query(battlesRef, where("status", "in", ["waiting", "ongoing"]));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const battles = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableBattles(battles);
        setIsLoading(false);
        
        // Add notification for new battles
        if (battles.length > availableBattles.length && !isLoading) {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'success',
            message: 'New battle available!',
            timestamp: new Date()
          }]);
        }
      },
      (error) => {
        console.error("Error fetching battles:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Timer countdown effect for selected battle
  useEffect(() => {
    if (!selectedBattle) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedBattle]);

  // Auto-remove notifications
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.filter(notif => Date.now() - notif.timestamp < 5000)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getAvailableModules = () => {
    const uniqueModules = new Set();
    availableBattles.forEach(battle => {
      if (battle.module) {
        uniqueModules.add(battle.module);
      }
    });

    const defaultModules = [
      "Spelling", "Reading", "Pronunciation", "Grammar", 
      "Writing", "Listening", "Vocabulary", "SHARP", "8-in-1"
    ];

    const modulesToShow = uniqueModules.size > 0 
      ? Array.from(uniqueModules) 
      : defaultModules;

    return modulesToShow.map(moduleName => {
      const battleForModule = availableBattles.find(b => b.module === moduleName);
      const icon = getModuleIcon(moduleName);
      const color = getModuleColor(moduleName);

      return {
        name: moduleName,
        icon,
        color,
        description: battleForModule?.description || `${moduleName} challenges`,
        difficulty: battleForModule?.difficulty || "Intermediate",
        avgDuration: battleForModule?.avgDuration || "10-15 min",
        battle: battleForModule
      };
    });
  };

  const getModuleIcon = (moduleName) => {
    switch(moduleName) {
      case "Spelling": return <FaSpellCheck className="text-4xl" />;
      case "Reading": return <FaBook className="text-4xl" />;
      case "Pronunciation": return <FaMicrophone className="text-4xl" />;
      case "Grammar": return <FaLanguage className="text-4xl" />;
      case "Writing": return <FaPenFancy className="text-4xl" />;
      case "Listening": return <FaHeadphones className="text-4xl" />;
      case "Vocabulary": return <FaBook className="text-4xl" />;
      case "SHARP": return <FaStar className="text-4xl" />;
      case "8-in-1": return <FaFire className="text-4xl" />;
      default: return <FaGamepad className="text-4xl" />;
    }
  };

  const getModuleColor = (moduleName) => {
    switch(moduleName) {
      case "Spelling": return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "Reading": return "bg-gradient-to-br from-purple-400 to-purple-600";
      case "Pronunciation": return "bg-gradient-to-br from-green-400 to-green-600";
      case "Grammar": return "bg-gradient-to-br from-yellow-400 to-yellow-600";
      case "Writing": return "bg-gradient-to-br from-red-400 to-red-600";
      case "Listening": return "bg-gradient-to-br from-indigo-400 to-indigo-600";
      case "Vocabulary": return "bg-gradient-to-br from-pink-400 to-pink-600";
      case "SHARP": return "bg-gradient-to-br from-teal-400 to-teal-600";
      case "8-in-1": return "bg-gradient-to-br from-orange-400 to-orange-600";
      default: return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 180) return "text-green-500";
    if (timeLeft > 60) return "text-yellow-500";
    return "text-red-500";
  };

  const formatTimeRemaining = (createdAt, joinTimeLimit = 300) => {
    if (!createdAt?.toDate) return "0:00";
    const endTime = createdAt.toDate().getTime() + (joinTimeLimit * 1000);
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const startBattle = (battleId) => {
    navigate(`/battle/${battleId}`);
  };

  const openJoinModal = (battle) => {
    setSelectedBattle(battle);
    setTimeLeft(300);
    setShowJoinModal(true);
  };

  const closeJoinModal = () => {
    setShowJoinModal(false);
    setPlayerName("");
  };

  const joinBattle = () => {
    if (!playerName.trim()) return;
    if (selectedBattle) {
      startBattle(selectedBattle.id);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600 bg-green-100";
      case "Intermediate": return "text-yellow-600 bg-yellow-100";
      case "Advanced": return "text-orange-600 bg-orange-100";
      case "Expert": return "text-red-600 bg-red-100";
      case "Master": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const filteredModules = getAvailableModules().filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && module.battle) ||
                         (filterStatus === "waiting" && !module.battle);
    
    return matchesSearch && matchesFilter;
  });

  const totalActivePlayers = availableBattles.reduce(
    (sum, battle) => sum + (battle.players?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-right"
          >
            <div className="flex items-center gap-2">
              <FaBolt className="text-yellow-300" />
              {notification.message}
            </div>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <FaTrophy className="text-6xl text-yellow-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
              Language <span className="text-yellow-300">Battles</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Compete in real-time language challenges and prove your mastery!
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-3xl font-bold text-white">{availableBattles.length}</div>
                <div className="text-blue-100">Active Battles</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-3xl font-bold text-white">{totalActivePlayers}</div>
                <div className="text-blue-100">Players Online</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-3xl font-bold text-white">{getAvailableModules().length}</div>
                <div className="text-blue-100">Game Modes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search battles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Battles</option>
                <option value="active">Active Only</option>
                <option value="waiting">Waiting for Players</option>
              </select>
              
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </button>
            </div>
          </div>
        </div>

        {/* Battles Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 h-80 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"} gap-6`}>
            {filteredModules.map((module, index) => {
              const isActive = !!module.battle;
              const playersCount = module.battle?.players?.length || 0;
              const timeLeft = module.battle 
                ? formatTimeRemaining(module.battle.createdAt, module.battle.joinTimeLimit)
                : null;

              return (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                    isActive ? "cursor-pointer border-2 border-green-200" : "opacity-80"
                  } ${viewMode === "list" ? "flex" : ""}`}
                  onClick={() => isActive && openJoinModal(module.battle)}
                >
                  {/* Status indicator */}
                  <div className={`${isActive ? "bg-green-400" : "bg-gray-300"} ${
                    viewMode === "list" ? "w-2 h-auto" : "w-full h-2"
                  }`}></div>
                  
                  <div className={`p-6 ${viewMode === "list" ? "flex-1 flex items-center gap-6" : ""}`}>
                    {/* Icon */}
                    <div className={`${module.color} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform ${
                      viewMode === "list" ? "p-3" : ""
                    }`}>
                      {module.icon}
                    </div>

                    <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                      {/* Module Info */}
                      <div className={`${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                        <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{module.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                          
                          {viewMode === "grid" && (
                            <div className="flex gap-2 mb-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                                {module.difficulty}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                {module.avgDuration}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Battle Info */}
                        <div className={`${viewMode === "list" ? "flex items-center gap-4" : ""}`}>
                          {isActive ? (
                            <div className={`flex ${viewMode === "list" ? "gap-4" : "justify-between items-center mb-3"}`}>
                              <div className="flex items-center gap-2">
                                <FaUsers className="text-blue-500" />
                                <span className="font-semibold text-blue-600">
                                  {playersCount}/{module.battle.maxPlayers || 5}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaClock className="text-orange-500" />
                                <span className="font-semibold text-orange-600">{timeLeft}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-600 font-medium text-sm">LIVE</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                Waiting for battle
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mt-3 ${
                          isActive
                            ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-not-allowed"
                        } ${viewMode === "list" ? "w-auto px-6" : ""}`}
                        disabled={!isActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          isActive && openJoinModal(module.battle);
                        }}
                      >
                        {isActive ? (
                          <div className="flex items-center justify-center gap-2">
                            <FaPlay className="text-sm" />
                            Join Battle
                          </div>
                        ) : (
                          "Not Available"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Info Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Battle Rules */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-3xl" />
              <h2 className="text-2xl font-bold">Battle Rules</h2>
            </div>
            <ul className="space-y-3">
              {[
                "Admin-created battles only",
                "Up to 10 players per battle",
                "5 minutes to join once created",
                "Starts automatically with 2+ players",
                "Answer quickly and accurately to win!"
              ].map((rule, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Stats */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <FaChartLine className="text-3xl" />
              <h2 className="text-2xl font-bold">Your Performance</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">--</div>
                <div className="text-sm">Battles Won</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">--</div>
                <div className="text-sm">Win Rate</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">--</div>
                <div className="text-sm">Best Streak</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">--</div>
                <div className="text-sm">Total Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaRocket className="text-2xl text-white" />
            <h3 className="text-xl font-bold text-white">Pro Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <FaBolt className="text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Speed Matters</h4>
              <p className="text-sm">Quick answers earn bonus points!</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <FaAward className="text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Accuracy First</h4>
              <p className="text-sm">Wrong answers have penalties.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <FaGlobe className="text-2xl mb-2" />
              <h4 className="font-semibold mb-1">Practice Daily</h4>
              <p className="text-sm">Consistency builds mastery.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Join Battle Modal */}
      {showJoinModal && selectedBattle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                      <span className="text-lg font-medium">LIVE - {selectedBattle.module}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="text-sm opacity-90">Difficulty</div>
                      <div className="font-bold flex items-center gap-1">
                        <FaFire className="text-orange-300" />
                        {selectedBattle.difficulty || "Intermediate"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Rules Section */}
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
                    <span className="font-medium">{selectedBattle.questionsCount || 15} total questions</span>
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
                      {selectedBattle.players?.length || 0}/{selectedBattle.maxPlayers || 5}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      {selectedBattle.maxPlayers - (selectedBattle.players?.length || 0)} spots left
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
                    <div className={`text-4xl font-black ${getTimeColor()}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-orange-600 mt-1">
                      {timeLeft <= 60 ? 'Hurry up!' : 'to join battle'}
                    </div>
                  </div>
                </div>
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
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && joinBattle()}
                    />
                  </div>
                  <button
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                    onClick={joinBattle}
                    disabled={!playerName.trim() || timeLeft === 0}
                  >
                    Join Battle
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  onClick={joinBattle}
                  disabled={!playerName.trim()}
                >
                  <FaTrophy />
                  Ready to Battle!
                </button>
                
                <button
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                  <FaShare />
                  Invite Friends
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
              <div className="text-center">
                <button
                  className="text-gray-600 hover:text-gray-800 transition-colors absolute top-4 right-4"
                  onClick={closeJoinModal}
                >
                  <IoMdClose size={24} />
                </button>
                <p className="text-gray-600 font-medium">
                  🔥 Battle ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">BT-{selectedBattle.id.slice(0, 6).toUpperCase()}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">May the best warrior win! Good luck!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattlesHub;