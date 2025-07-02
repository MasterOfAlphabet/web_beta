import React, { useState } from 'react';

// Level Data for Different Class Groups with enhanced color schemes
const levelData = {
  "Class I & II": [
    { name: 'Rookie', tagline: 'Starting Strong, Learning Along!', 
      colors: ['from-red-500', 'via-pink-500', 'to-rose-500'],
      bgPattern: 'from-red-400/20 via-pink-400/20 to-rose-400/20',
      description: "Build confidence by learning the basics of English.",
      modules: ["Spelling", "Reading", "Pronunciation", "Vocabulary"],
      tips: ["Complete one activity daily", "Use flashcards to remember words", "Read aloud to improve pronunciation"],
      goal: "Rank up to Racer by mastering basic words and sentences!" },
    { name: 'Racer', tagline: 'Pacing with Skills, Chasing Next Goals!', 
      colors: ['from-amber-400', 'via-orange-500', 'to-red-500'],
      bgPattern: 'from-amber-400/20 via-orange-400/20 to-red-400/20',
      description: "Boost your speed and improve sentence formation.",
      modules: ["Grammar", "Writing", "S.H.A.R.P", "Listening"],
      tips: ["Practice simple sentence formation", "Listen to short stories", "Write basic sentences"],
      goal: "Become a Master by improving reading, writing, and speaking!" },
    { name: 'Master', tagline: 'Crafting Words, Winning Hearts!', 
      colors: ['from-emerald-400', 'via-teal-500', 'to-cyan-600'],
      bgPattern: 'from-emerald-400/20 via-teal-400/20 to-cyan-400/20',
      description: "Express yourself confidently with better writing and vocabulary.",
      modules: ["Writing", "Pronunciation", "Vocabulary", "Reading"],
      tips: ["Engage in creative writing exercises", "Use new vocabulary in daily speech", "Read picture books and tell stories"],
      goal: "Rank up to Prodigy by strengthening grammar and vocabulary!" },
    { name: 'Prodigy', tagline: 'Winning the Crowd, Making Everyone Proud!', 
      colors: ['from-violet-500', 'via-purple-600', 'to-fuchsia-600'],
      bgPattern: 'from-violet-400/20 via-purple-400/20 to-fuchsia-400/20',
      description: "Master advanced writing, grammar, and speaking skills for your level.",
      modules: ["S.H.A.R.P", "Listening", "Grammar", "Spelling"],
      tips: ["Listen to simple audiobooks", "Practice storytelling", "Master spelling patterns"],
      goal: "Achieve Wizard status by demonstrating fluency and confidence!" },
    { name: 'Wizard', tagline: 'A World of Words, at My Command!', 
      colors: ['from-indigo-600', 'via-purple-700', 'to-pink-700'],
      bgPattern: 'from-indigo-500/20 via-purple-500/20 to-pink-500/20',
      description: "You command the language with fluency, clarity, and expertise for your age!",
      modules: ["All Modules Combined", "Writing", "Grammar & Vocabulary", "Reading & Speaking"],
      tips: ["Engage in show-and-tell", "Write creative short stories", "Help classmates with reading"],
      goal: "Stay at Wizard Level & Beyond! Inspire others with your skills!" }
  ],
  "Class III to V": [
    { name: 'Rookie', tagline: 'Building Blocks for Excellence!', 
      colors: ['from-rose-500', 'via-red-500', 'to-pink-600'],
      bgPattern: 'from-rose-400/20 via-red-400/20 to-pink-400/20',
      description: "Develop stronger foundational English skills with proper structure.",
      modules: ["Grammar", "Reading", "Vocabulary", "Spelling"],
      tips: ["Practice basic sentence structures", "Read chapter books", "Build systematic word banks"],
      goal: "Rank up to Racer by forming well-structured sentences!" },
    { name: 'Racer', tagline: 'Accelerating Towards Mastery!', 
      colors: ['from-yellow-400', 'via-amber-500', 'to-orange-600'],
      bgPattern: 'from-yellow-400/20 via-amber-400/20 to-orange-400/20',
      description: "Advance vocabulary and develop structured writing abilities.",
      modules: ["Writing", "Listening", "S.H.A.R.P", "Pronunciation"],
      tips: ["Write detailed paragraphs", "Practice active listening", "Master word relationships"],
      goal: "Become a Master by refining writing and comprehension skills!" },
    { name: 'Master', tagline: 'Refining Language Proficiency!', 
      colors: ['from-green-500', 'via-emerald-600', 'to-teal-600'],
      bgPattern: 'from-green-400/20 via-emerald-400/20 to-teal-400/20',
      description: "Improve fluency and develop deeper text comprehension abilities.",
      modules: ["Reading", "Grammar", "Writing", "Vocabulary"],
      tips: ["Read diverse texts for comprehension", "Apply advanced grammar rules", "Expand academic vocabulary"],
      goal: "Rank up to Prodigy by mastering structured communication!" },
    { name: 'Prodigy', tagline: 'Becoming an English Expert!', 
      colors: ['from-blue-500', 'via-indigo-600', 'to-purple-600'],
      bgPattern: 'from-blue-400/20 via-indigo-400/20 to-purple-400/20',
      description: "Students analyze texts and articulate ideas with clarity and purpose.",
      modules: ["Listening", "Pronunciation", "Advanced Writing", "S.H.A.R.P"],
      tips: ["Engage in group discussions", "Deliver clear presentations", "Write structured essays"],
      goal: "Achieve Wizard status by demonstrating high-level fluency!" },
    { name: 'Wizard', tagline: 'Fluency & Mastery Achieved!', 
      colors: ['from-purple-600', 'via-violet-700', 'to-fuchsia-700'],
      bgPattern: 'from-purple-500/20 via-violet-500/20 to-fuchsia-500/20',
      description: "The highest level where students achieve excellence across all English skills.",
      modules: ["Creative Writing", "Grammar & Vocabulary", "Advanced Reading & Speaking", "Spelling Mastery"],
      tips: ["Write imaginative stories", "Lead class discussions", "Master complex spelling and grammar"],
      goal: "Stay at Wizard Level & Beyond! Inspire and mentor others!" }
  ],
  "Class VI to X": [
    { name: 'Rookie', tagline: 'Exploring New Horizons!', 
      colors: ['from-red-600', 'via-rose-600', 'to-pink-700'],
      bgPattern: 'from-red-500/20 via-rose-500/20 to-pink-500/20',
      description: "Students refine fundamental skills and expand their analytical knowledge.",
      modules: ["Grammar", "Reading", "Vocabulary", "Spelling"],
      tips: ["Master complex sentence structures", "Read young adult novels", "Build academic vocabulary systematically"],
      goal: "Rank up to Racer by achieving strong command over sentence formation and analysis!" },
    { name: 'Racer', tagline: 'Speeding Towards Excellence!', 
      colors: ['from-orange-500', 'via-yellow-500', 'to-amber-600'],
      bgPattern: 'from-orange-400/20 via-yellow-400/20 to-amber-400/20',
      description: "Develop analytical thinking, writing fluency, and advanced comprehension skills.",
      modules: ["Writing", "Listening", "S.H.A.R.P", "Pronunciation"],
      tips: ["Analyze texts for deeper meaning", "Practice formal presentations", "Master advanced word relationships"],
      goal: "Become a Master by enhancing analytical writing and comprehension!" },
    { name: 'Master', tagline: 'Precision in Expression!', 
      colors: ['from-teal-500', 'via-cyan-600', 'to-blue-600'],
      bgPattern: 'from-teal-400/20 via-cyan-400/20 to-blue-400/20',
      description: "Sharpen linguistic precision, develop critical thinking, and perfect grammar usage.",
      modules: ["Reading", "Grammar", "Writing", "Vocabulary"],
      tips: ["Develop thesis-driven analytical essays", "Master literary devices", "Use sophisticated vocabulary"],
      goal: "Rank up to Prodigy by mastering complex writing structures and critical analysis!" },
    { name: 'Prodigy', tagline: 'Mastering Advanced English!', 
      colors: ['from-indigo-600', 'via-blue-700', 'to-cyan-700'],
      bgPattern: 'from-indigo-500/20 via-blue-500/20 to-cyan-500/20',
      description: "Become proficient in academic writing, formal debate, and sophisticated literary analysis.",
      modules: ["Listening", "Pronunciation", "Advanced Writing", "S.H.A.R.P"],
      tips: ["Participate in formal debates", "Analyze complex literary works", "Write research-based academic papers"],
      goal: "Achieve Wizard status by excelling in literature, formal communication, and persuasive writing!" },
    { name: 'Wizard', tagline: 'Language Mastery at its Finest!', 
      colors: ['from-violet-700', 'via-purple-800', 'to-indigo-800'],
      bgPattern: 'from-violet-600/20 via-purple-600/20 to-indigo-600/20',
      description: "Attain complete fluency, master persuasive communication, and demonstrate expertise in advanced English concepts.",
      modules: ["Creative & Academic Writing", "Grammar & Advanced Vocabulary", "Public Speaking & Pronunciation", "Critical Reading & Spelling Mastery"],
      tips: ["Compose compelling speeches and essays", "Lead literary discussions", "Mentor junior students in language skills"],
      goal: "Stay at Wizard Level & Beyond! Become a communication leader and inspire excellence!" }
  ]
};

// Module Distribution Analysis
const moduleAnalysis = {
  totalModules: 8,
  modules: ["Spelling", "Reading", "Pronunciation", "Grammar", "Writing", "Listening", "Vocabulary", "S.H.A.R.P"],
  distribution: {
    "Class I & II": {
      "Rookie": ["Spelling", "Reading", "Pronunciation", "Vocabulary"],
      "Racer": ["Grammar", "Writing", "S.H.A.R.P", "Listening"],
      "Master": ["Writing", "Pronunciation", "Vocabulary", "Reading"],
      "Prodigy": ["S.H.A.R.P", "Listening", "Grammar", "Spelling"],
      "Wizard": ["All Modules Combined", "Writing", "Grammar & Vocabulary", "Reading & Speaking"]
    },
    "Class III to V": {
      "Rookie": ["Grammar", "Reading", "Vocabulary", "Spelling"],
      "Racer": ["Writing", "Listening", "S.H.A.R.P", "Pronunciation"],
      "Master": ["Reading", "Grammar", "Writing", "Vocabulary"],
      "Prodigy": ["Listening", "Pronunciation", "Advanced Writing", "S.H.A.R.P"],
      "Wizard": ["Creative Writing", "Grammar & Vocabulary", "Advanced Reading & Speaking", "Spelling Mastery"]
    },
    "Class VI to X": {
      "Rookie": ["Grammar", "Reading", "Vocabulary", "Spelling"],
      "Racer": ["Writing", "Listening", "S.H.A.R.P", "Pronunciation"],
      "Master": ["Reading", "Grammar", "Writing", "Vocabulary"],
      "Prodigy": ["Listening", "Pronunciation", "Advanced Writing", "S.H.A.R.P"],
      "Wizard": ["Creative & Academic Writing", "Grammar & Advanced Vocabulary", "Public Speaking & Pronunciation", "Critical Reading & Spelling Mastery"]
    }
  }
};


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