import React from 'react';
import { 
  FaTimes, FaCog, FaGamepad, FaRocket, FaShieldAlt, FaTrophy, FaComments, FaEye, FaCheck
} from 'react-icons/fa';

// Props:
// - show (bool): controls visibility
// - onClose (function): called when modal closes
// - module (object): { name, icon, bgGradient }
// - form (object): form state
// - onFormChange (function): (field, value) => void
// - onCreate (function): called when "Create Battle" is pressed
// - config:
//    - classGroups, difficultyLevels, battleModes, playerCounts, battleTypes

const BattleCustomizationModal = ({
  show,
  onClose,
  module,
  form,
  onFormChange,
  onCreate,
  config = {},
}) => {
  if (!show) return null;

  const {
    classGroups = [],
    difficultyLevels = [],
    battleModes = [],
    playerCounts = [],
    battleTypes = [],
  } = config;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${module?.bgGradient} text-white`}>
                {module && <module.icon className="text-xl" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Customize {module?.name} Battle
                </h2>
                <p className="text-gray-600">Configure your battle settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaCog className="text-blue-500" />
                Basic Settings
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Group</label>
                <select
                  value={form.classGroup}
                  onChange={(e) => onFormChange('classGroup', e.target.value)}
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
                  value={form.difficultyLevel}
                  onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
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
                      onClick={() => onFormChange('configurationType', type)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        form.configurationType === type
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

            {/* Battle Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaGamepad className="text-green-500" />
                Battle Configuration
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Battle Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {battleModes.map(mode => (
                    <button
                      key={mode.value}
                      onClick={() => onFormChange('battleMode', mode.value)}
                      className={`p-3 rounded-lg border transition-colors flex items-center gap-2 ${
                        form.battleMode === mode.value
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
                  Number of Questions: {form.numberOfQuestions}
                </label>
                <div className="bg-gray-100 p-2 rounded-lg text-sm text-gray-600">
                  Auto-set based on difficulty level
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Players</label>
                <select
                  value={form.numberOfPlayers}
                  onChange={(e) => onFormChange('numberOfPlayers', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={form.configurationType === 'basic'}
                >
                  {playerCounts.map(count => (
                    <option key={count} value={count}>{count} Players</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          {form.configurationType === 'advanced' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaRocket className="text-purple-500" />
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Battle Type</label>
                  <select
                    value={form.battleType}
                    onChange={(e) => onFormChange('battleType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {battleTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={form.timeLimit}
                    onChange={(e) => onFormChange('timeLimit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {form.battleType === 'scheduled' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => onFormChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => onFormChange('startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Toggle Options */}
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
                      onClick={() => onFormChange(option.key, !form[option.key])}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        form[option.key] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        form[option.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Battle Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => onFormChange('description', e.target.value)}
                  placeholder="Add a description for your battle..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onCreate}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaCheck />
              Create Battle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleCustomizationModal;