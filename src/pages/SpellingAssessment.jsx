import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  Volume2,
  Clock,
  Award,
  Star,
  ChevronRight,
  ChevronLeft,
  Trophy,
  GraduationCap,
  ArrowRight,
  Heart,
  BookOpen,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Mic,
  Eye,
  PenTool,
  MessageSquare,
  Headphones,
  Lightbulb,
  X,
  Menu,
  Home,
  User,
  Settings,
  ChevronDown
} from "lucide-react";
import {
  spellingData,
  calculateClusterScores,
  calculateSpellingIndex,
  getSkillLevel,
  getImageAsset,
  CLUSTERS
} from './spellingData';

import { addModuleResult } from '../services/assessmentService';

// ============================================================================
// Helper: Text-to-Speech with Grade-Appropriate Voices
// ============================================================================
function speak(text, grade = 2) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang === "en-IN") || 
                          voices.find(v => v.lang.startsWith("en"));
    
    if (preferredVoice) {
      utter.voice = preferredVoice;
      utter.lang = preferredVoice.lang;
    } else {
      utter.lang = "en-IN";
    }
    
    if (grade <= 2) {
      utter.rate = 0.8;
      utter.pitch = 1.2;
    } else if (grade <= 5) {
      utter.rate = 0.9;
      utter.pitch = 1.1;
    } else {
      utter.rate = 1.0;
      utter.pitch = 1.0;
    }
    
    window.speechSynthesis.speak(utter);
  }
}

// ============================================================================
// Helper: Get Grade-Appropriate Mascot & Theme
// ============================================================================
function getGradeTheme(grade) {
  if (grade <= 2) {
    return {
      mascot: "🦊",
      mascotName: "Wordy the Fox",
      primaryGradient: "from-amber-400 to-orange-500",
      secondaryGradient: "from-yellow-400 to-amber-500",
      bgPattern: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMCA0MCAyMCAyMCAwIDAgMSAwLTQweiIgZmlsbD0iI2ZmZTU4MCIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')]",
      cardStyle: "rounded-3xl border-4 border-amber-200 shadow-xl",
      buttonStyle: "rounded-2xl text-lg font-bold py-4 px-6",
      fontLevel: "text-2xl sm:text-3xl"
    };
  } else if (grade <= 5) {
    return {
      mascot: "🦉",
      mascotName: "Wise Owl",
      primaryGradient: "from-blue-500 to-indigo-600",
      secondaryGradient: "from-cyan-500 to-blue-500",
      bgPattern: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMTBhMTAgMTAgMCAwIDEgMCAyMCAxMCAxMCAwIDAgMSAwLTIweiIgZmlsbD0iI2JiZjBmZiIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')]",
      cardStyle: "rounded-2xl border-2 border-blue-200 shadow-lg",
      buttonStyle: "rounded-xl text-base font-bold py-3 px-5",
      fontLevel: "text-xl sm:text-2xl"
    };
  } else {
    return {
      mascot: "🐉",
      mascotName: "Dragon Scholar",
      primaryGradient: "from-purple-600 to-pink-600",
      secondaryGradient: "from-indigo-600 to-purple-600",
      bgPattern: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cGF0aCBkPSJNMjUgMTBhMTUgMTUgMCAwIDEgMCAzMCAxNSAxNSAwIDAgMSAwLTMweiIgZmlsbD0iI2U5ZDVmZiIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')]",
      cardStyle: "rounded-xl border border-purple-200 shadow-md",
      buttonStyle: "rounded-lg text-sm font-semibold py-2.5 px-4",
      fontLevel: "text-lg sm:text-xl"
    };
  }
}

// ============================================================================
// Shuffle utility (Fisher-Yates algorithm)
// ============================================================================
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// ============================================================================
// Get grade-appropriate text display
// ============================================================================
const getDisplayText = (text, type = 'normal', grade) => {
  if (!text) return text;
  
  // For I-II: Uppercase for better recognition
  if (grade <= 2) {
    if (type === 'word' || type === 'scrambled' || type === 'option') {
      return text.toUpperCase();
    }
    if (type === 'instruction') {
      return text; // Keep instructions normal case
    }
  }
  
  // For III-V and VI-X: Normal case
  return text;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function SpellingAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get student data from navigation state
  const studentData = location.state?.studentData || {
    fullName: "Student",
    grade: "2"
  };
  const userType = location.state?.userType || "parent";

  // Determine class group based on grade
  const grade = parseInt(studentData.grade) || 2;
  const classGroup = grade <= 2 ? "I-II" : grade <= 5 ? "III-V" : "VI-X";
  const data = spellingData[classGroup];
  
  // #3: Grade-specific time limits (in minutes)
  const timeLimit = grade <= 2 ? 90 : grade <= 5 ? 75 : 60;
  
  // Get grade-appropriate theme
  const theme = getGradeTheme(grade);

  // State for shuffled questions
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(timeLimit * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Step 2: Track the furthest category unlocked (never decreases)
  const [maxUnlockedCategoryIndex, setMaxUnlockedCategoryIndex] = useState(0);
  
  // Step 2: Mobile collapse state for category pills
  const [showCategories, setShowCategories] = useState(false);
  
  // Step 3: Pre-submit review screen
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [hasSeenReviewScreen, setHasSeenReviewScreen] = useState(false);
  const [show30SecWarning, setShow30SecWarning] = useState(false);
  
  // Refs
  const questionRef = useRef(null);
  const inputRef = useRef(null);
  
  // Timestamp tracking
  const [startTime] = useState(() => new Date().toISOString());
  const [endTime, setEndTime] = useState(null);

  // ==========================================================================
  // Process questions on component mount - SHUFFLE!
  // ==========================================================================
  useEffect(() => {
    // Shuffle questions within each category and shuffle MCQ options
    const processed = data.categories.flatMap((cat) => {
      // Shuffle the questions in this category
      const shuffledCatQuestions = shuffleArray(cat.questions);
      
      // For MCQ questions, also shuffle their options
      const questionsWithShuffledOptions = shuffledCatQuestions.map(q => {
        if (q.options) {
          return {
            ...q,
            options: shuffleArray(q.options)
          };
        }
        return q;
      });
      
      // Add category name to each question
      return questionsWithShuffledOptions.map((q) => ({
        ...q,
        categoryName: cat.name,
      }));
    });
    
    setShuffledQuestions(processed);
  }, []); // Run once on mount

  const allQuestions = shuffledQuestions;
  const currentQ = allQuestions[currentIndex] || {};
  const totalQuestions = allQuestions.length;
  const progressPercentage = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Helper functions for category progress
  const getCategoryTotalQuestions = () => {
    if (!currentQ.categoryName) return 0;
    return allQuestions.filter(q => q.categoryName === currentQ.categoryName).length;
  };

  const getCategoryQuestionNumber = () => {
    if (!currentQ.categoryName) return 0;
    const categoryQuestions = allQuestions.filter(q => q.categoryName === currentQ.categoryName);
    return categoryQuestions.findIndex(q => q.id === currentQ.id) + 1;
  };

  const getCategoryProgress = () => {
    if (!currentQ.categoryName) return 0;
    const categoryQuestions = allQuestions.filter(q => q.categoryName === currentQ.categoryName);
    const currentIndexInCategory = categoryQuestions.findIndex(q => q.id === currentQ.id);
    return Math.round(((currentIndexInCategory + 1) / categoryQuestions.length) * 100);
  };

  // Auto-focus input on question change
  useEffect(() => {
    if (inputRef.current && !submitted) {
      inputRef.current.focus();
    }
  }, [currentIndex, submitted]);

  // Step 2: Update max unlocked category when advancing forward
  useEffect(() => {
    if (allQuestions.length === 0) return;
    
    // Find current category index
    const categoryMap = data.categories.map((cat, idx) => {
      const startIdx = data.categories.slice(0, idx).reduce((sum, c) => sum + c.questions.length, 0);
      return { startIndex: startIdx, questionCount: cat.questions.length };
    });
    
    const currentCatIdx = categoryMap.findIndex(cat => 
      currentIndex >= cat.startIndex && currentIndex < cat.startIndex + cat.questionCount
    );
    
    if (currentCatIdx > maxUnlockedCategoryIndex) {
      setMaxUnlockedCategoryIndex(currentCatIdx);
    }
  }, [currentIndex, allQuestions.length, maxUnlockedCategoryIndex]);

  // Timer effect
  useEffect(() => {
    if (submitted) return;
    if (timer <= 0) {
      handleFinalSubmit(); // Auto-submit when time expires
      return;
    }
    
    // Show 30-second warning
    if (timer === 30 && !show30SecWarning) {
      setShow30SecWarning(true);
    }
    
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer, submitted, show30SecWarning]);

  // Handlers
  const handleAnswer = (qid, val) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };
  
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((q) => q + 1);
      setShowHint(false);
      
      // Celebrate when moving forward
      if (currentIndex % 5 === 4) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((q) => q - 1);
      setShowHint(false);
    }
  };
  
  const handleSpeak = () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    speak(currentQ.word || currentQ.question || "", grade);
    setTimeout(() => setIsSpeaking(false), 1500);
  };
  
  const handleSubmit = () => {
    // Step 3: Show review screen instead of immediate submit
    setShowReviewScreen(true);
  };
  
  const handleFinalSubmit = async () => {
    const endTimestamp = new Date().toISOString();
    setEndTime(endTimestamp);
    
    // Calculate cluster scores
    const clusterScores = calculateClusterScores(answers, allQuestions);
    
    // Calculate spelling index (weighted score)
    const spellingIndex = calculateSpellingIndex(clusterScores);
    
    // Get skill level based on spelling index
    const skillLevel = getSkillLevel(spellingIndex);
    
    // Calculate raw score for reference
    const rawScore = allQuestions.reduce(
      (acc, q) => (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase() ? acc + 1 : acc),
      0
    );
    
    // Calculate achievement badge
    const targetTime = grade <= 2 ? 75 : grade <= 5 ? 60 : 45;
    const elapsedMinutes = Math.floor((timeLimit * 60 - timer) / 60);
    const percentage = Math.round((rawScore / totalQuestions) * 100);
    const achievementUnlocked = elapsedMinutes <= targetTime && percentage >= 60;
    
    // ===== TOUCH POINT 3: Save module result to Firebase =====
    if (studentData.assessmentId) {
      try {
        const result = await addModuleResult(
          studentData.assessmentId,
          {
            module: "Spelling",
            rawScore,
            totalQuestions,
            percentage,
            spellingIndex,
            skillLevel,
            clusterScores,
            achievementUnlocked,
            achievementName: "Word Fluency Star",
            duration: Math.floor((new Date(endTimestamp) - new Date(startTime)) / 1000),
            startTime,
            endTime: endTimestamp,
            answers,
          }
        );
        
        if (!result.success) {
          console.error('Failed to save module result:', result.error);
          // Continue anyway - don't block user
        }
      } catch (error) {
        console.error('Error saving to Firebase:', error);
        // Continue anyway
      }
    }
    
    // Navigate based on user type (existing code continues here)
    if (userType === "parent") {
      navigate("/results/ranking-fields", {
        state: {
          assessmentResults: {
            score: rawScore,
            totalQuestions,
            percentage,
            spellingIndex,
            skillLevel,
            clusterScores,
            level: skillLevel.name,
            duration: Math.floor((new Date(endTimestamp) - new Date(startTime)) / 1000),
            startTime,
            endTime: endTimestamp,
            answers,
            module: "Spelling",
            allQuestions,
            achievementUnlocked,
            achievementName: "Word Fluency Star",
            assessmentId: studentData.assessmentId // ADD THIS
          },
          studentData,
          userType
        }
      });
    } else {
      navigate("/schools/analytics", {
        state: {
          schoolName: studentData.schoolName || "School",
          assessmentResults: {
            score: rawScore,
            totalQuestions,
            percentage,
            spellingIndex,
            skillLevel,
            clusterScores,
            level: skillLevel.name,
            duration: Math.floor((new Date(endTimestamp) - new Date(startTime)) / 1000),
            startTime,
            endTime: endTimestamp,
            answers,
            module: "Spelling",
            allQuestions,
            achievementUnlocked,
            achievementName: "Word Fluency Star",
            assessmentId: studentData.assessmentId // ADD THIS
          },
          studentData
        }
      });
    }
    
    setSubmitted(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ==========================================================================
  // QUESTION RENDERERS - Mobile Optimized
  // ==========================================================================

  // Per-category gradient backgrounds for the header box
  const categoryHeaderBg = {
    'Listen & Spell':               'from-blue-500 to-indigo-600',
    'Find the Correct Spelling':    'from-purple-500 to-pink-600',
    'Fill in the Missing Letter':   'from-amber-400 to-orange-500',
    'Fill in the Missing Letters':  'from-amber-400 to-orange-500',
    'Unscramble the Word':          'from-orange-500 to-red-500',
    'Spell the Picture':            'from-green-500 to-teal-600',
  };

  // Helper functions for category navigation
const getTotalCategories = () => {
  const uniqueCategories = [...new Set(allQuestions.map(q => q.categoryName))];
  return uniqueCategories.length;
};

const getCurrentCategoryIndex = () => {
  if (!currentQ.categoryName) return 0;
  const uniqueCategories = [...new Set(allQuestions.map(q => q.categoryName))];
  return uniqueCategories.indexOf(currentQ.categoryName);
};

  // Shared header — beautiful BG box, instruction centered below title
  function renderQuestionHeader(icon, title, instruction = null) {
    const bg = categoryHeaderBg[title] || 'from-purple-500 to-pink-600';
    return (
      <>
        <div className={`bg-gradient-to-r ${bg} rounded-2xl px-5 py-4 mb-4 shadow-md`}>
          <div className="flex items-center justify-between gap-4">

            {/* Left: icon + title + question count below title */}
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
                {icon}
              </div>
              <div>
                <h2 className={`font-bold text-white ${grade <= 2 ? 'text-2xl' : 'text-xl'}`}>
                  {title}
                </h2>
                <p className="text-sm font-semibold text-white/90 mt-1 text-center">
                  Question {getCategoryQuestionNumber()} of {getCategoryTotalQuestions()}
                </p>
              </div>
            </div>

            {/* Right: Category Progress */}
            <div className="flex-shrink-0 w-40 sm:w-56">
              <p className="text-xs font-bold text-white/80 text-center mb-1.5">
                Category Progress
              </p>
              <div className="w-full h-2.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${getCategoryProgress()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instruction — outside the box, centered */}
        {instruction && (
          <p className="text-gray-500 text-sm sm:text-base text-center mb-4">
            {instruction}
          </p>
        )}
      </>
    );
  }

  function renderDictation(q) {
    return (
      <div className="space-y-6" ref={questionRef}>
        {renderQuestionHeader(
          <Headphones size={grade <= 2 ? 28 : 24} className="text-white" />,
          'Listen & Spell',
          'Click the speaker, listen carefully, then type the word.'
        )}
        
        {/* Audio Button - Prominent for younger grades */}
        <div className="flex flex-col items-center justify-center py-4 sm:py-6">
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className={`
              relative group
              ${grade <= 2 ? 'w-32 h-32' : grade <= 5 ? 'w-28 h-28' : 'w-24 h-24'}
              rounded-full bg-gradient-to-r ${theme.primaryGradient} 
              text-white shadow-xl hover:shadow-2xl hover:scale-110 
              transition-all duration-300 disabled:opacity-50
              flex items-center justify-center
              ${isSpeaking ? 'animate-pulse' : ''}
            `}
          >
            <Volume2 size={grade <= 2 ? 48 : grade <= 5 ? 40 : 32} />
            
            {/* Ripple effect */}
            <span className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></span>
          </button>
          
          <p className="mt-3 text-sm text-gray-500 font-medium">
            {isSpeaking ? 'Speaking...' : 'Tap to hear'}
          </p>
        </div>
        
        {/* Input Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Your answer:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            disabled={submitted}
            placeholder={grade <= 2 ? "Type the word..." : "Enter the word you heard"}
            className={`
              w-full px-5 py-4 text-base sm:text-lg
              border-2 border-gray-200 rounded-xl
              focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${grade <= 2 ? 'text-xl py-5' : ''}
            `}
          />
        </div>
        
        {/* Hint for younger grades */}
        {grade <= 2 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <HelpCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <span className="font-bold">Tip:</span> Listen carefully to each sound. 
                You can play it as many times as you need!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderMCQ(q) {
    return (
      <div className="space-y-6" ref={questionRef}>
        {renderQuestionHeader(
          <Eye size={grade <= 2 ? 28 : 24} className="text-white" />,
          'Find the Correct Spelling',
          'Which of these is spelled correctly?'
        )}
        
        {/* Question Text */}
        <p className={`text-gray-800 font-medium ${grade <= 2 ? 'text-xl' : 'text-lg'}`}>
          {q.question}
        </p>
        
        {/* Options Grid - Responsive with shuffled options */}
        <div className={`
          grid gap-3
          ${grade <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}
        `}>
          {q.options.map((option, idx) => {
            const isSelected = answers[q.id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(q.id, option)}
                disabled={submitted}
                className={`
                  relative p-4 sm:p-5 text-center font-bold rounded-xl
                  border-2 transition-all duration-200
                  ${grade <= 2 ? 'text-lg sm:text-xl' : 'text-base'}
                  ${isSelected
                    ? `bg-gradient-to-r ${theme.primaryGradient} text-white border-transparent shadow-lg scale-105`
                    : 'bg-white text-gray-800 border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {getDisplayText(option, 'option', grade)}
                
                {/* Checkmark for selected */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Tip for younger grades */}
        {grade <= 2 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <Lightbulb size={18} className="text-blue-500" />
              Read each option carefully. Which one looks right?
            </p>
          </div>
        )}
      </div>
    );
  }

  function renderMissing(q) {
    // For younger grades, show blanks as boxes and uppercase
    const displayWord = grade <= 2 
      ? q.word.replace(/_/g, ' _ ').toUpperCase()
      : q.word;
    
    return (
      <div className="space-y-6" ref={questionRef}>
        {renderQuestionHeader(
          <PenTool size={grade <= 2 ? 28 : 24} className="text-white" />,
          grade <= 2 ? 'Fill in the Missing Letter' : 'Fill in the Missing Letters',
          'Look at the word below and fill in the missing letters.'
        )}
        
        {/* Word Display - Emphasized */}
        <div className="text-center py-6">
          <p className={`
            font-mono font-black tracking-wider
            ${grade <= 2 ? 'text-5xl sm:text-6xl' : grade <= 5 ? 'text-4xl' : 'text-3xl'}
            text-purple-700
          `}>
            {displayWord}
          </p>
        </div>
        
        {/* Hint */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto">
  <div className="flex items-center justify-center gap-3">
    <Lightbulb size={20} className="text-amber-500 flex-shrink-0" />
    <p className="text-amber-800 text-center">
      <span className="font-bold">Hint:</span> {q.hint}
    </p>
  </div>
</div>
        
        {/* Input Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Complete the word:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            disabled={submitted}
            placeholder="Type the full word..."
            className={`
              w-full px-5 py-4 text-base sm:text-lg
              border-2 border-gray-200 rounded-xl
              focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${grade <= 2 ? 'text-xl py-5' : ''}
            `}
          />
        </div>
      </div>
    );
  }

  function renderUnscramble(q) {
    return (
      <div className="space-y-6" ref={questionRef}>
        {renderQuestionHeader(
          <Zap size={grade <= 2 ? 28 : 24} className="text-white" />,
          'Unscramble the Word',
          'Rearrange the letters to make the correct word.'
        )}
        
        {/* Scrambled Word Display */}
        <div className="text-center py-6">
          <div className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 p-6 rounded-3xl">
            <p className={`
              font-mono font-black tracking-widest
              ${grade <= 2 ? 'text-5xl sm:text-6xl' : grade <= 5 ? 'text-4xl' : 'text-3xl'}
              text-orange-600
            `}>
              {getDisplayText(q.scrambled, 'scrambled', grade)}
            </p>
          </div>
        </div>
        
        {/* Hint */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto">
  <div className="flex items-center justify-center gap-3">
    <Lightbulb size={20} className="text-amber-500 flex-shrink-0" />
    <p className="text-amber-800 text-center">
      <span className="font-bold">Hint:</span> {q.hint}
    </p>
  </div>
</div>
        
        {/* Input Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 ml-1">
            Your answer:
          </label>
          <input
            ref={inputRef}
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            disabled={submitted}
            placeholder="Rearrange the letters..."
            className={`
              w-full px-5 py-4 text-base sm:text-lg
              border-2 border-gray-200 rounded-xl
              focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${grade <= 2 ? 'text-xl py-5' : ''}
            `}
          />
        </div>
      </div>
    );
  }

  function renderPic(q) {
    const asset = getImageAsset(q.image);
    
    return (
      <div className="space-y-6" ref={questionRef}>
        {renderQuestionHeader(
          <Eye size={grade <= 2 ? 28 : 24} className="text-white" />,
          'Spell the Picture',
          'Look at the picture carefully and spell the word.'
        )}
        
        {/* Image Display */}
        <div className="flex justify-center py-4">
          <div className="relative">
            {/* Emoji with glow for younger grades */}
            <div className={`
              ${grade <= 2 ? 'text-9xl' : grade <= 5 ? 'text-8xl' : 'text-7xl'}
              ${grade <= 2 ? 'animate-bounce' : ''}
            `}>
              {asset.emoji}
            </div>
            
            {/* Decorative rings for younger grades */}
            {grade <= 2 && (
              <>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-xl opacity-50 -z-10"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full blur-lg opacity-30 -z-20"></div>
              </>
            )}
          </div>
        </div>
        
        {/* Question Prompt */}
        <p className="text-center text-gray-700 font-medium">
          What is this? Spell it!
        </p>
        
        {/* Input Field */}
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswer(q.id, e.target.value)}
            disabled={submitted}
            placeholder="Type the word..."
            className={`
              w-full px-5 py-4 text-base sm:text-lg
              border-2 border-gray-200 rounded-xl
              focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100
              transition-all duration-200
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${grade <= 2 ? 'text-xl py-5' : ''}
            `}
          />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // STEP 3: PRE-SUBMIT REVIEW SCREEN
  // ==========================================================================
  if (showReviewScreen) {
    // Calculate skipped questions per category
    const categoryReview = data.categories.map((cat, idx) => {
      const catStartIdx = data.categories.slice(0, idx).reduce((sum, c) => sum + c.questions.length, 0);
      const catQuestions = allQuestions.slice(catStartIdx, catStartIdx + cat.questions.length);
      const skipped = catQuestions.filter(q => !answers[q.id] || answers[q.id].trim() === '').length;
      return { name: cat.name, total: cat.questions.length, skipped };
    });

    const totalAnswered = allQuestions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length;
    const totalSkipped = totalQuestions - totalAnswered;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Timer - prominent at top */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-6 py-4 mb-6 shadow-xl animate-pulse-glow">
            <div className="flex items-center justify-center gap-3">
              <Clock size={32} className="text-white" />
              <div className="text-center">
                <p className="text-xs font-bold text-orange-100 uppercase tracking-wide">Time Remaining</p>
                <p className="text-4xl font-black text-white tabular-nums">{formatTime(timer)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-3">📝</div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Ready to Submit?</h2>
              <p className="text-gray-600">Review your assessment before finalizing</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Answered</p>
                <p className="text-4xl font-black text-green-600">{totalAnswered}</p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Skipped</p>
                <p className="text-4xl font-black text-yellow-600">{totalSkipped}</p>
              </div>
            </div>

            {/* Category Breakdown - only show categories with skipped questions */}
            {totalSkipped > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={20} className="text-yellow-600" />
                  Questions Skipped by Category
                </h3>
                <div className="space-y-2">
                  {categoryReview.filter(c => c.skipped > 0).map(cat => (
                    <div key={cat.name} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="font-bold text-yellow-700">{cat.skipped} of {cat.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* #6: Achievement Badge Message on Review Screen */}
            {(() => {
              const targetTime = grade <= 2 ? 75 : grade <= 5 ? 60 : 45;
              const elapsedMinutes = Math.floor((timeLimit * 60 - timer) / 60);
              const timeRemainingForBadge = targetTime - elapsedMinutes;
              const meetsTimeCriteria = timeRemainingForBadge > 0;
              
              return (
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl p-5 mb-6 border-2 border-purple-400">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">🏆</div>
                    <div className="flex-1">
                      <p className="text-white font-black text-base mb-1">
                        Achievement Challenge: Word Fluency Star
                      </p>
                      <p className="text-purple-100 text-sm mb-1.5">
                        Requires: Complete in ≤{targetTime} minutes with ≥60% score
                      </p>
                      {meetsTimeCriteria ? (
                        <div className="bg-green-500/20 border border-green-400 rounded-lg px-3 py-2 mt-2">
                          <p className="text-green-200 text-sm font-bold">
                            ✓ Time requirement: ELIGIBLE
                          </p>
                          <p className="text-green-100 text-xs mt-0.5">
                            Elapsed: {elapsedMinutes} min / Limit: {targetTime} min ({timeRemainingForBadge} min remaining)
                          </p>
                          <p className="text-green-100 text-xs mt-1">
                            Submit now and score ≥60% to earn your badge!
                          </p>
                        </div>
                      ) : (
                        <div className="bg-red-500/20 border border-red-400 rounded-lg px-3 py-2 mt-2">
                          <p className="text-red-200 text-sm font-bold">
                            ✗ Time requirement: NOT MET
                          </p>
                          <p className="text-red-100 text-xs mt-0.5">
                            Elapsed: {elapsedMinutes} min / Limit: {targetTime} min (Over by {Math.abs(timeRemainingForBadge)} min)
                          </p>
                          <p className="text-red-100 text-xs mt-1">
                            Badge unavailable, but you can still submit and get your results!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Message */}
            {totalSkipped > 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-blue-800 text-sm">
                  You can go back and answer skipped questions, or submit now. Unanswered questions will be marked as incorrect.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-800 font-semibold">
                  ✓ Great job! You've answered all questions.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {totalSkipped > 0 && (
                <button
                  onClick={() => {
                    setShowReviewScreen(false);
                    setHasSeenReviewScreen(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Go Back to Assessment
                </button>
              )}
              
              <button
                onClick={handleFinalSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Award size={20} />
                {totalSkipped > 0 ? 'Submit Assessment Anyway' : 'Submit Assessment'}
                <ArrowRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RESULTS VIEW
  // ==========================================================================
  if (submitted) {
    const clusterScores = calculateClusterScores(answers, allQuestions);
    const spellingIndex = calculateSpellingIndex(clusterScores);
    const skillLevel = getSkillLevel(spellingIndex);
    const rawScore = allQuestions.reduce(
      (acc, q) => (answers[q.id]?.trim().toLowerCase() === q.answer.toLowerCase() ? acc + 1 : acc),
      0
    );
    const durationSeconds = endTime ? Math.floor((new Date(endTime) - new Date(startTime)) / 1000) : 0;
    const durationMinutes = Math.floor(durationSeconds / 60);
    const durationSecs = durationSeconds % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Celebration Animation */}
          <div className="text-center mb-6 animate-bounce">
            <div className="text-8xl">{skillLevel.icon}</div>
          </div>
          
          {/* Main Results Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with level color */}
            <div 
              className="h-3"
              style={{ backgroundColor: skillLevel.color }}
            ></div>
            
            <div className="p-6 sm:p-8 md:p-10">
              {/* Level Title */}
              <h1 className="text-4xl sm:text-5xl font-black text-center mb-2" style={{ color: skillLevel.color }}>
                {skillLevel.name} Level!
              </h1>
              
              {/* Student Name */}
              <p className="text-xl text-center text-gray-600 mb-6">
                Great job, {studentData.fullName}!
              </p>
              
              {/* Spelling Index - Primary Metric */}
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 text-center">
                <p className="text-sm font-bold text-purple-700 mb-2 uppercase tracking-wider">
                  Spelling Index (Weighted Score)
                </p>
                <div className="text-7xl sm:text-8xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {spellingIndex}%
                </div>
                <p className="text-sm text-gray-600">
                  Grade {studentData.grade} • Completed in {durationMinutes}m {durationSecs}s
                </p>
              </div>
              
              {/* Cluster Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target size={20} className="text-purple-600" />
                  Skill Cluster Performance
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(clusterScores).map(([key, data]) => {
                    const clusterInfo = CLUSTERS[key];
                    const clusterColor = data.percentage >= 75 ? '#10b981' : data.percentage >= 55 ? '#eab308' : '#ef4444';
                    
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{clusterInfo.icon}</span>
                            <span className="font-semibold text-gray-800">
                              {clusterInfo.name}
                            </span>
                          </div>
                          <span className="font-bold text-lg" style={{ color: clusterColor }}>
                            {data.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                              backgroundColor: clusterColor,
                              width: `${data.percentage}%`
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {data.correct} / {data.total} correct
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Interpretation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                <p className="text-gray-700">
                  {skillLevel.interpretation}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {userType === "parent" ? (
                  <button
                    onClick={() => navigate("/results/ranking-fields", {
                      state: {
                        assessmentResults: {
                          score: rawScore,
                          totalQuestions,
                          level: skillLevel.name,
                          percentage: Math.round((rawScore / totalQuestions) * 100),
                          spellingIndex,
                          skillLevel,
                          clusterScores,
                          duration: durationSeconds,
                          startTime,
                          endTime,
                          answers,
                          module: "Spelling",
                          allQuestions
                        },
                        studentData
                      }
                    })}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Trophy size={20} />
                    See Rankings & Share Results
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/schools/analytics", {
                      state: {
                        schoolName: studentData.schoolName || "School",
                        assessmentResults: {
                          score: rawScore,
                          totalQuestions,
                          level: skillLevel.name,
                          percentage: Math.round((rawScore / totalQuestions) * 100),
                          spellingIndex,
                          skillLevel,
                          clusterScores,
                          duration: durationSeconds,
                          startTime,
                          endTime,
                          answers,
                          module: "Spelling",
                          allQuestions
                        },
                        studentData
                      }
                    })}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Continue to School Dashboard
                  </button>
                )}
                
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // MAIN ASSESSMENT VIEW
  // ==========================================================================
  
  // Don't render until questions are loaded
  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-4">📚</div>
          <p className="text-gray-600">Loading your assessment...</p>
        </div>
      </div>
    );
  }
  
  // Determine question type and render appropriate component
  let qContent;
  if (currentQ.question && currentQ.options) {
    qContent = renderMCQ(currentQ);
  } else if (currentQ.scrambled) {
    qContent = renderUnscramble(currentQ);
  } else if (currentQ.image) {
    qContent = renderPic(currentQ);
  } else if (currentQ.word && currentQ.hint) {
    qContent = renderMissing(currentQ);
  } else if (currentQ.word && !currentQ.hint && !currentQ.scrambled && !currentQ.image) {
    qContent = renderDictation(currentQ);
  } else {
    qContent = (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">Oops! Something went wrong with this question.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* ===== CELEBRATION OVERLAY ===== */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}
      
      {/* ===== EXIT MODAL ===== */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exit Assessment?</h3>
              <p className="text-gray-600 mb-6">
                Your progress will be saved. You can resume anytime within 24 hours.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Continue Assessment
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 30-SECOND WARNING MODAL ===== */}
      {show30SecWarning && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-orange-500">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">⏰</div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">Time Almost Up!</h3>
              <p className="text-gray-700 mb-4">
                Only <span className="font-black text-orange-600">30 seconds</span> remaining.
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Submit now or your current answers will be submitted automatically when time expires.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShow30SecWarning(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Keep Working
                </button>
                <button
                  onClick={() => {
                    setShow30SecWarning(false);
                    setShowReviewScreen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl hover:scale-105 transition-all"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ===== MOBILE MENU ===== */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="absolute top-20 right-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100">
              <p className="font-bold text-gray-900">{studentData.fullName}</p>
              <p className="text-sm text-gray-500">Grade {studentData.grade}</p>
            </div>
            <div className="p-2">
              {[
                { icon: Home, label: 'Home', onClick: () => navigate('/') },
                { icon: User, label: 'Profile', onClick: () => {} },
                { icon: Settings, label: 'Settings', onClick: () => {} },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowMobileMenu(false);
                    item.onClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <item.icon size={18} className="text-gray-600" />
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowExitModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={18} />
                <span className="font-medium">Exit Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ===== HEADER ===== */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo + Mascot */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-md">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900">Master of Alphabet</p>
                <p className="text-xs text-gray-500">Spelling Assessment</p>
              </div>
              <div className="sm:hidden">
                <p className="font-bold text-gray-900">MoA</p>
              </div>
            </div>
            
            {/* Student Info - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-gray-900">{studentData.fullName}</p>
                <p className="text-sm text-gray-500">Grade {studentData.grade}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                {studentData.fullName.charAt(0)}
              </div>
            </div>
            
            {/* Mobile Right Section */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Timer - Mobile */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg px-3 py-1.5 shadow-md">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-white" />
                  <span className="text-white font-bold text-sm">{formatTime(timer)}</span>
                </div>
              </div>
              
              {/* Menu Button */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-700" />
              </button>
            </div>
            
            {/* Desktop Timer */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl px-6 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <Clock size={24} className="text-white" />
                  <div>
                    <p className="text-xs text-orange-100 font-medium">Time Remaining</p>
                    <p className="text-2xl font-bold text-white tabular-nums">{formatTime(timer)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress Card */}
{/* ===== TOP SECTION - Module-aware gradient + icon ===== */}
{(() => {
  // Module-specific gradients
  const moduleBg = {
    'Spelling':      'from-purple-600 to-pink-600',
    'Reading':       'from-blue-600 to-cyan-600',
    'Pronunciation': 'from-rose-600 to-orange-600',
    'Grammar':       'from-green-600 to-teal-600',
    'Writing':       'from-indigo-600 to-purple-600',
    'Listening':     'from-amber-500 to-orange-600',
    'Vocabulary':    'from-fuchsia-600 to-purple-700',
    'S.H.A.R.P':    'from-cyan-600 to-blue-700',
  };
  
  // Module-specific icons
  const moduleIcon = {
    'Spelling':      <PenTool size={grade <= 2 ? 28 : 24} className="text-white" />,
    'Reading':       <BookOpen size={grade <= 2 ? 28 : 24} className="text-white" />,
    'Pronunciation': <Mic size={grade <= 2 ? 28 : 24} className="text-white" />,
    'Grammar':       <MessageSquare size={grade <= 2 ? 28 : 24} className="text-white" />,
    'Writing':       <PenTool size={grade <= 2 ? 28 : 24} className="text-white" />,
    'Listening':     <Headphones size={grade <= 2 ? 28 : 24} className="text-white" />,
    'Vocabulary':    <Star size={grade <= 2 ? 28 : 24} className="text-white" />,
    'S.H.A.R.P':    <Lightbulb size={grade <= 2 ? 28 : 24} className="text-white" />,
  };
  
  const currentModule = 'Spelling';
  const bg = moduleBg[currentModule] || 'from-purple-600 to-pink-600';
  const icon = moduleIcon[currentModule] || <BookOpen size={24} className="text-white" />;

  // ── Step 2: Category navigation logic ────────────────────────────────────
  // Build category map with start index and question count
  const categoryMap = data.categories.map((cat, idx) => {
    const startIdx = data.categories.slice(0, idx).reduce((sum, c) => sum + c.questions.length, 0);
    return {
      name: cat.name,
      startIndex: startIdx,
      questionCount: cat.questions.length,
    };
  });

  // Current category index
  const currentCatIdx = categoryMap.findIndex(cat => 
    currentIndex >= cat.startIndex && currentIndex < cat.startIndex + cat.questionCount
  );

  // Show categories up to max ever unlocked (never decreases when jumping back)
  const unlockedCategories = categoryMap.slice(0, maxUnlockedCategoryIndex + 1);

  // Count skipped questions per category - only for PAST categories
  const getSkippedCount = (cat, catIdx) => {
    // Only count skipped if we've moved PAST this category
    if (catIdx >= currentCatIdx) return 0;
    
    let skipped = 0;
    for (let i = cat.startIndex; i < cat.startIndex + cat.questionCount; i++) {
      const q = allQuestions[i];
      if (!answers[q.id] || answers[q.id].trim() === '') {
        skipped++;
      }
    }
    return skipped;
  };

  // Total skipped across all past categories (for mobile toggle button)
  const totalSkipped = unlockedCategories.reduce((sum, cat, idx) => {
    return sum + getSkippedCount(cat, idx);
  }, 0);

  // Jump to first question of a category
  const jumpToCategory = (catIndex) => {
    setCurrentIndex(categoryMap[catIndex].startIndex);
    setShowCategories(false); // Collapse on mobile after selecting
  };
  
  return (
    <div className={`bg-gradient-to-r ${bg} rounded-2xl px-5 py-4 mb-4 shadow-md`}>
      
      {/* Top section - unchanged */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl flex-shrink-0">
            {icon}
          </div>
          <div>
            <h2 className={`font-bold text-white ${grade <= 2 ? 'text-2xl' : 'text-xl'}`}>
              Spelling Skills Assessment
            </h2>
            <p className="text-sm font-semibold text-white/90 mt-1 text-center">
              Category {getCurrentCategoryIndex() + 1} of {getTotalCategories()}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 w-40 sm:w-56">
          <p className="text-xs font-bold text-white/90 text-right mb-1.5">
            Overall Progress ({currentIndex + 1}/{totalQuestions})
          </p>
          <div className="w-full h-2.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 mb-3" />

      {/* Step 2: Mobile toggle - only on small screens */}
      <button
        onClick={() => setShowCategories(!showCategories)}
        className="md:hidden w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors mb-2"
      >
        <span className="text-xs font-semibold text-white">
          {showCategories ? '▲ Hide Categories' : '▼ Show Categories'}
        </span>
        {totalSkipped > 0 && !showCategories && (
          <span className="text-xs text-yellow-200">
            {totalSkipped} skipped
          </span>
        )}
      </button>

      {/* Step 2: Category pills - always visible on desktop, collapsible on mobile */}
      <div className={`
        flex flex-wrap gap-2
        ${showCategories ? 'block' : 'hidden md:flex'}
      `}>
        {unlockedCategories.map((cat, idx) => {
          const isCurrent = idx === currentCatIdx;
          const skipped = getSkippedCount(cat, idx);
          const isCompleted = idx < currentCatIdx; // Moved past this category

          return (
            <button
              key={cat.name}
              onClick={() => jumpToCategory(idx)}
              className={`
                px-3 py-2 rounded-lg text-xs font-semibold transition-all
                ${isCurrent 
                  ? 'bg-white text-purple-700 shadow-md' 
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              <div className="text-center">
                <div>
                  <span>{cat.name}</span>
                  {isCompleted && <span className="ml-1 text-green-300">✓</span>}
                </div>
                {skipped > 0 && (
                  <div className="text-[10px] mt-0.5 text-yellow-200">
                    {skipped} skipped
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
})()}

        {/* #6: Achievement Badge Message */}
        {(() => {
          const targetTime = grade <= 2 ? 75 : grade <= 5 ? 60 : 45;
          const elapsedMinutes = Math.floor((timeLimit * 60 - timer) / 60);
          const timeRemainingForBadge = targetTime - elapsedMinutes;
          const meetsTimeCriteria = timeRemainingForBadge > 0;
          
          return (
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-2xl p-4 mb-4 shadow-lg border-2 border-purple-400">
              <div className="flex items-center gap-3">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm mb-1">
                    Achievement Challenge: Word Fluency Star
                  </p>
                  <p className="text-purple-100 text-xs mb-1">
                    Complete in ≤{targetTime} minutes with ≥60% score to unlock!
                  </p>
                  {meetsTimeCriteria ? (
                    <p className="text-green-300 text-xs font-bold">
                      ✓ Badge window: {timeRemainingForBadge} min remaining (Elapsed: {elapsedMinutes} min)
                    </p>
                  ) : (
                    <p className="text-red-300 text-xs font-bold">
                      ⚠ Badge window closed (Elapsed: {elapsedMinutes} min / Limit: {targetTime} min)
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden">
          {/* Decorative top bar with grade-appropriate pattern */}
          <div className={`h-2 bg-gradient-to-r ${theme.primaryGradient}`}></div>
          
          <div className="p-5 sm:p-6 md:p-8">
           
            {/* Question Content */}
            {qContent}
          </div>
        </div>
        
        {/* Navigation Footer */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-xl font-medium
              transition-all duration-200
              ${currentIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:shadow-md'
              }
            `}
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          {/* Hint Button - for older grades */}
          {grade >= 6 && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors"
            >
              <HelpCircle size={20} />
              <span className="hidden sm:inline">Need a hint?</span>
            </button>
          )}
          
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold
                transition-all duration-300
                bg-gradient-to-r ${theme.primaryGradient} text-white shadow-lg 
                hover:scale-105 hover:shadow-xl
                ${!answers[currentQ.id] ? 'opacity-80' : 'opacity-100'}
              `}
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold
                transition-all duration-300
                bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg 
                hover:scale-105 hover:shadow-xl
                ${!answers[currentQ.id] ? 'opacity-80' : 'opacity-100'}
              `}
            >
              <Award size={20} />
              <span>Submit Assessment</span>
            </button>
          )}
        </div>
        
        {/* Exit/Save Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowExitModal(true)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Save & Exit Later
          </button>
        </div>

        {/* Step 3: Floating Submit Button - appears after seeing review screen, hidden on last question */}
        {hasSeenReviewScreen && currentIndex < totalQuestions - 1 && (
          <button
            onClick={() => setShowReviewScreen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            <Award size={20} />
            <span className="hidden sm:inline">Submit Assessment</span>
            <span className="sm:hidden">Submit</span>
          </button>
        )}
      </main>
    </div>
  );
}