import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Brain, Mic, PenTool, GraduationCap,
  Lightbulb, CheckSquare, Settings, UserPlus, Award, Target, Trophy, PlayCircle, Rocket
} from "lucide-react";

// Student Form component (re-styled with Tailwind)
interface StudentBasicFormProps {
  value: { name: string; classLevel: string; parentMobile: string };
  onChange: (form: { name: string; classLevel: string; parentMobile: string }) => void;
}

function StudentBasicForm({ value, onChange }: StudentBasicFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    onChange({ ...value, [name]: inputValue });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Student Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={value.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          placeholder="e.g., Emily White"
          required
        />
      </div>
      <div>
        <label htmlFor="classLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Class Level <span className="text-red-500">*</span>
        </label>
        <select
          id="classLevel"
          name="classLevel"
          value={value.classLevel}
          onChange={(e) => handleChange(e as any)} // Cast as any because select's onChange doesn't match input's
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          required
        >
          <option value="">Select Class</option>
          <option value="I-II">Class I-II</option>
          <option value="III-V">Class III-V</option>
          <option value="VI-X">Class VI-X</option>
        </select>
      </div>
      <div>
        <label htmlFor="parentMobile" className="block text-sm font-medium text-gray-700 mb-1">
          Parent Mobile <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="parentMobile"
          name="parentMobile"
          value={value.parentMobile}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
          placeholder="e.g., 9876543210"
          required
        />
      </div>
    </div>
  );
}

// Module data with enhanced styling properties
const modules = [
  {
    title: "Spelling",
    desc: "Master tricky words, improve accuracy.",
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    color: "bg-yellow-100 border-yellow-200 hover:border-yellow-400",
    hoverShadow: "hover:shadow-yellow-200",
    key: "spelling",
  },
  {
    title: "Reading",
    desc: "Boost comprehension and fluency.",
    icon: <BookOpen className="w-8 h-8 text-green-500" />,
    color: "bg-green-100 border-green-200 hover:border-green-400",
    hoverShadow: "hover:shadow-green-200",
    key: "reading",
  },
  {
    title: "Grammar",
    desc: "Learn rules for perfect sentences.",
    icon: <PenTool className="w-8 h-8 text-purple-500" />,
    color: "bg-purple-100 border-purple-200 hover:border-purple-400",
    hoverShadow: "hover:shadow-purple-200",
    key: "grammar",
  },
  {
    title: "Writing",
    desc: "Express ideas clearly and creatively.",
    icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
    color: "bg-blue-100 border-blue-200 hover:border-blue-400",
    hoverShadow: "hover:shadow-blue-200",
    key: "writing",
  },
  {
    title: "Listening",
    desc: "Sharpen listening and retention skills.",
    icon: <Mic className="w-8 h-8 text-indigo-500" />,
    color: "bg-indigo-100 border-indigo-200 hover:border-indigo-400",
    hoverShadow: "hover:shadow-indigo-200",
    key: "listening",
  },
  {
    title: "Vocabulary",
    desc: "Expand your word power daily.",
    icon: <Brain className="w-8 h-8 text-red-500" />,
    color: "bg-red-100 border-red-200 hover:border-red-400",
    hoverShadow: "hover:shadow-red-200",
    key: "vocabulary",
  },
];

export default function HubPage() {
  const navigate = useNavigate();

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [activity, setActivity] = useState<"learn" | "practice" | "test">("learn");

  const [studentForm, setStudentForm] = useState({
    name: "",
    classLevel: "",
    parentMobile: "",
  });

  const hasStudentInfo =
    studentForm.name.trim() !== "" &&
    studentForm.classLevel.trim() !== "" &&
    studentForm.parentMobile.trim() !== "";

  const handleModuleStart = () => {
    if (selectedModule !== null && selectedClass !== null && hasStudentInfo) {
      const moduleKey = modules[selectedModule].key;
      // Example navigation logic - adjust as per your actual routes
      navigate(`/skills/${moduleKey}/${selectedClass}/${activity}`);
    } else {
      alert("Please fill in student details, select a module, and a class level.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-4">
          Master English, Ignite Your Future!
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Welcome to your personalized English learning hub. Dive into interactive lessons, challenging practices, and fun tests designed to make you shine!
        </p>
        <button
          onClick={() => {
            // Smooth scroll to the student form section
            document.getElementById('student-onboarding-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out animate-pop-in"
        >
          <PlayCircle className="w-6 h-6 mr-3" /> Start Your Journey!
        </button>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Why Our App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-b-4 border-blue-500 animate-fade-in-up transition-all duration-300 hover:scale-105">
            <Rocket className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Accelerated Learning</h3>
            <p className="text-gray-600">Our adaptive lessons are tailored for rapid skill development.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-b-4 border-green-500 animate-fade-in-up transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s' }}>
            <CheckSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comprehensive Curriculum</h3>
            <p className="text-gray-600">Covering all aspects: grammar, reading, writing, and more.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-b-4 border-purple-500 animate-fade-in-up transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
            <Trophy className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fun & Engaging</h3>
            <p className="text-gray-600">Gamified learning paths keep students motivated and excited.</p>
          </div>
        </div>
      </div>

      {/* Student Onboarding Form */}
      <div id="student-onboarding-section" className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 mb-16 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Tell Us About Yourself!</h2>
        <StudentBasicForm value={studentForm} onChange={setStudentForm} />
        {!hasStudentInfo && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2 animate-fade-in-up">
            <Lightbulb className="w-5 h-5" />
            <p className="text-sm font-medium">Please fill in all your details to unlock the learning journey!</p>
          </div>
        )}
      </div>

      {/* Module Selection */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Choose Your Skill Module</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
            <div
              key={mod.key}
              onClick={() => setSelectedModule(index)}
              className={`
                group p-6 rounded-2xl border-2 transition-all duration-300 transform cursor-pointer relative overflow-hidden
                ${mod.color} ${mod.hoverShadow}
                ${selectedModule === index
                  ? 'border-4 border-blue-500 shadow-xl scale-105 bg-white' // Stronger selected state
                  : 'shadow-md hover:shadow-lg hover:scale-[1.02]'
                }
                animate-fade-in-up
              `}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Optional: Add a subtle overlay for selected state */}
              {selectedModule === index && (
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl pointer-events-none"></div>
              )}
              <div className="flex items-center space-x-4 mb-4">
                <div className={`
                  w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300
                  ${selectedModule === index
                    ? 'bg-blue-500 text-white shadow-lg' // Icon background when selected
                    : 'bg-white group-hover:bg-blue-50 text-gray-700'
                  }
                `}>
                  {mod.icon}
                </div>
                <h3 className={`text-xl font-bold ${selectedModule === index ? 'text-blue-700' : 'text-gray-900'}`}>
                  {mod.title}
                </h3>
              </div>
              <p className="text-gray-600 group-hover:text-gray-700">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Class Level and Activity Selection */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Set Your Learning Path</h2>

          {/* Class Level Selector */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Your Class Level:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["I-II", "III-V", "VI-X"].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedClass(level)}
                  className={`
                    px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform
                    ${selectedClass === level
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:scale-[1.02]'
                    }
                    ${!hasStudentInfo ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={!hasStudentInfo}
                >
                  Class {level}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type Selector */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Activity:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["learn", "practice", "test"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActivity(type as "learn" | "practice" | "test")}
                  className={`
                    px-6 py-3 rounded-xl font-semibold text-lg capitalize transition-all duration-300 transform
                    ${activity === type
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:scale-[1.02]'
                    }
                    ${!hasStudentInfo || selectedClass === null ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={!hasStudentInfo || selectedClass === null}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <button
          onClick={handleModuleStart}
          disabled={!hasStudentInfo || selectedModule === null || selectedClass === null}
          className={`
            inline-flex items-center px-10 py-5 rounded-full text-white text-xl font-black shadow-lg transition-all duration-300 transform
            ${!hasStudentInfo || selectedModule === null || selectedClass === null
              ? 'bg-gray-400 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 hover:shadow-xl hover:scale-105 animate-pop-in'
            }
          `}
        >
          {selectedModule !== null
            ? `Start ${modules[selectedModule].title} ${activity.charAt(0).toUpperCase() + activity.slice(1)}`
            : "Start Learning Now!"}
          <PlayCircle className="w-7 h-7 ml-4" />
        </button>
      </div>

      {/* Footer / Call to action for parents */}
      <div className="max-w-4xl mx-auto text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          Questions or need support? Visit our <a href="#" className="text-blue-600 hover:underline font-semibold">Help Center</a> or contact us.
        </p>
        <p className="text-sm text-gray-500">
          © 2025 English Spark. All rights reserved.
        </p>
      </div>
    </div>
  );
}