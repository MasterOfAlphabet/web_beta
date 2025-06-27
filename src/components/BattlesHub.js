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
import { HiLightningBolt } from "react-icons/hi";

const BattlesHub = () => {
  const navigate = useNavigate();
  const [availableBattles, setAvailableBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [notifications, setNotifications] = useState([]);

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
    // eslint-disable-next-line
  }, []);

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

  const formatTimeRemaining = (createdAt, joinTimeLimit = 300) => {
    if (!createdAt?.toDate) return "0:00";
    const endTime = createdAt.toDate().getTime() + (joinTimeLimit * 1000);
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

  // Instead of modal, navigate to join page
  const openJoinPage = (battle) => {
    if (battle && battle.id) {
      navigate(`/battle/${battle.id}/join`);
    }
  };

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
                  onClick={() => isActive && openJoinPage(module.battle)}
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
                        onClick={e => {
                          e.stopPropagation();
                          isActive && openJoinPage(module.battle);
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
    </div>
  );
};

export default BattlesHub;