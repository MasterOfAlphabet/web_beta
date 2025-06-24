// src/components/BattleCard.js
import React from 'react';
import { FaUsers, FaClock, FaPlay, FaPause, FaTrash, FaCalendarAlt, FaBookReader } from 'react-icons/fa';

export default function BattleDisplayCardForAdmin({ battle, module, onStart, onCancel, onPause }) {
  const IconComponent = module.icon || FaBookReader;

  const formatTimeRemaining = (createdAt, joinTimeLimit) => {
    if (!createdAt?.toDate) return '0:00';
    const endTime = createdAt.toDate().getTime() + (joinTimeLimit * 1000);
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadgeColor = () => {
    switch (battle.status) {
      case 'waiting': return 'bg-amber-100 text-amber-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`h-2 bg-gradient-to-r ${module.bgGradient}`} />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.bgGradient} flex items-center justify-center`}>
              <IconComponent className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{battle.module}</h3>
              <p className="text-sm text-gray-500">
                {battle.settings?.battleMode || 'Battle'} Arena
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}>
            {battle.status.toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center"><FaUsers className="mr-2" /> {battle.players?.length || 0}/{battle.numberOfPlayers || 10} players</span>
            {battle.settings?.difficulty && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{battle.settings.difficulty}</span>
            )}
          </div>
          {battle.numberOfQuestions && (
            <div className="flex items-center text-sm text-gray-600">
              <FaBookReader className="mr-2" /> {battle.numberOfQuestions} questions
            </div>
          )}
          {battle.settings?.timeLimit && (
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2" /> {Math.floor(battle.settings.timeLimit / 60)} min limit
            </div>
          )}
          {battle.status === 'waiting' && battle.joinTimeLimit && (
            <div className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-2" /> {formatTimeRemaining(battle.createdAt, battle.joinTimeLimit)} remaining
            </div>
          )}
          {battle.createdAt?.toDate && (
            <div className="flex items-center text-xs text-gray-500">
              <FaCalendarAlt className="mr-2" /> Created {battle.createdAt.toDate().toLocaleTimeString()}
            </div>
          )}

          <div className="flex flex-wrap gap-1 text-xs">
            {battle.settings?.battleMode && (
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{battle.settings.battleMode}</span>
            )}
            {battle.battleType && battle.battleType !== 'public' && (
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{battle.battleType}</span>
            )}
            {battle.settings?.allowSpectators && (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">Spectators</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {battle.status === 'scheduled' ? (
            <div className="flex-1 py-2 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center text-sm font-medium">
              <FaClock className="mr-2" /> Starts Soon
            </div>
          ) : battle.status === 'waiting' ? (
            <button onClick={onStart} className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 text-sm font-medium">
              <FaPlay className="text-xs" /> Start Now
            </button>
          ) : battle.status === 'ongoing' ? (
            <button onClick={onPause} className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 text-sm font-medium">
              <FaPause className="text-xs" /> Pause
            </button>
          ) : (
            <button onClick={onStart} className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 text-sm font-medium">
              <FaPlay className="text-xs" /> Resume
            </button>
          )}

          <button onClick={onCancel} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center">
            <FaTrash className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
