import React, { useState } from "react";
import { 
  BookOpen, Brain, Trophy, CheckCircle, Volume2, Eye, PenTool, Ear, Users, Star, School 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignInRequiredHero from "../components/SignInRequiredHero";

// Class Groups Data
const classGroups = [
  {
    value: "I-II",
    title: "Class I-II",
    desc: "Basic vocabulary and simple language concepts",
    icon: CheckCircle,
    color: "from-purple-400 to-purple-600",
    borderColor: "border-purple-500",
  },
  {
    value: "III-V",
    title: "Class III-V",
    desc: "Intermediate vocabulary and language skills",
    icon: BookOpen,
    color: "from-blue-400 to-blue-600",
    borderColor: "border-blue-500",
  },
  {
    value: "VI-X",
    title: "Class VI-X",
    desc: "Advanced vocabulary and complex language concepts",
    icon: School,
    color: "from-green-400 to-green-600",
    borderColor: "border-green-500",
  },
];

// Modules Data
const modules = [
  {
    key: "spelling",
    title: "Spelling",
    desc: "Test your spelling accuracy and word recognition.",
    icon: CheckCircle,
    color: "from-pink-400 to-pink-600",
    borderColor: "border-pink-500",
  },
  {
    key: "reading",
    title: "Reading",
    desc: "Analyze your reading comprehension and fluency.",
    icon: Eye,
    color: "from-cyan-400 to-cyan-600",
    borderColor: "border-cyan-500",
  },
  {
    key: "pronunciation",
    title: "Pronunciation",
    desc: "Evaluate your pronunciation and clarity.",
    icon: Volume2,
    color: "from-yellow-400 to-yellow-600",
    borderColor: "border-yellow-500",
  },
  {
    key: "grammar",
    title: "Grammar",
    desc: "Challenge your grammar and usage knowledge.",
    icon: BookOpen,
    color: "from-teal-400 to-teal-600",
    borderColor: "border-teal-500",
  },
  {
    key: "writing",
    title: "Writing",
    desc: "Assess your writing skills and expression.",
    icon: PenTool,
    color: "from-rose-400 to-rose-600",
    borderColor: "border-rose-500",
  },
  {
    key: "listening",
    title: "Listening",
    desc: "Test your listening comprehension.",
    icon: Ear,
    color: "from-lime-400 to-lime-600",
    borderColor: "border-lime-500",
  },
  {
    key: "vocabulary",
    title: "Vocabulary",
    desc: "Measure your vocabulary and word usage.",
    icon: BookOpen,
    color: "from-indigo-400 to-indigo-600",
    borderColor: "border-indigo-500",
  },
  {
    key: "sharp",
    title: "S.H.A.R.P",
    desc: "Synonyms, Homonyms, Antonyms, Rhyming, Plurals.",
    icon: Users,
    color: "from-emerald-400 to-emerald-600",
    borderColor: "border-emerald-500",
  },
  {
    key: "8-in-1",
    title: "8-In-1",
    desc: "All 8 modules in a single assessment.",
    icon: Star,
    color: "from-orange-400 to-orange-600",
    borderColor: "border-orange-500",
  },
];

// Activity Options
const activityOptions = [
  {
    key: "learn",
    label: "LEARN",
    icon: School,
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-500",
  },
  {
    key: "practice",
    label: "PRACTICE",
    icon: Brain,
    color: "from-purple-500 to-purple-700",
    borderColor: "border-purple-500",
  },
  {
    key: "test",
    label: "TEST",
    icon: Trophy,
    color: "from-orange-500 to-orange-700",
    borderColor: "border-orange-500",
  },
];

export default function SkillsHubPage() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState("test");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const isSignedIn = false; // Replace with actual auth logic

  const handleClick = () => {
    if (!isSignedIn) return;
    if (selectedClass !== null && selectedModule !== null) {
      navigate("/test-spelling-skills", {
        state: { classGroup: selectedClass },
      });
    }
  };

  const isDisabled = !isSignedIn || selectedClass === null || selectedModule === null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto relative">

        {!isSignedIn && (
          <div className="absolute inset-0 z-50 flex items-center justify-center 
            bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-[1px] rounded-3xl">
            <div className="max-w-5xl w-full bg-white/90 rounded-3xl shadow-xl border border-white/40 p-6">
              <SignInRequiredHero />
            </div>
          </div>
        )}

        <div className={`bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 relative ${!isSignedIn ? 'pointer-events-none opacity-60' : ''}`}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 tracking-tight">
              What would you like to do today?
            </h1>
          </div>

          {/* Activity Options */}
          <div className="flex justify-center items-center gap-8 mb-12">
            {activityOptions.map((opt) => {
              const IconComponent = opt.icon;
              return (
                <div
                  key={opt.key}
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${activity === opt.key ? "scale-110" : ""}`}
                  onClick={() => setActivity(opt.key)}
                >
                  <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${activity === opt.key ? `${opt.borderColor} shadow-2xl` : "border-gray-200 hover:border-gray-300"} min-w-32 text-center`}>
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${opt.color} flex items-center justify-center`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <p className={`font-black text-xl tracking-wide ${activity === opt.key ? "text-gray-800" : "text-gray-600"}`}>
                      {opt.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class Groups */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
              Select Your Class Group
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classGroups.map((group, index) => {
                const IconComponent = group.icon;
                return (
                  <div
                    key={group.value}
                    className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedClass === index ? "scale-105" : ""}`}
                    onClick={() => setSelectedClass(index)}
                  >
                    <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${selectedClass === index ? `${group.borderColor} shadow-2xl` : "border-gray-200 hover:border-gray-300"} h-48 flex flex-col items-center justify-center text-center`}>
                      <div className={`w-16 h-16 mb-4 rounded-xl bg-gradient-to-r ${group.color} flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 mb-2">{group.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{group.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modules Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
              Select a Module to Assess
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {modules.map((mod, index) => {
                const IconComponent = mod.icon;
                return (
                  <div
                    key={mod.key}
                    className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedModule === index ? "scale-105" : ""}`}
                    onClick={() => setSelectedModule(index)}
                  >
                    <div className={`bg-white rounded-2xl p-4 shadow-lg border-2 ${selectedModule === index ? `${mod.borderColor} shadow-2xl` : "border-gray-200 hover:border-gray-300"} h-40 flex flex-col items-center justify-center text-center`}>
                      <div className={`w-12 h-12 mb-3 rounded-xl bg-gradient-to-r ${mod.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 mb-1">{mod.title}</h3>
                      <p className="text-gray-600 text-xs leading-tight">{mod.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center mt-12">
            <button
              onClick={handleClick}
              disabled={isDisabled}
              className={`px-8 py-4 text-xl font-black rounded-2xl transition-all duration-300 transform ${
                isDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {activity === "test" && selectedModule != null
                ? `Start ${modules[selectedModule].title} Test`
                : activity === "learn" && selectedModule != null
                ? `Start ${modules[selectedModule].title} Lesson`
                : activity === "practice" && selectedModule != null
                ? `Start ${modules[selectedModule].title} Practice`
                : "Start"}
            </button>
            {!isSignedIn && (
              <p className="mt-4 text-sm text-red-500 font-medium">
                Sign in to start learning, practicing or testing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}