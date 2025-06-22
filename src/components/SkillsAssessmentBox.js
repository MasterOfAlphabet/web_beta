import React from 'react';

const SkillsAssessmentBox = ({ onTakeAssessment, onSkipToPractice }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Skills Assessment Recommendation Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white bg-opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-8 text-center">
          {/* Icon and Badge */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3 backdrop-blur-sm">
              <span className="text-4xl">🎯</span>
            </div>
            <div className="ml-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              RECOMMENDED
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl font-bold text-white mb-3">
            First Time Here? Start with Skills Assessment!
          </h2>
          
          {/* Description */}
          <p className="text-lg text-white text-opacity-90 mb-2 max-w-3xl mx-auto leading-relaxed">
            Discover your strengths and areas for improvement across all English skills. 
            Get personalized recommendations for your learning journey.
          </p>
          
          {/* Sub-description */}
          <p className="text-sm text-white text-opacity-75 mb-8 max-w-2xl mx-auto">
            Takes 15-20 minutes • Covers all 8 skill areas • Instant results & recommendations
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onTakeAssessment}
              className="group relative bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 min-w-[220px]"
            >
              <div className="flex items-center justify-center gap-2">
                <span>📊</span>
                <span>Take Skills Assessment</span>
                <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </div>
              </div>
              <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={onSkipToPractice}
              className="group bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 min-w-[180px]"
            >
              <div className="flex items-center justify-center gap-2">
                <span>⚡</span>
                <span>Skip to Practice</span>
              </div>
            </button>
          </div>

          {/* Benefits Icons */}
          <div className="mt-8 flex items-center justify-center gap-8 text-white text-opacity-80">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium">Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-medium">Quick</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-medium">Accurate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📈</span>
              <span className="text-sm font-medium">Trackable</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 text-white text-opacity-20">
          <div className="text-6xl transform rotate-12">📚</div>
        </div>
        <div className="absolute bottom-4 left-4 text-white text-opacity-20">
          <div className="text-4xl transform -rotate-12">🌟</div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessmentBox;