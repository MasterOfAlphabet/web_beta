import React, { useState } from 'react';

// Level Data for Different Class Groups with enhanced color schemes
import {levelData, moduleAnalysis} from '../components/GamificationLevelsData';


const GamificationLevels = () => {
  const [selectedClass, setSelectedClass] = useState("Class I & II");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const handleLevelClick = (level, index) => {
    setSelectedLevel(level);
    setCurrentLevelIndex(index);
  };

  const handleBackClick = () => {
    setSelectedLevel(null);
  };

  const navigateToLevel = (direction) => {
    const levels = levelData[selectedClass];
    let newIndex;
    
    if (direction === 'prev' && currentLevelIndex > 0) {
      newIndex = currentLevelIndex - 1;
    } else if (direction === 'next' && currentLevelIndex < levels.length - 1) {
      newIndex = currentLevelIndex + 1;
    } else {
      return;
    }
    
    setCurrentLevelIndex(newIndex);
    setSelectedLevel(levels[newIndex]);
  };

  const getPrevLevel = () => {
    return currentLevelIndex > 0 ? levelData[selectedClass][currentLevelIndex - 1] : null;
  };

  const getNextLevel = () => {
    return currentLevelIndex < levelData[selectedClass].length - 1 ? levelData[selectedClass][currentLevelIndex + 1] : null;
  };

  if (selectedLevel) {
    const prevLevel = getPrevLevel();
    const nextLevel = getNextLevel();

    return (
      <div className={`min-h-screen bg-gradient-to-br ${selectedLevel.colors[0]} ${selectedLevel.colors[1]} ${selectedLevel.colors[2]} relative overflow-hidden`}>
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-white/30 to-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-white/20 to-white/5 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-gradient-to-r from-white/15 to-white/5 rounded-full animate-float-slow"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-1/3 right-20 w-16 h-16 bg-white/20 transform rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-1/3 left-16 w-12 h-12 bg-white/30 rounded-full animate-bounce-slow"></div>
          
          {/* Gradient Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t ${selectedLevel.bgPattern} opacity-50`}></div>
        </div>

        <div className="relative z-10 p-6 max-w-5xl mx-auto">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-8">
            {/* Previous Level */}
            {prevLevel ? (
              <button
                onClick={() => navigateToLevel('prev')}
                className="group flex items-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="text-2xl group-hover:-translate-x-1 transition-transform duration-300">←</div>
                <div>
                  <div className="text-sm opacity-80">Previous</div>
                  <div className="font-bold">{prevLevel.name}</div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="text-2xl">🏠</div>
                <div>
                  <div className="text-sm opacity-80">Back to</div>
                  <div className="font-bold">All Levels</div>
                </div>
              </button>
            )}

            {/* Next Level */}
            {nextLevel && (
              <button
                onClick={() => navigateToLevel('next')}
                className="group flex items-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div>
                  <div className="text-sm opacity-80 text-right">Next</div>
                  <div className="font-bold">{nextLevel.name}</div>
                </div>
                <div className="text-2xl group-hover:translate-x-1 transition-transform duration-300">→</div>
              </button>
            )}
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block relative">
              <h1 className="text-6xl font-bold text-white mb-3 drop-shadow-2xl animate-fade-in relative z-10">
                {selectedLevel.name}
              </h1>
              <div className="absolute inset-0 text-6xl font-bold text-white/20 blur-sm transform translate-x-2 translate-y-2 -z-10">
                {selectedLevel.name}
              </div>
            </div>
            <p className="text-2xl text-white/90 italic font-light drop-shadow-lg">{selectedLevel.tagline}</p>
          </div>

          {/* Description Card */}
          <div className="mb-10 bg-white/25 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:bg-white/30">
            <p className="text-white text-xl text-center leading-relaxed font-medium">{selectedLevel.description}</p>
          </div>

          {/* Modules Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center justify-center drop-shadow-lg">
              <span className="mr-4 text-4xl">📚</span> Focused Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedLevel.modules.map((module, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl transform hover:scale-105 hover:bg-white/30 transition-all duration-300 hover:shadow-2xl"
                >
                  <p className="text-white font-semibold text-lg flex items-center">
                    <span className="text-green-300 mr-4 text-xl">✓</span>
                    {module}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center justify-center drop-shadow-lg">
              <span className="mr-4 text-4xl">💡</span> Improvement Tips
            </h2>
            <div className="space-y-6">
              {selectedLevel.tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl transform hover:scale-105 hover:bg-white/30 transition-all duration-300 hover:shadow-2xl"
                >
                  <p className="text-white text-lg flex items-start">
                    <span className="text-blue-300 mr-4 mt-1 text-xl">✓</span>
                    <span className="leading-relaxed font-medium">{tip}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Section */}
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl text-center transform hover:scale-105 transition-all duration-500 hover:bg-white/35 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center drop-shadow-lg">
              <span className="mr-4 text-4xl">🎯</span> Your Goal
            </h2>
            <p className="text-white text-xl font-semibold leading-relaxed">{selectedLevel.goal}</p>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center">
            {prevLevel ? (
              <button
                onClick={() => navigateToLevel('prev')}
                className="group flex items-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div className="text-2xl group-hover:-translate-x-1 transition-transform duration-300">←</div>
                <div>
                  <div className="text-sm opacity-80">Previous</div>
                  <div className="font-bold">{prevLevel.name}</div>
                </div>
              </button>
            ) : (
              <div></div>
            )}

            {nextLevel && (
              <button
                onClick={() => navigateToLevel('next')}
                className="group flex items-center space-x-3 px-6 py-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/30 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <div>
                  <div className="text-sm opacity-80 text-right">Next</div>
                  <div className="font-bold">{nextLevel.name}</div>
                </div>
                <div className="text-2xl group-hover:translate-x-1 transition-transform duration-300">→</div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-yellow-500/30 to-red-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-pink-500/30 to-violet-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-gradient-to-r from-green-500/30 to-teal-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/20 transform rotate-45 animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in relative z-10">
              🎮 Gamification Levels
            </h1>
            <div className="absolute inset-0 text-7xl font-bold text-white/10 blur-sm transform translate-x-3 translate-y-3 -z-10">
              🎮 Gamification Levels
            </div>
          </div>
          <p className="text-2xl text-white/80 font-light drop-shadow-lg">Choose your learning adventure and level up your skills</p>
        </div>

        {/* Class Selector */}
        <div className="mb-16 flex justify-center">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-3 hover:bg-white/25 transition-all duration-300">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-white text-xl font-semibold px-8 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer min-w-[300px]"
            >
              {Object.keys(levelData).map((classGroup, index) => (
                <option key={index} value={classGroup} className="bg-slate-800 text-white">
                  {classGroup}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levelData[selectedClass].map((level, index) => (
            <div
              key={index}
              onClick={() => handleLevelClick(level, index)}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:z-10 relative"
            >
              <div className={`bg-gradient-to-br ${level.colors[0]} ${level.colors[1]} ${level.colors[2]} rounded-3xl p-1 shadow-2xl hover:shadow-3xl transition-all duration-300`}>
                <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 h-full hover:bg-white/25 transition-all duration-300 relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full transform -translate-x-8 translate-y-8"></div>
                  </div>
                  
                  {/* Level Badge */}
                  <div className="absolute -top-4 -right-4 bg-white/40 backdrop-blur-lg rounded-full w-16 h-16 flex items-center justify-center border-2 border-white/50 shadow-xl">
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                  
                  {/* Level Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
                      {level.name}
                    </h3>
                    <p className="text-white/90 text-base italic mb-8 font-medium drop-shadow-md">
                      {level.tagline}
                    </p>
                    
                    {/* Quick Preview */}
                    <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-6 mb-6 hover:bg-white/35 transition-all duration-300">
                      <p className="text-white text-sm leading-relaxed font-medium">
                        {level.description}
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center space-x-6 text-white/80 text-sm font-semibold">
                      <span className="flex items-center bg-white/20 rounded-full px-4 py-2">
                        <span className="mr-2 text-lg">📚</span>
                        {level.modules.length} Modules
                      </span>
                      <span className="flex items-center bg-white/20 rounded-full px-4 py-2">
                        <span className="mr-2 text-lg">💡</span>
                        {level.tips.length} Tips
                      </span>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/40 backdrop-blur-lg rounded-full px-8 py-3 text-white font-bold text-base shadow-xl border border-white/30">
                        Click to explore →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
      `}</style>
    </div>
  );
};

export default GamificationLevels;