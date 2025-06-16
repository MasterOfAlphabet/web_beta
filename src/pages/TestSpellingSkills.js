import React, { useState, useEffect } from 'react';
import { Clock, Volume2, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, Trophy, Star, Sparkles } from 'lucide-react';

// Mock data - keeping the original structure
const spellingSkillsAssessmentData_I_II = {
  classGroup: "I-II",
  categories: [
    {
      name: "Dictation",
      description: "Listen to the word and type it correctly.",
      questions: [
        { id: 1, word: "apple", answer: "apple" },
        { id: 2, word: "pen", answer: "pen" },
        { id: 3, word: "cake", answer: "cake" },
        { id: 4, word: "fish", answer: "fish" },
      ],
    },
    {
      name: "Find the Correct Spelling (MCQ)",
      description: "Choose the correctly spelled word from four options.",
      questions: [
        {
          id: 5,
          question: "Which is the correct spelling?",
          options: ["hous", "hose", "house", "huse"],
          answer: "house",
        },
        {
          id: 6,
          question: "Which is the correct spelling?",
          options: ["flor", "flower", "floer", "flowr"],
          answer: "flower",
        },
      ],
    },
    {
      name: "Find the Missing Letter",
      description: "Fill in the missing letter to complete the word.",
      questions: [
        {
          id: 7,
          word: "c _ t",
          hint: "A pet that says meow.",
          answer: "cat",
        },
        {
          id: 8,
          word: "b _ _ l",
          hint: "You play with this.",
          answer: "ball",
        },
      ],
    },
    {
      name: "Spell the Pic",
      description: "Type the word that matches the picture shown.",
      questions: [
        { id: 9, image: "apple.jpg", answer: "apple" },
        { id: 10, image: "dog.jpg", answer: "dog" },
      ],
    },
  ],
};

const picImages = {
  "apple.jpg": "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  "dog.jpg": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
};

function getLearningLevel(score) {
  if (score <= 2) return { level: "Rookie", color: "text-amber-600", bg: "bg-amber-100", icon: "🌱" };
  if (score <= 4) return { level: "Racer", color: "text-blue-600", bg: "bg-blue-100", icon: "🏃" };
  if (score <= 6) return { level: "Master", color: "text-purple-600", bg: "bg-purple-100", icon: "🎯" };
  if (score <= 8) return { level: "Prodigy", color: "text-green-600", bg: "bg-green-100", icon: "🧠" };
  return { level: "Wizard", color: "text-pink-600", bg: "bg-pink-100", icon: "🧙‍♂️" };
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }
}

export default function SpellingAssessment() {
  // Mock student data
  const student = {
    name: "Alex Johnson",
    classLevel: "Class II",
    parentMobile: "+1-555-0123",
    city: "New York",
    school: "Sunshine Elementary"
  };
  const classGroup = "I-II";
  
  const data = spellingSkillsAssessmentData_I_II;
  
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(60 * 60); // 60 minutes
  const [submitted, setSubmitted] = useState(false);
  const [catOpen, setCatOpen] = useState({});

  // Timer effect
  useEffect(() => {
    if (submitted) return;
    if (timer <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer, submitted]);

  const allQuestions = data.categories.flatMap((cat) =>
    cat.questions.map((q) => ({
      ...q,
      category: cat.name,
    }))
  );

  const score = allQuestions.reduce(
    (acc, q) =>
      (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase()
        ? acc + 1
        : acc),
    0
  );

  const learningLevelData = getLearningLevel(score);
  
  const categoryScores = data.categories.map(cat => ({
    name: cat.name,
    score: cat.questions.reduce((acc, q) =>
      answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase() ? acc + 1 : acc, 0
    ),
    total: cat.questions.length,
  }));

  const handleAnswer = (qid, val) => setAnswers((prev) => ({ ...prev, [qid]: val }));
  const handleNext = () => setCurrentQ((q) => Math.min(q + 1, allQuestions.length - 1));
  const handlePrev = () => setCurrentQ((q) => Math.max(q - 1, 0));
  const handleSubmit = () => setSubmitted(true);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentQuestion = allQuestions[currentQ];
  const currentCategory = data.categories.find(cat => 
    cat.questions.some(q => q.id === currentQuestion?.id)
  );

  // Question renderers
  const renderQuestion = (q, cat) => {
    if (cat.name === "Dictation") {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <button
              onClick={() => speak(q.word)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Volume2 className="w-6 h-6 group-hover:animate-pulse" />
              <span>Listen & Type</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
            </button>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              disabled={submitted}
              className="w-full max-w-md px-6 py-4 text-lg font-medium text-center border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white shadow-sm"
              placeholder="Type what you hear..."
            />
          </div>
        </div>
      );
    }

    if (cat.name === "Find the Correct Spelling (MCQ)") {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 text-center">{q.question}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(q.id, option)}
                disabled={submitted}
                className={`p-4 rounded-2xl border-2 font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  answers[q.id] === option
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500 shadow-lg'
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (cat.name === "Find the Missing Letter") {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2 font-mono tracking-wider">
              {q.word}
            </div>
            <p className="text-gray-600 italic">Hint: {q.hint}</p>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              disabled={submitted}
              className="w-full max-w-md px-6 py-4 text-lg font-medium text-center border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white shadow-sm"
              placeholder="Complete the word..."
            />
          </div>
        </div>
      );
    }

    if (cat.name === "Spell the Pic") {
      return (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <img
                src={picImages[q.image]}
                alt="Spell this"
                className="w-48 h-48 object-cover rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswer(q.id, e.target.value)}
              disabled={submitted}
              className="w-full max-w-md px-6 py-4 text-lg font-medium text-center border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 bg-white shadow-sm"
              placeholder="What do you see?"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Results Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
            <div className="absolute top-4 right-4">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
            
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-4 ${learningLevelData.bg}`}>
              <span className="text-2xl">{learningLevelData.icon}</span>
              <h1 className={`text-3xl font-bold ${learningLevelData.color}`}>
                {learningLevelData.level}
              </h1>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800">
                Score: {score} / {allQuestions.length}
              </span>
            </div>

            {/* Category Scores */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Section Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {categoryScores.map((cat, idx) => (
                <div key={cat.name} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {cat.score}
                    </div>
                    <div className="text-gray-500">/</div>
                    <div className="text-lg text-gray-600">
                      {cat.total}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(cat.score / cat.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Student Info */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div><span className="font-semibold">Name:</span> {student.name}</div>
                <div><span className="font-semibold">Class:</span> {student.classLevel}</div>
                <div><span className="font-semibold">Parent's Mobile:</span> {student.parentMobile}</div>
                <div><span className="font-semibold">City:</span> {student.city}</div>
                <div className="md:col-span-2"><span className="font-semibold">School:</span> {student.school}</div>
              </div>
            </div>

            {/* Detailed Review */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Answer Review</h2>
            {data.categories.map((cat) => (
              <div key={cat.name} className="mb-4">
                <button
                  onClick={() => setCatOpen(prev => ({ ...prev, [cat.name]: !prev[cat.name] }))}
                  className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-800">{cat.name}</span>
                  {catOpen[cat.name] ? <ChevronUp /> : <ChevronDown />}
                </button>
                
                {catOpen[cat.name] && (
                  <div className="mt-2 space-y-3">
                    {cat.questions.map((q, idx) => {
                      const userAnswer = answers[q.id] || "";
                      const isCorrect = userAnswer.trim().toLowerCase() === q.answer.toLowerCase();
                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border-l-4 ${
                            isCorrect 
                              ? 'bg-green-50 border-green-500' 
                              : 'bg-red-50 border-red-500'
                          }`}
                        >
                          <div className="font-semibold mb-2">Q{idx + 1}</div>
                          {q.image && (
                            <img
                              src={picImages[q.image]}
                              alt="question"
                              className="w-16 h-16 object-cover rounded-lg mb-2"
                            />
                          )}
                          <div className="text-sm space-y-1">
                            <div>Your Answer: <span className="font-semibold">{userAnswer || "No answer"}</span></div>
                            <div>Correct Answer: <span className="font-semibold text-green-600">{q.answer}</span></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQ + 1) / allQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-pink-300 rounded-full animate-bounce opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            ✨ Spelling Adventure ✨
          </h1>
          <p className="text-gray-600 text-lg">Master the magic of words!</p>
        </div>

        {/* Main Assessment Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl font-bold">
                {currentCategory?.name}
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQ + 1} of {allQuestions.length}
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-2xl">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-bold text-orange-800">{formatTime(timer)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Start</span>
              <span>{Math.round(progress)}% Complete</span>
              <span>Finish</span>
            </div>
          </div>

          {/* Category Description */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg bg-gray-50 rounded-2xl px-6 py-3 inline-block">
              {currentCategory?.description}
            </p>
          </div>

          {/* Question Content */}
          <div className="mb-12">
            {renderQuestion(currentQuestion, currentCategory)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentQ === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                currentQ === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentQ < allQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Star className="w-5 h-5" />
                Submit Test
              </button>
            )}
          </div>
        </div>

        {/* Fun Encouragement */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl">
            <span className="text-2xl animate-bounce">🌟</span>
            <span className="text-gray-700 font-medium">You're doing great! Keep going!</span>
            <span className="text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🎯</span>
          </div>
        </div>
      </div>
    </div>
  );
}