import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillsAssessmentBox from "../components/SkillsAssessmentBox";

const SkillsImprovementPage = () => {
  const [selectedMode, setSelectedMode] = useState("learn");
  const [selectedModule, setSelectedModule] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);

  const navigate = useNavigate();

  // Learning modes with their colors and descriptions
  const modes = [
    {
      key: "learn",
      label: "Learn",
      icon: "🧠",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      description: "Study new concepts and build foundational knowledge",
    },
    {
      key: "practice",
      label: "Practice",
      icon: "🏋️",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      description: "Apply your knowledge with guided exercises",
    },
    {
      key: "test",
      label: "Test",
      icon: "📊",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      description: "Assess your understanding with formal evaluations",
    },
    {
      key: "quiz",
      label: "Quiz",
      icon: "❔",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      description: "Quick knowledge checks and fun Q&A sessions",
    },
    {
      key: "battles",
      label: "Battles",
      icon: "⚡",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      description: "Compete with others in skill-based challenges",
    },
    {
      key: "challenges",
      label: "Challenges",
      icon: "🏅",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      description: "Push your limits with advanced tasks and achievements",
    },
  ];

  // English skill modules with updated names, icons, and colors
  const modules = [
    {
      key: "spelling",
      label: "Spelling",
      icon: "📖", // book-outline equivalent
      color: "bg-red-500", // #f44336
      hoverColor: "hover:bg-red-600",
      activities: {
        learn: "word patterns, spelling rules, and common exceptions",
        practice: "interactive spelling exercises and word games",
        test: "spelling accuracy assessments and progress tracking",
        quiz: "quick spelling challenges and memory games",
        battles: "head-to-head spelling competitions",
        challenges: "advanced spelling mastery tasks",
      },
    },
    {
      key: "reading",
      label: "Reading",
      icon: "👓", // reader-outline equivalent
      color: "bg-pink-600", // #e91e63
      hoverColor: "hover:bg-pink-700",
      activities: {
        learn: "comprehension strategies and reading techniques",
        practice: "guided reading with interactive questions",
        test: "reading comprehension assessments",
        quiz: "quick comprehension checks",
        battles: "reading speed and accuracy competitions",
        challenges: "complex text analysis tasks",
      },
    },
    {
      key: "pronunciation",
      label: "Pronunciation",
      icon: "🎤", // mic-outline equivalent
      color: "bg-purple-800", // #9c27b0
      hoverColor: "hover:bg-purple-900",
      activities: {
        learn: "phonetics, accent reduction, and speech clarity",
        practice: "pronunciation drills and exercises",
        test: "speech clarity assessments",
        quiz: "quick pronunciation checks",
        battles: "pronunciation accuracy competitions",
        challenges: "advanced phonetic tasks",
      },
    },
    {
      key: "grammar",
      label: "Grammar",
      icon: "📝", // create-outline equivalent
      color: "bg-indigo-700", // #673ab7
      hoverColor: "hover:bg-indigo-800",
      activities: {
        learn: "grammar rules, sentence structure, and usage",
        practice: "interactive grammar exercises",
        test: "grammar proficiency assessments",
        quiz: "quick grammar rule checks",
        battles: "grammar accuracy competitions",
        challenges: "complex grammar mastery tasks",
      },
    },
    {
      key: "writing",
      label: "Writing",
      icon: "✏️", // pencil-outline equivalent
      color: "bg-blue-700", // #3f51b5
      hoverColor: "hover:bg-blue-800",
      activities: {
        learn: "writing structures, styles, and techniques",
        practice: "guided writing exercises and prompts",
        test: "writing skill evaluations",
        quiz: "grammar and style quick checks",
        battles: "creative writing competitions",
        challenges: "advanced composition tasks",
      },
    },
    {
      key: "listening",
      label: "Listening",
      icon: "🎧", // headset-outline equivalent
      color: "bg-blue-500", // #2196f3
      hoverColor: "hover:bg-blue-600",
      activities: {
        learn: "listening strategies and audio comprehension",
        practice: "guided listening exercises",
        test: "listening comprehension assessments",
        quiz: "quick audio understanding checks",
        battles: "listening accuracy competitions",
        challenges: "complex audio analysis tasks",
      },
    },
    {
      key: "vocabulary",
      label: "Vocabulary",
      icon: "📚", // library-outline equivalent
      color: "bg-green-500", // #4caf50
      hoverColor: "hover:bg-green-600",
      activities: {
        learn: "new words, meanings, and usage contexts",
        practice: "vocabulary building exercises",
        test: "word knowledge assessments",
        quiz: "definition and synonym challenges",
        battles: "vocabulary competitions",
        challenges: "advanced word mastery tasks",
      },
    },
    {
      key: "sharp",
      label: "S.H.A.R.P",
      icon: "⚡", // flash-outline equivalent
      color: "bg-orange-500", // #ff9800
      hoverColor: "hover:bg-orange-600",
      activities: {
        learn: "synonyms, homonyms, antonyms, rhymes, and plurals",
        practice: "interactive SHARP exercises",
        test: "SHARP knowledge assessments",
        quiz: "quick SHARP challenges",
        battles: "SHARP competitions",
        challenges: "advanced SHARP tasks",
      },
    },
    {
      key: "all-in-one",
      label: "All-In-One",
      icon: "🌐", // or "🌟" for a star icon
      color: "bg-gradient-to-r from-purple-500 to-pink-500", // Gradient to make it stand out
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
      activities: {
        learn: "integrated English skills across all areas",
        practice: "comprehensive mixed exercises",
        test: "complete English proficiency assessment",
        quiz: "mixed skill quick evaluations",
        battles: "multi-skill competitions",
        challenges: "master-level English tasks",
      },
    },
  ];

  useEffect(() => {
    const mockStudentInfo = {
      name: "Student",
      grade: "5th Grade",
    };
    setStudentInfo(mockStudentInfo);
  }, []);

  const handleModuleClick = (moduleKey) => {
    setSelectedModule(moduleKey);
  };

  const generateNavigationPath = () => {
    if (!selectedMode || !selectedModule) return "";

    const basePath = "/improve-english-language-skills";
    return `${basePath}/${selectedMode}/${selectedModule}`;
  };

  const handleStartActivity = () => {
    if (selectedModule && selectedMode) {
      const path = generateNavigationPath();
      navigate(path);
    }
  };

  const handleTakeAssessment = () => {
    navigate("/skill-assessment");
  };

  const handleSkipToPractice = () => {
    // Scroll to mode selection or do nothing - user can proceed with current flow
    const modeSection = document.querySelector("[data-mode-section]");
    if (modeSection) {
      modeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getSelectedModeInfo = () => {
    return modes.find((mode) => mode.key === selectedMode);
  };

  const getSelectedModuleInfo = () => {
    return modules.find((module) => module.key === selectedModule);
  };

  const getActivityDescription = () => {
    const moduleInfo = getSelectedModuleInfo();
    if (moduleInfo && selectedMode) {
      return moduleInfo.activities[selectedMode];
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Skills Assessment Box */}

      <SkillsAssessmentBox
        onTakeAssessment={handleTakeAssessment}
        onSkipToPractice={handleSkipToPractice}
      />
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🌟 Skills Improvement
            </h1>
            <p className="text-lg text-gray-600">
              Choose your learning mode and select a skill to practice
            </p>
          </div>

          {/* Mode Selection Row */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-6"
            data-mode-section
          >
            {modes.map((mode) => (
              <button
                key={mode.key}
                onClick={() => setSelectedMode(mode.key)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
                  transform transition-all duration-300 shadow-lg
                  ${mode.color} ${mode.hoverColor}
                  ${
                    selectedMode === mode.key
                      ? "scale-110 ring-4 ring-white ring-opacity-50 shadow-2xl"
                      : "hover:scale-105"
                  }
                `}
              >
                <span className="text-xl">{mode.icon}</span>
                <span className="font-bold">{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Selected Mode Description */}
          {selectedMode && (
            <div className="text-center mb-6">
              <div
                className={`rounded-lg p-4 max-w-2xl mx-auto ${
                  getSelectedModeInfo()?.color
                } bg-opacity-20`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">
                    {getSelectedModeInfo()?.icon}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {getSelectedModeInfo()?.label} Mode
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {getSelectedModeInfo()?.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Skill Modules Selection */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Select a Skill Module
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {modules.map((module) => (
              <button
                key={module.key}
                onClick={() => handleModuleClick(module.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                  transform transition-all duration-300 shadow-md
                  ${
                    selectedModule === module.key
                      ? `${module.color} text-white scale-110 shadow-lg ring-2 ring-white ring-opacity-50`
                      : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-105"
                  }
                  ${module.hoverColor ? module.hoverColor : ""}
                `}
              >
                <span className="text-lg">{module.icon}</span>
                <span>{module.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity Description and Action */}
        {selectedModule && (
          <div
            className={`rounded-2xl shadow-lg p-8 max-w-3xl mx-auto ${
              getSelectedModuleInfo()?.color
            } bg-opacity-10 border ${
              getSelectedModuleInfo()?.color
            } border-opacity-30`}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl">{getSelectedModeInfo()?.icon}</span>
                <span className="text-3xl">
                  {getSelectedModuleInfo()?.icon}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {["learn", "practice", "test"].includes(selectedMode)
                  ? `${getSelectedModeInfo()?.label} ${
                      getSelectedModuleInfo()?.label
                    }`
                  : `${getSelectedModuleInfo()?.label} ${
                      getSelectedModeInfo()?.label
                    }`}
              </h3>
              <div
                className={`rounded-lg p-4 mb-6 ${
                  getSelectedModuleInfo()?.color
                } bg-opacity-20`}
              >
                <p className="text-gray-700">
                  <span className="font-semibold">You'll {selectedMode}: </span>
                  {getActivityDescription()}
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartActivity}
                className={`
                  px-8 py-4 rounded-xl font-bold text-white text-lg
                  transform transition-all duration-300 hover:scale-105 shadow-lg
                  ${getSelectedModeInfo()?.color} ${
                  getSelectedModeInfo()?.hoverColor
                }
                `}
              >
                <span>
                  {["learn", "practice", "test"].includes(selectedMode)
                    ? `Start ${getSelectedModeInfo()?.label}ing ${
                        getSelectedModuleInfo()?.label
                      } Skills`
                    : `Start ${getSelectedModuleInfo()?.label} ${
                        getSelectedModeInfo()?.label
                      }`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Placeholder when nothing selected */}
        {!selectedModule && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-gray-600">
              Select a skill module above to get started!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsImprovementPage;
