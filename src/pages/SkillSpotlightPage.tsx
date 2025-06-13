import React, { useState, useEffect } from "react";
import { 
  BookOpen, Lightbulb, PenTool, GraduationCap, 
  Volume2, Mic, Brain, Award, Zap, ChevronLeft, 
  ChevronRight, Play, CheckCircle, XCircle, Star,
  Trophy, Target, ArrowRight
} from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
};

const modules = [
  { 
    label: "Spelling", 
    icon: <Lightbulb className="w-6 h-6" />, 
    key: "spelling",
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  { 
    label: "Reading", 
    icon: <BookOpen className="w-6 h-6" />, 
    key: "reading",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  { 
    label: "Grammar", 
    icon: <PenTool className="w-6 h-6" />, 
    key: "grammar",
    gradient: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    label: "Writing", 
    icon: <GraduationCap className="w-6 h-6" />, 
    key: "writing",
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  { 
    label: "Listening", 
    icon: <Volume2 className="w-6 h-6" />, 
    key: "listening",
    gradient: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    label: "Pronunciation", 
    icon: <Mic className="w-6 h-6" />, 
    key: "pronunciation",
    gradient: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200"
  },
  { 
    label: "Vocabulary", 
    icon: <Brain className="w-6 h-6" />, 
    key: "vocabulary",
    gradient: "from-red-400 to-pink-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  { 
    label: "S.H.A.R.P", 
    icon: <Target className="w-6 h-6" />, 
    key: "sharp",
    gradient: "from-indigo-400 to-purple-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200"
  },
  { 
    label: "8-In-1", 
    icon: <Award className="w-6 h-6" />, 
    key: "eight-in-one",
    gradient: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200"
  },
];

const classGroups = [
  { label: "Class I-II", value: "I-II", emoji: "🌱", description: "Foundation Level" },
  { label: "Class III-V", value: "III-V", emoji: "🌿", description: "Growing Stage" },
  { label: "Class VI-X", value: "VI-X", emoji: "🌳", description: "Advanced Level" },
];

const skillData = {
  spelling: {
    "I-II": [
      {
        tip: "Silent Letters Magic",
        audio: "",
        explanation: "Silent letters are sneaky letters that hide in words! They're written but not spoken. It's like a magic trick in spelling! 🎩✨",
        example: { 
          question: "Which letter is playing hide-and-seek in 'knock'?", 
          options: ["K", "N", "O"], 
          answer: "K",
          hint: "Think about what you hear when you say the word!"
        },
        practice: { 
          question: "Find the silent letter hiding in 'lamb' 🐑", 
          answer: "b",
          hint: "The last letter is being very quiet!"
        },
        quiz: { 
          question: "Which letter is invisible in 'ghost' 👻?", 
          options: ["g", "h", "t"], 
          answer: "h",
          hint: "Boo! One letter is hiding!"
        },
        summary: "Silent letters love to play hide-and-seek! The more you practice, the better you become at finding them. Keep practicing to become a Silent Letter Detective! 🕵️‍♀️",
        difficulty: "Easy",
        points: 50
      },
      {
        tip: "Double Letter Power",
        audio: "",
        explanation: "When we add -ing or -ed to some words, we double the last consonant to keep the vowel sound short and strong! It's like giving the consonant a buddy! 👯‍♀️",
        example: { 
          question: "What happens when 'run' meets '-ing'?", 
          options: ["runing", "running", "runnnig"], 
          answer: "running",
          hint: "The 'n' needs a friend!"
        },
        practice: { 
          question: "How do you spell 'hop' + 'ing'? 🐰", 
          answer: "hopping",
          hint: "The 'p' wants to double up!"
        },
        quiz: { 
          question: "Which spelling is the superhero version?", 
          options: ["stoping", "stopping"], 
          answer: "stopping",
          hint: "Double the power, double the letters!"
        },
        summary: "Double consonants are like having a superhero team! They work together to keep vowels short and make spelling strong. Practice makes perfect! 💪",
        difficulty: "Medium",
        points: 75
      }
    ]
  }
};

const STEP_KEYS = ["Tip", "Explanation", "Example", "Practice", "Quiz", "Results", "Summary"];

export default function SkillSpotlightPage() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedModule, setSelectedModule] = useState("spelling");
  const [classGroup, setClassGroup] = useState("I-II");
  const [tipIndex, setTipIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [practiceInput, setPracticeInput] = useState("");
  const [quizInput, setQuizInput] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const currentModuleData = modules.find(m => m.key === selectedModule);
  const tipsArr = skillData[selectedModule]?.[classGroup] || [];
  const tipCount = tipsArr.length;
  const currentTip = tipsArr[tipIndex] || {};

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    setParticles(newParticles);
  }, []);

  const handleModuleSelect = (key: string) => {
    setSelectedModule(key);
    resetProgress();
  };

  const handleGroupSelect = (val: string) => {
    setClassGroup(val);
    resetProgress();
  };

  const resetProgress = () => {
    setTipIndex(0);
    setStep(0);
    setPracticeInput("");
    setQuizInput("");
    setExampleInput("");
    setShowSummary(false);
  };

  const handleTipNav = (delta: number) => {
    const newIndex = tipIndex + delta;
    if (newIndex >= 0 && newIndex < tipCount) {
      setTipIndex(newIndex);
      resetProgress();
    }
  };

  const goStep = (toStep: number) => {
    setStep(toStep);
    setShowSummary(false);
  };

  const isPracticeCorrect = practiceInput.trim().toLowerCase() === (currentTip.practice?.answer || "").toLowerCase();
  const isQuizCorrect = quizInput === currentTip.quiz?.answer;
  const isExampleCorrect = exampleInput === currentTip.example?.answer;

  const handleCorrectAnswer = (points = 10) => {
    setScore(prev => prev + points);
    setCurrentStreak(prev => prev + 1);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const stepButtons = [
    { label: "💡 Tip", key: "Tip", visible: true, color: "bg-yellow-500" },
    { label: "📚 Learn", key: "Explanation", visible: true, color: "bg-blue-500" },
    { label: "🎯 Example", key: "Example", visible: !!currentTip.example, color: "bg-green-500" },
    { label: "✏️ Practice", key: "Practice", visible: !!currentTip.practice, color: "bg-purple-500" },
    { label: "🧠 Quiz", key: "Quiz", visible: !!currentTip.quiz, color: "bg-pink-500" },
    { label: "📊 Results", key: "Results", visible: true, color: "bg-indigo-500" },
    { label: "📝 Summary", key: "Summary", visible: true, color: "bg-teal-500" },
  ].filter(b => b.visible);

  const renderStepContent = () => {
    if (!currentTip) return null;
    
    switch (STEP_KEYS[step]) {
      case "Tip":
        return (
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-3xl font-bold shadow-lg">
              💡
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentTip.tip}
            </h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-blue-100 rounded-full">{currentTip.difficulty}</span>
              <span className="px-3 py-1 bg-green-100 rounded-full">{currentTip.points} points</span>
            </div>
          </div>
        );

      case "Explanation":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                  📚
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Let's Learn!</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{currentTip.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "Example":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-gray-800">Try This Example!</h3>
              </div>
              <p className="text-lg text-gray-700 mb-4">{currentTip.example?.question}</p>
              <div className="flex flex-wrap gap-3">
                {currentTip.example?.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setExampleInput(opt);
                      if (opt === currentTip.example?.answer) {
                        handleCorrectAnswer(25);
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      exampleInput === opt
                        ? opt === currentTip.example?.answer
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-red-500 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {exampleInput && (
                <div className={`mt-4 p-4 rounded-xl flex items-center space-x-2 ${
                  isExampleCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isExampleCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-semibold">
                    {isExampleCorrect ? '🎉 Amazing! You got it right!' : '💪 Keep trying! You can do it!'}
                  </span>
                </div>
              )}
              {exampleInput && !isExampleCorrect && currentTip.example?.hint && (
                <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-lg flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">Hint: {currentTip.example.hint}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "Practice":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                  ✏️
                </div>
                <h3 className="text-xl font-bold text-gray-800">Quick Practice</h3>
              </div>
              <p className="text-lg text-gray-700 mb-4">{currentTip.practice?.question}</p>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={practiceInput}
                  onChange={(e) => setPracticeInput(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-400 focus:outline-none transition-colors"
                />
                <button
                  onClick={() => {
                    if (isPracticeCorrect) {
                      handleCorrectAnswer(50);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  CHECK ✓
                </button>
              </div>
              {practiceInput && (
                <div className={`mt-4 p-4 rounded-xl flex items-center space-x-2 ${
                  isPracticeCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {isPracticeCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-semibold">
                    {isPracticeCorrect ? '🌟 Perfect! You nailed it!' : '🤔 Not quite right, but keep going!'}
                  </span>
                </div>
              )}
              {practiceInput && !isPracticeCorrect && currentTip.practice?.hint && (
                <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-lg flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">Hint: {currentTip.practice.hint}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "Quiz":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-2xl border border-pink-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white">
                  🧠
                </div>
                <h3 className="text-xl font-bold text-gray-800">Quiz Time!</h3>
              </div>
              <p className="text-lg text-gray-700 mb-4">{currentTip.quiz?.question}</p>
              <div className="flex flex-wrap gap-3">
                {currentTip.quiz?.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setQuizInput(opt);
                      if (opt === currentTip.quiz?.answer) {
                        handleCorrectAnswer(75);
                      }
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      quizInput === opt
                        ? opt === currentTip.quiz?.answer
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-red-500 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizInput && (
                <div className={`mt-4 p-4 rounded-xl flex items-center space-x-2 ${
                  isQuizCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isQuizCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="font-semibold">
                    {isQuizCorrect ? '🚀 Brilliant! You are on fire!' : '📚 Good try! Learning is a journey!'}
                  </span>
                </div>
              )}
              {quizInput && !isQuizCorrect && currentTip.quiz?.hint && (
                <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-lg flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm">Hint: {currentTip.quiz.hint}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "Results":
        const totalCorrect = (isExampleCorrect ? 1 : 0) + (isPracticeCorrect ? 1 : 0) + (isQuizCorrect ? 1 : 0);
        const totalQuestions = (currentTip.example ? 1 : 0) + (currentTip.practice ? 1 : 0) + (currentTip.quiz ? 1 : 0);
        const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-4xl font-bold shadow-xl mb-4">
                {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '💪'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Amazing Results!</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-4">
                {percentage}%
              </div>
            </div>
            
            <div className="grid gap-4">
              {currentTip.example && (
                <div className={`p-4 rounded-xl flex items-center justify-between ${
                  isExampleCorrect ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
                }`}>
                  <span className="font-semibold">Example Question</span>
                  <div className="flex items-center space-x-2">
                    {isExampleCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className={isExampleCorrect ? 'text-green-800' : 'text-red-800'}>
                      {isExampleCorrect ? 'Correct! +25 pts' : 'Try again!'}
                    </span>
                  </div>
                </div>
              )}
              
              {currentTip.practice && (
                <div className={`p-4 rounded-xl flex items-center justify-between ${
                  isPracticeCorrect ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
                }`}>
                  <span className="font-semibold">Practice Exercise</span>
                  <div className="flex items-center space-x-2">
                    {isPracticeCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className={isPracticeCorrect ? 'text-green-800' : 'text-red-800'}>
                      {isPracticeCorrect ? 'Excellent! +50 pts' : 'Keep practicing!'}
                    </span>
                  </div>
                </div>
              )}
              
              {currentTip.quiz && (
                <div className={`p-4 rounded-xl flex items-center justify-between ${
                  isQuizCorrect ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
                }`}>
                  <span className="font-semibold">Quiz Challenge</span>
                  <div className="flex items-center space-x-2">
                    {isQuizCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                    <span className={isQuizCorrect ? 'text-green-800' : 'text-red-800'}>
                      {isQuizCorrect ? 'Outstanding! +75 pts' : 'Almost there!'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-800">
                {percentage >= 80 ? '🎉 Fantastic! You are a spelling superstar!' :
                 percentage >= 60 ? '👏 Great job! You are learning so well!' :
                 '💪 Keep going! Every step makes you stronger!'}
              </p>
              <p className="text-sm text-gray-600 mt-2">Total Score: {score} points | Streak: {currentStreak}</p>
            </div>
          </div>
        );

      case "Summary":
        return renderSummary();

      default:
        return null;
    }
  };

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Complete Learning Summary
        </h2>
        <p className="text-gray-600">Everything you learned in one beautiful place! 📚✨</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
            💡
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{currentTip.tip}</h3>
            <p className="text-gray-600">{currentTip.difficulty} • {currentTip.points} points</p>
          </div>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed">{currentTip.explanation}</p>
      </div>

      {currentTip.example && (
        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">🎯</div>
            <h4 className="text-lg font-bold text-gray-800">Example</h4>
          </div>
          <p className="text-gray-700 mb-3">{currentTip.example.question}</p>
          <div className="flex space-x-2">
            {currentTip.example.options.map(opt => (
              <span
                key={opt}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  opt === currentTip.example.answer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {opt} {opt === currentTip.example.answer && '✓'}
              </span>
            ))}
          </div>
        </div>
      )}

      {currentTip.practice && (
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">✏️</div>
            <h4 className="text-lg font-bold text-gray-800">Practice</h4>
          </div>
          <p className="text-gray-700 mb-2">{currentTip.practice.question}</p>
          <div className="bg-white p-3 rounded-lg border">
            <span className="text-sm text-gray-500">Answer: </span>
            <span className="font-semibold text-purple-600">{currentTip.practice.answer}</span>
          </div>
        </div>
      )}

      {currentTip.quiz && (
        <div className="bg-pink-50 p-6 rounded-2xl border border-pink-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">🧠</div>
            <h4 className="text-lg font-bold text-gray-800">Quiz</h4>
          </div>
          <p className="text-gray-700 mb-3">{currentTip.quiz.question}</p>
          <div className="flex space-x-2">
            {currentTip.quiz.options.map(opt => (
              <span
                key={opt}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  opt === currentTip.quiz.answer 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {opt} {opt === currentTip.quiz.answer && '✓'}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">📝</div>
          <h4 className="text-lg font-bold text-gray-800">Key Takeaway</h4>
        </div>
        <p className="text-gray-700 leading-relaxed">{currentTip.summary}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-300 to-purple-300 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `float ${particle.speed}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Skill Spotlight ✨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Embark on an amazing learning adventure! Master new skills with interactive lessons, fun quizzes, and instant feedback.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">Score: {score}</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-800">Streak: {currentStreak}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Choose Your Learning Module</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {modules.map((mod) => (
              <div
                key={mod.key}
                onClick={() => handleModuleSelect(mod.key)}
                className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedModule === mod.key ? 'scale-105' : ''
                }`}
              >
                <div className={`
                  p-6 rounded-2xl shadow-lg border-2 transition-all duration-300
                  ${selectedModule === mod.key 
                    ? `bg-gradient-to-br ${mod.gradient} text-white border-white shadow-2xl` 
                    : `${mod.bgColor} ${mod.borderColor} hover:shadow-xl`
                  }
                `}>
                  <div className="text-center">
                    <div className={`
                      w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300
                      ${selectedModule === mod.key 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white shadow-md text-gray-600 group-hover:shadow-lg'
                      }
                    `}>
                      {mod.icon}
                    </div>
                    <h3 className={`
                      font-bold text-lg transition-colors duration-300
                      ${selectedModule === mod.key ? 'text-white' : 'text-gray-800 group-hover:text-gray-900'}
                    `}>
                      {mod.label}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Select Your Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classGroups.map((cg) => (
              <button
                key={cg.value}
                onClick={() => handleGroupSelect(cg.value)}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                  ${classGroup === cg.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-white shadow-2xl scale-105'
                    : 'bg-white border-gray-200 text-gray-800 hover:border-indigo-300 hover:shadow-lg'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{cg.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{cg.label}</h3>
                  <p className={`text-sm ${classGroup === cg.value ? 'text-white/80' : 'text-gray-600'}`}>
                    {cg.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {tipCount > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleTipNav(-1)}
                  disabled={tipIndex === 0}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300
                    ${tipIndex === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transform hover:scale-105'
                    }
                  `}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {tipIndex + 1} / {tipCount}
                  </div>
                  <div className="text-sm text-gray-600">Learning Tips</div>
                </div>
                
                <button
                  onClick={() => handleTipNav(1)}
                  disabled={tipIndex === tipCount - 1}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300
                    ${tipIndex === tipCount - 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg transform hover:scale-105'
                    }
                  `}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTip && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                <div className="flex flex-wrap justify-center gap-3">
                  {stepButtons.map((btn, idx) => (
                    <button
                      key={btn.key}
                      onClick={() => goStep(STEP_KEYS.indexOf(btn.key))}
                      className={`
                        px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                        ${STEP_KEYS[step] === btn.key
                          ? `${btn.color} text-white shadow-lg scale-105`
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 min-h-[500px]">
                {renderStepContent()}
              </div>
            </div>
          </div>
        )}

        {!currentTip && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Learn?</h3>
              <p className="text-gray-600 text-lg">
                Select a module and your level to start your amazing learning journey!
              </p>
            </div>
          </div>
        )}
      </div>

<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {particles.map(particle => (
    <div
      key={particle.id}
      className="absolute rounded-full bg-gradient-to-r from-blue-300 to-purple-300"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        opacity: particle.opacity,
        animation: `float ${particle.speed}s ease-in-out infinite alternate`
      }}
    />
  ))}
</div>
    </div>
  );
}