import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  BookOpen,
  Users,
  GraduationCap,
  Download,
  FileText,
} from "lucide-react";

import {
  generateCombinedAudioFile,
  downloadAllAudioFiles,
  generatePDFReport,
} from "../components/DictationAssignmentApp/FileExportUtility";
import { useAudioRecorder } from "../components/DictationAssignmentApp/AudioRecordingHook";

const baseQuestionsI_II = [
  {
    text: "What is your name?",
    pedagogy: "Builds self-identity and confidence",
    funPrompt: "👋 Let's start with YOU!",
    interaction: "Big smile while answering",
  },
  {
    text: "How old are you?",
    pedagogy: "Number recognition + finger counting",
    funPrompt: "🎂 Show me with your fingers and Say It!",
    interaction: "Physical participation",
  },
  {
    text: "What color makes you happy?",
    pedagogy: "Color vocabulary + emotional awareness",
    funPrompt: "🌈 Imagine a rainbow - pick your sunshine color!",
    interaction: "Can point to objects in classroom",
  },
  {
    text: "What sound does your favorite animal make?",
    pedagogy: "Animal sounds + phonetic awareness",
    funPrompt: "🐘 ROAR like a lion or TRUMPET like an elephant!",
    interaction: "Physical movement encouraged",
  },
  {
    text: "What makes your best friend special?",
    pedagogy: "Social-emotional learning",
    funPrompt: "💖 Draw a heart around your answer!",
    interaction: "Connects to art activity",
  },
  {
    text: "What breakfast food would you eat every day?",
    pedagogy: "Nutrition awareness + categories",
    funPrompt: "🍳 Sizzle like bacon while answering!",
    interaction: "Sound effects welcome",
  },
  {
    text: "What toy would you take to the moon?",
    pedagogy: "Imaginative play + space science",
    funPrompt: "🚀 3...2...1...BLAST OFF your answer!",
    interaction: "Arm movement suggested",
  },
  {
    text: "What makes your teacher smile?",
    pedagogy: "Observation skills + empathy",
    funPrompt: "😊 Give your answer with YOUR biggest smile!",
    interaction: "Facial expression mirroring",
  },
  {
    text: "If your pet could talk, what would it say?",
    pedagogy: "Creative storytelling",
    funPrompt: "🗨️ Use a silly voice for your pet!",
    interaction: "Voice modulation play",
  },
  {
    text: "What magic thing did you see outside today?",
    pedagogy: "Observation + wonder development",
    funPrompt: "🔮 Wave your 'magic wand' while answering!",
    interaction: "Physical prop suggested",
  },
];

const baseQuestionsIII_V = [
  {
    text: "What is your name?",
    pedagogy: "Foundational self-identification",
    funPrompt: "🌟 Say it loud like a superhero!",
    interaction: "Encourage adding a fun gesture (e.g., hands on hips)",
  },
  {
    text: "Which month were you born in?",
    pedagogy: "Calendar awareness + birthday excitement",
    funPrompt: "🎂 Imagine your birthday cake - what month is on it?",
    interaction: "Point to classroom calendar while answering",
  },
  {
    text: "Which is your favourite day of the week?",
    pedagogy: "Temporal concepts + routine understanding",
    funPrompt: "📆 Do your 'happy dance' for that day!",
    interaction: "Physical movement to express preference",
  },
  {
    text: "Which is your favourite subject?",
    pedagogy: "Academic self-awareness",
    funPrompt: "📚 Show me your 'thinking face' for that subject!",
    interaction:
      "Make subject-related gestures (e.g., painting motion for art)",
  },
  {
    text: "Who sits next to you in class?",
    pedagogy: "Social mapping + peer recognition",
    funPrompt: "👋 Wave to where they sit while answering!",
    interaction: "Physical orientation to classroom space",
  },
  {
    text: "Who is your teacher?",
    pedagogy: "Authority figure recognition",
    funPrompt: "🍎 Say it in your best teacher voice!",
    interaction: "Voice modulation play",
  },
  {
    text: "What is the name of your school?",
    pedagogy: "Community belonging",
    funPrompt: "🏫 Cheer it like at a school sports day!",
    interaction: "Group echo after individual response",
  },
  {
    text: "What is the name of the town/city you live in?",
    pedagogy: "Geographical identity",
    funPrompt: "🗺️ Pretend you're a tour guide announcing it!",
    interaction: "Hand cupped around mouth like a megaphone",
  },
  {
    text: "Who is your best friend?",
    pedagogy: "Social-emotional bonding",
    funPrompt: "💕 Blow a kiss toward them while answering!",
    interaction: "Non-verbal affection expression",
  },
  {
    text: "Which cartoon show do you like the most?",
    pedagogy: "Media literacy + preference articulation",
    funPrompt: "📺 Sing its theme song (just 3 seconds!)",
    interaction: "Quick musical interlude",
  },
];

const baseQuestionsVI_X = [
  {
    text: "Discuss the importance of environmental conservation.",
    pedagogy: "Systems thinking + civic responsibility",
    funPrompt:
      "🌱 Imagine you're Earth's superhero - what's your mission statement?",
    interaction: "Quick-sketches allowed while explaining",
    extension: "Create a meme summarizing your view",
  },
  {
    text: "How has technology changed education in recent years?",
    pedagogy: "Digital literacy + trend analysis",
    funPrompt:
      "💻 Tech-splain it like you're a YouTuber reviewing classroom tech!",
    interaction: "Use hand gestures to show 'old vs new'",
    extension: "Design an emoji timeline of changes",
  },
  {
    text: "What are the qualities of an effective leader?",
    pedagogy: "Social-emotional intelligence",
    funPrompt: "🎤 Pitch your ideal leader like a TED Talk in 30 seconds!",
    interaction: "Stand up while listing qualities",
    extension: "Compare to a fictional character leader",
  },
  {
    text: "Explain a current event that interests you and why.",
    pedagogy: "Media literacy + perspective-taking",
    funPrompt: "📰 Break it down like a TikTok news reporter!",
    interaction: "1 statistic + 1 personal connection",
    extension: "Predict how this event will evolve",
  },
  {
    text: "How would you address the problem of plastic pollution?",
    pedagogy: "Problem-solving + innovation",
    funPrompt: "♻️ Shark Tank time! Pitch your solution to investors",
    interaction: "Use classroom items as props",
    extension: "Calculate local impact of your solution",
  },
  {
    text: "What career are you considering and why?",
    pedagogy: "Future planning + self-awareness",
    funPrompt: "👔 Give your answer as if it's a LinkedIn headline",
    interaction: "Strike a power pose of that profession",
    extension: "Research someone thriving in this field",
  },
  {
    text: "Discuss the role of social media in modern society.",
    pedagogy: "Digital citizenship",
    funPrompt: "📱 Argue this like Instagram vs Twitter are battling it out!",
    interaction: "Show phone-use gestures for emphasis",
    extension: "Rewrite a historical event with social media",
  },
  {
    text: "How can schools better prepare students for the future?",
    pedagogy: "Critical analysis of systems",
    funPrompt: "🚀 You're the principal for 2025 - what's your first decree?",
    interaction: "Mime your most radical change",
    extension: "Compare schools in 2 different countries",
  },
  {
    text: "What historical figure do you admire most and why?",
    pedagogy: "Historical empathy",
    funPrompt: "⏳ If they had a Netflix special, what would the title be?",
    interaction: "Do their iconic pose/mannerism",
    extension: "Write their imaginary tweet about today",
  },
  {
    text: "Explain the importance of mental health awareness.",
    pedagogy: "Wellbeing literacy",
    funPrompt: "💬 Teach this like it's going viral on mental health day!",
    interaction: "Share with 1 deep breath first",
    extension: "Design an app feature to help",
  },
];

/** 
const questionsData = {
  "I-II": baseQuestionsI_II.map((q) => ({ text: q, difficulty: "Easy" })),
  "III-V": baseQuestionsIII_V.map((q) => ({ text: q, difficulty: "Medium" })),
  "VI-X": baseQuestionsVI_X.map((q) => ({ text: q, difficulty: "Hard" })),
};
*/

const questionsData = {
  "I-II": baseQuestionsI_II,
  "III-V": baseQuestionsIII_V,
  "VI-X": baseQuestionsVI_X,
};

const getDifficultyColorClass = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "text-green-400";
    case "Medium":
      return "text-yellow-400";
    case "Hard":
      return "text-red-400";
    default:
      return "text-blue-400";
  }
};

const DictationAssignmentApp = () => {
  const [selectedClass, setSelectedClass] = useState("I-II");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const [audioProgress, setAudioProgress] = useState(null); // {current, total}
  const [audioGenerating, setAudioGenerating] = useState(false);

  // Audio recording
  const {
    isRecording,
    audioBlob,
    audioUrl,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
    formatTime,
  } = useAudioRecorder();

  // Answers state
  const [recordedAnswers, setRecordedAnswers] = useState(
    questionsData[selectedClass].map(() => ({}))
  );

  // Speech recognition
  const recognition = useRef(null);
  const speechSynthesis = useRef(null);
  const utterance = useRef(null);

  const startMicAndRecognition = () => {
    if (recognition.current) {
      recognition.current.continuous = false;
      recognition.current.start();
    }
    startRecording();
  };

  const handleGenerateCombinedAudio = async () => {
    setAudioGenerating(true);
    setAudioProgress({ current: 0, total: currentQuestions.length });
    try {
      await generateCombinedAudioFile(
        questionsData[selectedClass],
        recordedAnswers,
        setAudioProgress
      );
    } catch (err) {
      alert("Error generating audio: " + err.message);
    }
    setAudioGenerating(false);
    setAudioProgress(null);
  };

  const stopMicAndRecognition = () => {
    stopRecording();
    if (recognition.current) {
      recognition.current.stop();
    }
    setShowAnswerBox(true);
  };

  // Initialize speech recognition
  useEffect(() => {
    speechSynthesis.current = window.speechSynthesis;

    if ("webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.maxAlternatives = 1;
      recognition.current.lang = "en-GB";

      recognition.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setUserAnswer((finalTranscript + interimTranscript).trim());
        setShowAnswerBox(true);
      };

      recognition.current.onend = () => {
        stopRecording();
        setShowAnswerBox(true);
      };

      recognition.current.onerror = (event) => {
        console.error("Recognition error:", event.error);
        if (event.error === "no-speech") {
          alert("No speech detected. Please try again.");
        } else if (event.error === "audio-capture") {
          alert("No microphone found. Please check your audio settings.");
        }
      };
    }

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, []);

  // Reset answers when class changes
  useEffect(() => {
    setRecordedAnswers(questionsData[selectedClass].map(() => ({})));
    setCurrentQuestion(0);
    setShowSummary(false);
    setShowAnswerBox(false);
    setUserAnswer("");
    resetRecording();
  }, [selectedClass]);

  // When you move to a new question, clear user answer and reset audio
  useEffect(() => {
    setUserAnswer("");
    resetRecording();
    setShowAnswerBox(false);
    setHasPlayedOnce(false);
  }, [currentQuestion]);

  /**
    const playDictation = () => {
    if (speechSynthesis.current) {
      if (isPlaying) {
        speechSynthesis.current.cancel();
        setIsPlaying(false);
      } else {
        utterance.current = new SpeechSynthesisUtterance(
          questionsData[selectedClass][currentQuestion].text
        );
        utterance.current.rate =
          selectedClass === "I-II"
            ? 0.7
            : selectedClass === "III-V"
            ? 0.8
            : 0.9;
        utterance.current.pitch = 1;
        utterance.current.volume = 1;
        utterance.current.lang = "en-GB";

        utterance.current.onstart = () => setIsPlaying(true);
        utterance.current.onend = () => {
          setIsPlaying(false);
          setHasPlayedOnce(true);
          setShowAnswerBox(true);
        };

        speechSynthesis.current.speak(utterance.current);
      }
    }
  };
*/

const playDictation = () => {
  if (speechSynthesis.current) {
    if (isPlaying) {
      speechSynthesis.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      
      // Remove emoji from fun prompt
      const cleanFunPrompt = currentQuestions[currentQuestion].funPrompt.replace(/[\u{1F300}-\u{1F6FF}]/gu, '').trim();
      
      // Create utterance for fun prompt
      const funPromptUtterance = new SpeechSynthesisUtterance(cleanFunPrompt);
      funPromptUtterance.rate = 0.8;
      funPromptUtterance.pitch = 1.2;
      
      // Create "Are you ready?" utterance
      const readyUtterance = new SpeechSynthesisUtterance("Are you ready?");
      readyUtterance.rate = 0.7;
      readyUtterance.pitch = 1;
      
      // Create main question utterance
      const questionUtterance = new SpeechSynthesisUtterance(
        currentQuestions[currentQuestion].text
      );
      questionUtterance.rate = 
        selectedClass === "I-II" ? 0.7 :
        selectedClass === "III-V" ? 0.8 : 0.9;
      questionUtterance.pitch = 1;
      
      // Chain the utterances with natural pauses
      funPromptUtterance.onend = () => {
        setTimeout(() => {
          speechSynthesis.current.speak(readyUtterance);
        }, 300); // Small pause after fun prompt
      };
      
      readyUtterance.onend = () => {
        setTimeout(() => {
          speechSynthesis.current.speak(questionUtterance);
        }, 1000); // 1 second pause after "Are you ready?"
      };
      
      questionUtterance.onend = () => {
        setIsPlaying(false);
        setHasPlayedOnce(true);
        setShowAnswerBox(true);
      };
      
      // Start the sequence
      speechSynthesis.current.speak(funPromptUtterance);
    }
  }
};

  // This function now saves both text and audio
  const handleSaveAnswer = (questionIndex) => {
    const updatedAnswers = [...recordedAnswers];
    updatedAnswers[questionIndex] = {
      textAnswer: userAnswer,
      audioUrl: audioUrl,
      timestamp: new Date().toISOString(),
    };
    setRecordedAnswers(updatedAnswers);

    // Clear state for next question
    if (questionIndex < questionsData[selectedClass].length - 1) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleResetAnswer = (questionIndex) => {
    const updatedAnswers = [...recordedAnswers];
    updatedAnswers[questionIndex] = {};
    setRecordedAnswers(updatedAnswers);
    setUserAnswer("");
    resetRecording();
  };

  const handleSubmitAssignment = async () => {
    // Save the current answer (if not already saved)
    handleSaveAnswer(currentQuestion);
    setShowSummary(true);
  };

  const handleBackToEditing = () => {
    setShowSummary(false);
  };

  const handleDownloadAllAudio = () => {
    downloadAllAudioFiles(recordedAnswers);
  };

  const handleGeneratePDF = () => {
    generatePDFReport(questionsData[selectedClass], recordedAnswers);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswer("");
    setShowAnswerBox(false);
    setHasPlayedOnce(false);
    setRecordedAnswers(questionsData[selectedClass].map(() => ({})));
    resetRecording();
  };

  const getClassIcon = (classLevel) => {
    switch (classLevel) {
      case "I-II":
        return <BookOpen className="w-5 h-5" />;
      case "III-V":
        return <Users className="w-5 h-5" />;
      case "VI-X":
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-400 to-emerald-600";
      case "Medium":
        return "from-yellow-400 to-orange-600";
      case "Hard":
        return "from-red-400 to-pink-600";
      default:
        return "from-blue-400 to-purple-600";
    }
  };

  const currentQuestions = questionsData[selectedClass];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Audio Assignment
            </span>
          </h1>
          <p className="text-xl text-white/80 drop-shadow-lg">
            Record Your Responses to the Questions
          </p>
        </div>

        {/* Class Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Select Your Class Level
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.keys(questionsData).map((classLevel) => (
              <button
                key={classLevel}
                onClick={() => setSelectedClass(classLevel)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border flex items-center gap-2 ${
                  selectedClass === classLevel
                    ? "bg-white/20 border-white/40 text-white shadow-2xl shadow-white/20"
                    : "bg-white/10 border-white/20 text-white/80 hover:bg-white/15"
                }`}
              >
                {getClassIcon(classLevel)}
                Class {classLevel}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-white/80">
                {currentQuestion + 1} / {currentQuestions.length}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${
                    ((currentQuestion + 1) / currentQuestions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-white/80">
                Answered:{" "}
                {
                  recordedAnswers.filter((a) => a.audioUrl || a.textAnswer)
                    .length
                }
              </span>
              <span className="text-white/80">
                Remaining:{" "}
                {currentQuestions.length -
                  recordedAnswers.filter((a) => a.audioUrl || a.textAnswer)
                    .length}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          {/* Question Info */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">

                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg">
                  Question {currentQuestion + 1}
                </div>

                <div className="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/20">
                  <span className="text-xs text-white/60 mb-1">Pedagogy</span>
                  <span className="text-white font-medium text-sm text-center">
                    {currentQuestions[currentQuestion].pedagogy}
                  </span>
                </div>

                <div className="flex flex-col items-center bg-white/10 p-3 rounded-xl border border-white/20">
                  <span className="text-xs text-white/60 mb-1">Fun Prompt</span>
                  <span className="text-amber-200 font-medium text-sm text-center">
                    {currentQuestions[currentQuestion].funPrompt}
                  </span>
                </div>

              </div>
            </div>
            <p className="text-white/80 text-lg">
              Listen carefully and record your response
            </p>
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={playDictation}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                isPlaying
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl shadow-red-500/30"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-6 h-6" />
                  Stop Audio
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Read me the Question
                </>
              )}
            </button>

            <button
              onClick={resetQuiz}
              className="px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl shadow-gray-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All
            </button>
          </div>

          {/* Answer Section */}
          {!showSummary ? (
            showAnswerBox && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative">
                  <label className="block text-white font-semibold mb-3 text-lg">
                    Your Answer:
                  </label>
                  <div className="relative">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-lg resize-none shadow-inner"
                      placeholder="Type what you heard or use the microphone..."
                      rows="3"
                    />
                    <div className="absolute right-4 top-4">
                      <button
                        onClick={
                          isRecording
                            ? stopMicAndRecognition
                            : startMicAndRecognition
                        }
                        className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isRecording
                            ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl shadow-red-500/30 animate-pulse"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/30"
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-6 h-6" />
                        ) : (
                          <Mic className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isRecording && (
                    <div className="text-center mt-3">
                      <p className="text-cyan-400 font-semibold animate-pulse">
                        🎤 Recording... (will stop automatically after 2 seconds
                        of silence)
                      </p>
                      <p className="text-white/70 text-sm">
                        Duration: {formatTime(recordingTime * 1000)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Audio Playback if recorded */}
                {audioUrl && (
                  <div className="bg-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white">Recorded Answer</span>
                    </div>
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => handleResetAnswer(currentQuestion)}
                    className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl shadow-gray-500/30"
                  >
                    Reset
                  </button>

                  {currentQuestion < currentQuestions.length - 1 ? (
                    <button
                      onClick={() => handleSaveAnswer(currentQuestion)}
                      disabled={!userAnswer.trim() && !audioUrl}
                      className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitAssignment}
                      disabled={!userAnswer.trim() && !audioUrl}
                      className="px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Assignment
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                *** Assignment Summary ***
              </h3>

              <div className="space-y-4 mb-6">
                {currentQuestions.map((question, index) => {
                  const answer = recordedAnswers[index];
                  return (
                    <div key={index} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">
                            Question {index + 1}: {question.text}
                          </h4>
                          {answer?.audioUrl || answer?.textAnswer ? (
                            <div className="mt-3 space-y-2">
                              {answer.audioUrl && (
                                <div className="flex items-center gap-3">
                                  <audio
                                    controls
                                    src={answer.audioUrl}
                                    className="flex-1 max-w-md"
                                  />
                                  <span className="text-white/60 text-sm">
                                    {answer.duration
                                      ? formatTime(answer.duration)
                                      : ""}
                                  </span>
                                </div>
                              )}
                              {answer.textAnswer && (
                                <div className="mt-2">
                                  <p className="text-white/80 text-sm mb-1">
                                    Text Answer:
                                  </p>
                                  <div className="bg-white/10 px-3 py-2 rounded-lg text-white">
                                    {answer.textAnswer}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-red-400/80 flex items-center gap-2 mt-2">
                              <XCircle className="w-4 h-4" />
                              <span>No answer submitted</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-1">
                          {answer?.audioUrl || answer?.textAnswer ? (
                            <CheckCircle className="text-green-400 w-5 h-5" />
                          ) : (
                            <XCircle className="text-red-400 w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handleBackToEditing}
                  className="px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-400/40 text-gray-100 hover:bg-gray-500/30 transition-colors"
                >
                  Back to Editing
                </button>
                <button
                  onClick={handleGenerateCombinedAudio}
                  disabled={audioGenerating}
                  className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30 transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {audioGenerating
                    ? audioProgress
                      ? `Generating Audio (${audioProgress.current} / ${audioProgress.total})...`
                      : "Generating..."
                    : "Generate Combined Audio"}
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={
                    recordedAnswers.filter(
                      (a) => a?.textAnswer && a.textAnswer.trim()
                    ).length === 0
                  }
                  className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-100 hover:bg-purple-500/30 transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-4 h-4" />
                  Generate PDF Report
                </button>
              </div>
            </div>
          )}

          {!hasPlayedOnce && !showSummary && (
            <div className="text-center">
              <p className="text-white/60 text-lg">
                Click "Read me the Next Question" to start
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">
            How to Complete Your Assignment
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-white/80">
            <div>
              <p className="mb-2">
                • Click "Read me the Next Question" to hear the question
              </p>
              <p className="mb-2">
                • Record your response using the microphone
              </p>
              <p>• You can also type your answer</p>
            </div>
            <div>
              <p className="mb-2">• Review all answers before submission</p>
              <p className="mb-2">
                • Download your recordings or generate a PDF report
              </p>
              <p>• You can return to edit answers before final submission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictationAssignmentApp;
