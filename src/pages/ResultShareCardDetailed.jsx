import React, { forwardRef } from 'react';
import { Trophy, Target, TrendingUp, AlertCircle } from 'lucide-react';

const ResultShareCardDetailed = forwardRef(({ 
  name, 
  level,
  module = "Spelling",
  classLevel,
  date,
  spellingIndex = 0,
  rawScore = 0,
  totalQuestions = 30,
  clusterScores = {},
  categoryScoresByCluster = {},
  schoolName = "---",
  city = "---"
}, ref) => {
  
  // Get level-specific data
  const getLevelData = (levelName) => {
    const levelMap = {
      "Rookie": { emoji: "🎯", color: "#ef4444" },
      "Racer": { emoji: "⚡", color: "#eab308" },
      "Master": { emoji: "🌟", color: "#22c55e" },
      "Prodigy": { emoji: "💎", color: "#3b82f6" },
      "Wizard": { emoji: "🧙‍♂️", color: "#8b5cf6" }
    };
    return levelMap[levelName] || levelMap["Master"];
  };

  const levelData = getLevelData(level);
  const currentDate = date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Cluster display info
  const CLUSTERS = {
    recognition: { icon: "👁️", name: "Recognition" },
    phoneme: { icon: "🎵", name: "Phoneme Construction" },
    structuring: { icon: "🏗️", name: "Word Structuring" }
  };

  // Get color based on percentage
  const getPerformanceColor = (percentage) => {
    if (percentage >= 75) return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-600', bar: 'bg-green-500' };
    if (percentage >= 60) return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-600', bar: 'bg-yellow-500' };
    return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-600', bar: 'bg-red-500' };
  };

  // Find weakest cluster
  const weakestCluster = Object.entries(clusterScores).length > 0
    ? Object.entries(clusterScores).reduce((min, [key, data]) => 
        data.percentage < min.percentage ? { key, ...data } : min
      , { key: Object.keys(clusterScores)[0], percentage: 100 })
    : null;

  return (
    <div 
      ref={ref}
      className="w-[800px] bg-white p-8 rounded-3xl shadow-2xl border-4 border-purple-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-6 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy size={32} className="text-yellow-300" />
          <h1 className="text-3xl font-black">MASTER OF ALPHABET</h1>
        </div>
        <p className="text-purple-100 font-semibold text-lg">Skills Assessment Report</p>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-sm text-purple-600 font-semibold mb-1">Student Name</p>
          <p className="text-xl font-black text-gray-900">{name}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-600 font-semibold mb-1">Class Level</p>
          <p className="text-xl font-black text-gray-900">{classLevel}</p>
        </div>
        <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
          <p className="text-sm text-pink-600 font-semibold mb-1">School</p>
          <p className="text-lg font-bold text-gray-900 truncate">{schoolName}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <p className="text-sm text-green-600 font-semibold mb-1">City</p>
          <p className="text-lg font-bold text-gray-900">{city}</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 text-center border-2 border-purple-300">
        <p className="text-purple-700 font-bold text-sm mb-2">SPELLING INDEX (Weighted Score)</p>
        <div className="text-7xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          {spellingIndex}%
        </div>
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg mb-3">
          <span className="text-5xl">{levelData.emoji}</span>
          <div className="text-left">
            <p className="text-2xl font-black" style={{ color: levelData.color }}>{level} Level</p>
            <p className="text-sm text-gray-600">in {module} Skills</p>
          </div>
        </div>
        <p className="text-gray-700 font-semibold">
          Raw Score: {rawScore}/{totalQuestions} ({Math.round((rawScore/totalQuestions)*100)}%)
        </p>
        <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
      </div>

      {/* Cluster Performance */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Target size={24} className="text-purple-600" />
          <h3 className="text-xl font-black text-gray-900">Cluster Performance</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(clusterScores).map(([key, data]) => {
            const clusterInfo = CLUSTERS[key];
            const colors = getPerformanceColor(data.percentage);
            const isWeakest = weakestCluster && weakestCluster.key === key;
            
            return (
              <div 
                key={key}
                className={`${isWeakest ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{clusterInfo.icon}</span>
                    <div>
                      <h4 className="text-lg font-black text-gray-900">{clusterInfo.name}</h4>
                      {isWeakest && (
                        <p className="text-xs font-bold text-orange-600 flex items-center gap-1">
                          <AlertCircle size={12} />
                          Focus Area
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-black ${colors.text}`}>{data.percentage}%</div>
                    <p className="text-xs text-gray-600">{data.correct}/{data.total}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>

                {/* Categories */}
                {categoryScoresByCluster[key] && categoryScoresByCluster[key].length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {categoryScoresByCluster[key].map((cat, idx) => {
                      const catColors = getPerformanceColor(cat.percentage);
                      return (
                        <div key={idx} className={`${catColors.bg} ${catColors.border} border rounded-lg p-2`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
                            <span className={`text-sm font-black ${catColors.text}`}>
                              {cat.correct}/{cat.total}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {weakestCluster && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} className="text-blue-600" />
            <h4 className="text-lg font-black text-blue-900">Recommended Focus</h4>
          </div>
          <p className="text-sm font-bold text-gray-900 mb-2">
            {CLUSTERS[weakestCluster.key].name} ({weakestCluster.percentage}%)
          </p>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Practice Activities:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {weakestCluster.key === 'recognition' && (
                <>
                  <li>Flashcard games - visual word recognition</li>
                  <li>Sight word practice (10 min daily)</li>
                </>
              )}
              {weakestCluster.key === 'phoneme' && (
                <>
                  <li>Listen & Spell drills</li>
                  <li>Phonics worksheets - breaking words into sounds</li>
                </>
              )}
              {weakestCluster.key === 'structuring' && (
                <>
                  <li>Letter tile games - word building</li>
                  <li>Anagram puzzles - letter sequencing</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center">
        <p className="text-gray-500 text-sm font-semibold">
          www.MasterOfAlphabet.com
        </p>
        <p className="text-gray-400 text-xs mt-1">Detailed Skills Report</p>
      </div>
    </div>
  );
});

ResultShareCardDetailed.displayName = 'ResultShareCardDetailed';

export default ResultShareCardDetailed;
