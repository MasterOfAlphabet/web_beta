import React from "react";

const levelColors = {
  Rookie: "from-slate-400 to-slate-600",
  Racer: "from-blue-400 to-blue-600",
  Master: "from-amber-400 to-amber-600",
  Prodigy: "from-purple-400 to-purple-600",
  Wizard: "from-emerald-400 to-emerald-600",
};

const levelGlow = {
  Rookie: "shadow-slate-500/30",
  Racer: "shadow-blue-500/30",
  Master: "shadow-amber-500/30",
  Prodigy: "shadow-purple-500/30",
  Wizard: "shadow-emerald-500/30",
};

const categoryColors = {
  Vocabulary: "from-blue-400 to-blue-600",
  Comprehension: "from-green-400 to-green-600",
  Fluency: "from-purple-400 to-purple-600",
  Grammar: "from-amber-400 to-amber-600",
  Reading: "from-red-400 to-red-600",
  Writing: "from-indigo-400 to-indigo-600",
  Spelling: "from-pink-400 to-pink-600",
  Math: "from-teal-400 to-teal-600",
};

const CategoryIcons = {
  Vocabulary: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.93 12.27L15.83 8.37L19.24 11.78L21 9ZM4.93 5.93L3.5 4.5L2 6L6.8 10.8L4.93 8.93ZM2.28 12.12L2 13L13 14L14 13L12.12 2.28L11.28 3.12L13.41 13.41L10.59 10.59L3.12 11.28L2.28 12.12Z"/>
    </svg>
  ),
  Comprehension: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9L12 15L21 12V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
    </svg>
  ),
  Fluency: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  ),
  Grammar: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"/>
    </svg>
  ),
  Reading: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  ),
  Writing: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  ),
  Spelling: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5,9.5L21.87,8.13L20.46,6.72L19.09,8.09L20.5,9.5M12.5,2.5V0.5H11.5V2.5H12.5M4.91,8.09L3.54,6.72L2.13,8.13L3.5,9.5L4.91,8.09M11.5,21.5V23.5H12.5V21.5H11.5M21.5,11.5H23.5V12.5H21.5V11.5M0.5,11.5H2.5V12.5H0.5V11.5M8.09,19.09L6.72,20.46L8.13,21.87L9.5,20.5L8.09,19.09M19.09,15.91L20.46,17.28L21.87,15.87L20.5,14.5L19.09,15.91M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
    </svg>
  ),
  Math: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M13.03,7.06L14.09,6L16.74,8.65L19.39,6L20.45,7.06L17.8,9.71L20.45,12.36L19.39,13.42L16.74,10.77L14.09,13.42L13.03,12.36L15.68,9.71L13.03,7.06M6.25,7.72H5V9H6.25C6.66,9 7,8.66 7,8.25V7.72C7,7.32 6.68,7 6.25,7.72M11,17H5V15.5H11V17M11,13H5V11.5H11V13M11,9H9V7.5H11V9Z"/>
    </svg>
  ),
};

const TrophyIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V7C19 8.1 18.1 9 17 9H15.82C15.4 9.84 14.7 10.54 13.83 10.97L15 12.05V14C15 14.55 14.55 15 14 15H10C9.45 15 9 14.55 9 14V12.05L10.17 10.97C9.3 10.54 8.6 9.84 8.18 9H7C5.9 9 5 8.1 5 7V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V7H7V6H5V7C5 7.55 5.45 8 6 8H7.82C8.2 8.16 8.6 8.26 9 8.31V3ZM15 3V8.31C15.4 8.26 15.8 8.16 16.18 8H18C18.55 8 19 7.55 19 7V6H17V7H15V3Z"/>
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
  </svg>
);

const getIconForCategory = (categoryName) => {
  const normalizedName = categoryName.toLowerCase();
  if (normalizedName.includes('vocabulary') || normalizedName.includes('vocab')) return CategoryIcons.Vocabulary;
  if (normalizedName.includes('comprehension') || normalizedName.includes('understanding')) return CategoryIcons.Comprehension;
  if (normalizedName.includes('fluency') || normalizedName.includes('speed')) return CategoryIcons.Fluency;
  if (normalizedName.includes('grammar') || normalizedName.includes('syntax')) return CategoryIcons.Grammar;
  if (normalizedName.includes('reading')) return CategoryIcons.Reading;
  if (normalizedName.includes('writing')) return CategoryIcons.Writing;
  if (normalizedName.includes('spelling')) return CategoryIcons.Spelling;
  if (normalizedName.includes('math') || normalizedName.includes('arithmetic')) return CategoryIcons.Math;
  return CategoryIcons.Reading;
};

export const ResultShareCardDetailed = React.forwardRef(
  ({ name, score, total, module, badge, level, classLevel, city, school, categoryScores }, ref) => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    const percentage = Math.round((score / total) * 100);
    const congratsMessage = "Outstanding Performance! 🎉"; // Fixed for consistency in sharing

    // Calculate rows needed for categories (2 per row)
    const categoryRows = Math.ceil((categoryScores?.length || 0) / 2);

    return (
      <div
        ref={ref}
        className="w-[480px] h-[640px] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          borderRadius: '32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 -left-8 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* Main card - NO SCROLLING */}
        <div className="relative w-full h-full bg-white/10 backdrop-blur-2xl rounded-[30px] border border-white/20 p-6 flex flex-col">
          
          {/* Compact Header */}
          <div className="text-center mb-3">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-1">
              <p className="text-white/90 text-xs font-medium">{currentDate}</p>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 line-clamp-1">{name}</h1>
            <div className="flex justify-center gap-2 text-white/80 text-xs">
              {classLevel && <span className="bg-white/15 px-2 py-0.5 rounded-full">{classLevel}</span>}
              {city && <span className="bg-white/15 px-2 py-0.5 rounded-full">📍 {city}</span>}
            </div>
          </div>

          {/* Achievement Section - More Compact */}
          <div className="flex flex-col items-center mb-3">
            <h2 className="text-sm font-bold text-yellow-300 mb-2">{congratsMessage}</h2>
            
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${levelColors[level]} flex items-center justify-center shadow-lg mb-2`}>
              <TrophyIcon className="w-7 h-7 text-yellow-100" />
            </div>
            
            <h3 className="text-sm font-bold text-yellow-300 mb-1">{badge}</h3>
            <p className="text-white/80 text-xs mb-3">Completed: <span className="font-medium">{module}</span></p>
            
            <div className="flex justify-center gap-4 w-full px-4">
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-2 rounded-lg">
                <div className="text-lg font-bold">{score}/{total}</div>
                <div className="text-xs">{percentage}%</div>
              </div>
              <div className={`bg-gradient-to-r ${levelColors[level]} text-white px-3 py-2 rounded-lg`}>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3 h-3" />
                  <span className="text-sm font-bold">{level}</span>
                </div>
                <div className="text-xs">Level</div>
              </div>
            </div>
          </div>

          {/* Category Scores - Auto-adjusted height */}
          <div 
            className="mt-2 mb-2"
            style={{ height: `${320 - (categoryRows * 80)}px` }} // Dynamic height calculation
          >
            <h4 className="text-white font-bold text-sm text-center mb-2">Category Performance</h4>
            <div className="grid grid-cols-2 gap-2">
              {categoryScores?.map((cat) => {
                const IconComponent = getIconForCategory(cat.name);
                const categoryPercentage = Math.round((cat.score / cat.total) * 100);
                const categoryColor = categoryColors[cat.name.split(' ')[0]] || "from-blue-400 to-blue-600";
                
                return (
                  <div key={cat.name} className="bg-white/15 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                        <IconComponent className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white text-xs font-bold">
                        {cat.score}/{cat.total}
                      </span>
                    </div>
                    <p className="text-white text-xs font-medium truncate mb-1">{cat.name}</p>
                    <div className="w-full bg-white/20 rounded-full h-1 mb-0.5">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${categoryColor}`}
                        style={{ width: `${categoryPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-white/70 text-xs text-right">{categoryPercentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-center pt-2">
            <p className="text-white/60 text-xs">MasterOfAlphabet.com</p>
          </div>
        </div>
      </div>
    );
  }
);

// Demo component with optimized data
const DemoCard = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
    <ResultShareCardDetailed
      name="Emma Johnson"
      score={87}
      total={100}
      module="Advanced Reading"
      badge="Reading Champion!"
      level="Master"
      classLevel="Grade 5"
      city="San Francisco"
      school="Golden Gate Elementary"
      categoryScores={[
        { name: "Vocabulary", score: 23, total: 25 },
        { name: "Comprehension", score: 24, total: 25 },
        { name: "Fluency", score: 21, total: 25 },
        { name: "Grammar", score: 19, total: 25 }
      ]}
    />
  </div>
);

export default DemoCard;