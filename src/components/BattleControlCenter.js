import React, { useState, useEffect } from 'react';
import {
  collection, addDoc, serverTimestamp, onSnapshot, deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { firestore } from '../services/firebase';
import {
  FaPlus, FaTrash, FaUsers, FaClock, FaPlay, FaTrophy, FaChartBar,
  FaSearch, FaBolt, FaEye, FaCog, FaCalendarAlt, FaGamepad, FaTimes, FaCheck,
  FaBookReader, FaMicrophone, FaEdit, FaPencilAlt, FaHeadphones,
  FaBookOpen, FaBootstrap, FaLayerGroup, FaRocket, FaShieldAlt, FaComments
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { allQuestions } from '../data/battleQuestions';

const modules_icons_colors = [
  { name: "Spelling", icon: FaBookReader, color: "#f44336", bgGradient: "from-red-400 to-red-600" },
  { name: "Reading", icon: FaBookReader, color: "#e91e63", bgGradient: "from-pink-400 to-pink-600" },
  { name: "Pronunciation", icon: FaMicrophone, color: "#9c27b0", bgGradient: "from-purple-400 to-purple-600" },
  { name: "Grammar", icon: FaEdit, color: "#673ab7", bgGradient: "from-indigo-400 to-indigo-600" },
  { name: "Writing", icon: FaPencilAlt, color: "#3f51b5", bgGradient: "from-blue-400 to-blue-600" },
  { name: "Listening", icon: FaHeadphones, color: "#2196f3", bgGradient: "from-cyan-400 to-cyan-600" },
  { name: "Vocabulary", icon: FaBookOpen, color: "#4caf50", bgGradient: "from-green-400 to-green-600" },
  { name: "S.H.A.R.P", icon: FaBootstrap, color: "#ff9800", bgGradient: "from-amber-400 to-orange-500" },
  { name: "8-In-1", icon: FaLayerGroup, color: "#795548", bgGradient: "from-slate-400 to-slate-600" },
];

const classGroups = [
  { value: 'class_1_2', label: 'Class I-II' },
  { value: 'class_3_5', label: 'Class III-V' },
  { value: 'class_6_10', label: 'Class VI-X' }
];

const difficultyLevels = [
  { value: 'Rookie', label: 'Rookie ⭐', questions: 25 },
  { value: 'Racer', label: 'Racer ⭐⭐', questions: 20 },
  { value: 'Master', label: 'Master ⭐⭐⭐', questions: 15 },
  { value: 'Prodigy', label: 'Prodigy ⭐⭐⭐⭐', questions: 10 },
  { value: 'Wizard', label: 'Wizard ⭐⭐⭐⭐⭐', questions: 5 }
];

const playerCounts = [5, 10, 25, 50, 100];
const battleModes = [
  { value: 'standard', label: 'Standard Battle', icon: FaGamepad },
  { value: 'speed', label: 'Speed Round', icon: FaRocket },
  { value: 'survival', label: 'Survival Mode', icon: FaShieldAlt },
  { value: 'tournament', label: 'Tournament Style', icon: FaTrophy }
];

const battleTypes = [
  { value: 'public', label: 'Public Battle', desc: 'Anyone can join' },
  { value: 'private', label: 'Private Battle', desc: 'Invite only' },
  { value: 'scheduled', label: 'Scheduled Battle', desc: 'Starts at specific time' }
];

function getRandomQuestions(module, classGroup, count) {
  let pool = [];
  if (module === "8-In-1" || module === "8-in-1") {
    Object.values(allQuestions).forEach((modData) => {
      if (modData[classGroup]) {
        if (Array.isArray(modData[classGroup])) {
          pool = [...pool, ...modData[classGroup]];
        } else {
          Object.values(modData[classGroup]).forEach((qt) => {
            pool = [...pool, ...qt];
          });
        }
      }
    });
  } else {
    const modData = allQuestions[module];
    if (modData && modData[classGroup]) {
      if (Array.isArray(modData[classGroup])) {
        pool = [...modData[classGroup]];
      } else {
        Object.values(modData[classGroup]).forEach((qt) => {
          pool = [...pool, ...qt];
        });
      }
    }
  }
  if (!pool.length) return [];
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const BattleControlCenter = () => {
  const [activeBattles, setActiveBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [classGroupFilter, setClassGroupFilter] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modalForm, setModalForm] = useState({
    classGroup: 'class_1_2',
    difficultyLevel: 'Rookie',
    configurationType: 'basic',
    numberOfQuestions: 25,
    numberOfPlayers: 10,
    startDate: '',
    startTime: '',
    battleMode: 'standard',
    timeLimitMinutes: 10, // Changed to minutes for clarity
    allowSpectators: true,
    enableChat: true,
    showLeaderboard: true,
    battleType: 'public',
    tags: [],
    description: ''
  });

  useEffect(() => {
    const battlesRef = collection(firestore, 'battles');
    const unsubscribe = onSnapshot(battlesRef, (snapshot) => {
      const battles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveBattles(battles);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const openCustomizationModal = (module) => {
    setSelectedModule(module);
    setModalForm({
      ...modalForm,
      numberOfQuestions: difficultyLevels.find(d => d.value === modalForm.difficultyLevel)?.questions || 25
    });
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setModalForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'difficultyLevel') {
        const difficulty = difficultyLevels.find(d => d.value === value);
        updated.numberOfQuestions = difficulty?.questions || 25;
      }
      return updated;
    });
  };

  const createCustomBattle = async () => {
    try {
      // Validate time limit
      if (modalForm.timeLimitMinutes < 5 || modalForm.timeLimitMinutes > 60) {
        addNotification('Time limit must be between 5 and 60 minutes', 'error');
        return;
      }

      const questions = getRandomQuestions(
        selectedModule.name,
        modalForm.classGroup,
        modalForm.numberOfQuestions
      );
      
      if (!questions.length) {
        addNotification('No questions available for this module/class group.', 'error');
        return;
      }

      const battleData = {
        module: selectedModule.name,
        status: modalForm.battleType === 'scheduled' ? 'scheduled' : 'waiting',
        createdAt: serverTimestamp(),
        classGroup: modalForm.classGroup,
        difficultyLevel: modalForm.difficultyLevel,
        numberOfQuestions: modalForm.numberOfQuestions,
        numberOfPlayers: modalForm.numberOfPlayers,
        battleType: modalForm.battleType,
        players: [],
        scores: {},
        questions,
        settings: {
          battleMode: modalForm.battleMode,
          timeLimit: modalForm.timeLimitMinutes * 60, // Convert to seconds
          allowSpectators: modalForm.allowSpectators,
          enableChat: modalForm.enableChat,
          showLeaderboard: modalForm.showLeaderboard,
          configurationType: modalForm.configurationType
        }
      };

      if (modalForm.battleType === 'scheduled' && modalForm.startDate && modalForm.startTime) {
        const scheduledTime = new Date(`${modalForm.startDate}T${modalForm.startTime}`);
        battleData.scheduledStartTime = scheduledTime;
      }

      await addDoc(collection(firestore, 'battles'), battleData);
      addNotification(`${selectedModule.name} battle created successfully!`);
      setShowModal(false);
      setSelectedModule(null);
    } catch (error) {
      console.error('Error creating battle:', error);
      addNotification('Failed to create battle', 'error');
    }
  };

  const cancelBattle = async (battleId) => {
    try {
      await deleteDoc(doc(firestore, 'battles', battleId));
      addNotification('Battle cancelled successfully!');
    } catch (error) {
      console.error('Error canceling battle:', error);
      addNotification('Failed to cancel battle', 'error');
    }
  };

  const startBattle = async (battle) => {
    try {
      let questions = (battle.questions && battle.questions.length > 0)
        ? battle.questions
        : getRandomQuestions(battle.module, battle.settings?.classGroup, battle.numberOfQuestions || 10);

      if (!questions.length) {
        addNotification('No questions available for this module/class group.', 'error');
        return;
      }

      await updateDoc(doc(firestore, 'battles', battle.id), {
        status: 'ongoing',
        questions,
        startedAt: serverTimestamp(),
        answeredPlayers: [],
      });
      addNotification('Battle started!');
    } catch (error) {
      console.error('Error starting battle:', error);
      addNotification('Failed to start battle', 'error');
    }
  };

  const formatTimeRemaining = (createdAt, joinTimeLimit) => {
    if (!createdAt?.toDate) return '0:00';
    const endTime = createdAt.toDate().getTime() + (joinTimeLimit * 1000);
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredBattles = activeBattles.filter(battle => {
    const matchesSearch = battle.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || battle.status === statusFilter;
    const matchesModule = moduleFilter === 'all' || battle.module === moduleFilter;
    const matchesClassGroup = classGroupFilter === 'all' ||
      (battle.settings?.classGroup === classGroupFilter);
    return matchesSearch && matchesStatus && matchesModule && matchesClassGroup;
  });

  const getBattleStats = () => {
    const total = activeBattles.length;
    const waiting = activeBattles.filter(b => b.status === 'waiting').length;
    const ongoing = activeBattles.filter(b => b.status === 'ongoing').length;
    const paused = activeBattles.filter(b => b.status === 'paused').length;
    const totalPlayers = activeBattles.reduce((sum, b) => sum + (b.players?.length || 0), 0);
    return { total, waiting, ongoing, paused, totalPlayers };
  };

  const stats = getBattleStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {/* Customization Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedModule?.bgGradient} text-white`}>
                    {selectedModule && <selectedModule.icon className="text-xl" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Customize {selectedModule?.name} Battle
                    </h2>
                    <p className="text-gray-600">Configure your battle settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaCog className="text-blue-500" />
                    Basic Settings
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class Group</label>
                    <select
                      value={modalForm.classGroup}
                      onChange={(e) => handleFormChange('classGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {classGroups.map(group => (
                        <option key={group.value} value={group.value}>{group.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      value={modalForm.difficultyLevel}
                      onChange={(e) => handleFormChange('difficultyLevel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {difficultyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Configuration Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['basic', 'advanced'].map(type => (
                        <button
                          key={type}
                          onClick={() => handleFormChange('configurationType', type)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            modalForm.configurationType === type
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaGamepad className="text-green-500" />
                    Battle Configuration
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Battle Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {battleModes.map(mode => (
                        <button
                          key={mode.value}
                          onClick={() => handleFormChange('battleMode', mode.value)}
                          className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                            modalForm.battleMode === mode.value
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <mode.icon />
                          <span className="text-sm">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions: {modalForm.numberOfQuestions}
                    </label>
                    <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
                      Auto-set based on difficulty level
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Players</label>
                    <select
                      value={modalForm.numberOfPlayers}
                      onChange={(e) => handleFormChange('numberOfPlayers', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={modalForm.configurationType === 'basic'}
                    >
                      {playerCounts.map(count => (
                        <option key={count} value={count}>{count} Players</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {modalForm.configurationType === 'advanced' && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaRocket className="text-purple-500" />
                    Advanced Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Battle Type
                      </label>
                      <select
                        value={modalForm.battleType}
                        onChange={(e) => handleFormChange('battleType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {battleTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Limit (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={modalForm.timeLimitMinutes}
                        onChange={(e) => handleFormChange('timeLimitMinutes', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {modalForm.battleType === 'scheduled' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={modalForm.startDate}
                            onChange={(e) => handleFormChange('startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={modalForm.startTime}
                            onChange={(e) => handleFormChange('startTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'allowSpectators', label: 'Allow Spectators', icon: FaEye },
                      { key: 'enableChat', label: 'Enable Chat', icon: FaComments },
                      { key: 'showLeaderboard', label: 'Show Leaderboard', icon: FaTrophy }
                    ].map(option => (
                      <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <option.icon className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">{option.label}</span>
                        </div>
                        <button
                          onClick={() => handleFormChange(option.key, !modalForm[option.key])}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            modalForm[option.key] ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            modalForm[option.key] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Battle Description (Optional)
                    </label>
                    <textarea
                      value={modalForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Add a description for your battle..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCustomBattle}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCheck />
                  Create Battle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Battle Control Center
              </h1>
              <p className="text-gray-600">Manage and monitor all educational battles</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <FaGamepad className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <FaClock className="text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-600">Waiting</p>
                    <p className="text-xl font-bold text-gray-800">{stats.waiting}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <FaPlay className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-xl font-bold text-gray-800">{stats.ongoing}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Players</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalPlayers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FaPlus className="text-white text-sm" />
            </span>
            Create New Battles
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {modules_icons_colors.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <button
                  key={module.name}
                  onClick={() => openCustomizationModal(module)}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{ minHeight: '120px' }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.bgGradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="text-white text-lg" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs text-center leading-tight mb-1">
                      {module.name}
                    </h3>
                    <p className="text-xs text-gray-500">Battle</p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-6 h-6 bg-gradient-to-r ${module.bgGradient} rounded-full flex items-center justify-center`}>
                        <FaPlus className="text-white text-xs" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search battles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="waiting">Waiting</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="paused">Paused</option>
                </select>
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Modules</option>
                  {modules_icons_colors.map(module => (
                    <option key={module.name} value={module.name}>{module.name}</option>
                  ))}
                </select>
                <select
                  value={classGroupFilter}
                  onChange={(e) => setClassGroupFilter(e.target.value)}
                  className="px-4 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Classes</option>
                  {classGroups.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FaChartBar />
                  Stats
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <FaBolt className="text-white text-sm" />
            </span>
            Active Battles ({filteredBattles.length})
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-2xl p-6 h-80 animate-pulse"></div>
              ))}
            </div>
          ) : filteredBattles.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20 shadow-lg">
              <FaGamepad className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No battles found</h3>
              <p className="text-gray-500">Create a new battle or adjust your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBattles.map((battle) => {
                const moduleData = modules_icons_colors.find(m => m.name === battle.module) || modules_icons_colors[0];
                const IconComponent = moduleData.icon;
                const canStart =
                  battle.status === 'waiting' &&
                  (battle.players?.length || 0) >= 2;
                return (
                  <div key={battle.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`h-2 bg-gradient-to-r ${moduleData.bgGradient}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${moduleData.bgGradient} flex items-center justify-center`}>
                            <IconComponent className="text-white text-lg" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{battle.module}</h3>
                            <p className="text-sm text-gray-500">
                              {battle.settings?.battleMode || 'Battle'} Arena
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          battle.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                          battle.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          battle.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                          battle.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {battle.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <FaUsers className="mr-2 text-sm" />
                            <span className="text-sm">{battle.players?.length || 0}/{battle.numberOfPlayers || battle.maxPlayers || 10} players</span>
                          </div>
                          {battle.settings?.difficulty && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {battle.settings.difficulty}
                            </span>
                          )}
                        </div>
                        {battle.numberOfQuestions && (
                          <div className="flex items-center text-gray-600">
                            <FaBookReader className="mr-2 text-sm" />
                            <span className="text-sm">{battle.numberOfQuestions} questions</span>
                          </div>
                        )}
                        {battle.settings?.timeLimit && (
                          <div className="flex items-center text-gray-600">
                            <FaClock className="mr-2 text-sm" />
                            <span className="text-sm">{Math.floor(battle.settings.timeLimit / 60)} min limit</span>
                          </div>
                        )}
                        {battle.status === 'waiting' && battle.joinTimeLimit && (
                          <div className="flex items-center text-gray-600">
                            <FaClock className="mr-2 text-sm" />
                            <span className="text-sm">{formatTimeRemaining(battle.createdAt, battle.joinTimeLimit)} remaining</span>
                          </div>
                        )}
                        {battle.createdAt && (
                          <div className="flex items-center text-gray-500">
                            <FaCalendarAlt className="mr-2 text-sm" />
                            <span className="text-xs">
                              Created {battle.createdAt.toDate?.().toLocaleTimeString() || 'Just now'}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {battle.settings?.battleMode && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {battle.settings.battleMode}
                            </span>
                          )}
                          {battle.battleType && battle.battleType !== 'public' && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                              {battle.battleType}
                            </span>
                          )}
                          {battle.settings?.allowSpectators && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                              Spectators
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {canStart && (
                          <button
                            onClick={() => startBattle(battle)}
                            className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <FaPlay />
                            Start the Battle
                          </button>
                        )}
                        <Link
                          to={`/battle-dashboard/${battle.id}`}
                          className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <FaChartBar />
                          Battle Dashboard
                        </Link>
                        <button
                          onClick={() => cancelBattle(battle.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleControlCenter;