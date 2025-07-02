import { Play, Mic, SkipForward, Star, Trophy, Target, Clock, Volume2, Home, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MicOff, VolumeX, Pause } from 'lucide-react';
import { Search, Filter, BookOpen, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Trophy, TrendingUp, Target, Award, Clock, Star, Brain, Zap } from 'lucide-react';
import { Search, Bell, User, Heart, Share2, MessageCircle, Settings, Star, ChevronRight, Play, Pause, SkipForward, Volume2, Download, Eye, Calendar, Clock, MapPin, Mail, Phone, Globe, CheckCircle, AlertCircle, Info, X } from 'lucide-react';


const DIFFICULTY_LEVELS = [
  { id: 'rookie', name: 'Rookie', icon: '🌱', color: 'from-green-400 to-blue-500' },
  { id: 'racer', name: 'Racer', icon: '🚀', color: 'from-blue-500 to-purple-600' },
  { id: 'master', name: 'Master', icon: '🎯', color: 'from-purple-600 to-pink-600' },
  { id: 'prodigy', name: 'Prodigy', icon: '🧠', color: 'from-pink-600 to-red-600' },
  { id: 'wizard', name: 'Wizard', icon: '🧙‍♂️', color: 'from-red-600 to-orange-600' }
];

const GlassCard = ({ children, className = "", onClick = null, hover = true }) => (
  <div 
    className={`
      backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl
      ${hover ? 'hover:bg-white/20 hover:scale-105 hover:shadow-3xl' : ''}
      transition-all duration-300 transform-gpu
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
    onClick={onClick}
  >
    {children}
  </div>
);

const AnimatedButton = ({ children, onClick, variant = 'primary', className = "", disabled = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        text-white font-bold py-4 px-8 rounded-2xl shadow-lg
        transform transition-all duration-200 hover:scale-110 hover:shadow-xl
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-3 text-lg
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default function PronunciationPowerStar() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, summary
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    attempts: 0,
    skipped: 0,
    accuracy: 0,
    totalTime: 0
  });
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const timerRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handlePronunciationResult(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Game Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameState]);

  const startGame = () => {
    if (!selectedClass || !selectedDifficulty) return;
    
    const words = WORD_DATABASE[selectedClass].words;
    const timeLimit = WORD_DATABASE[selectedClass].timeLimit;
    
    setCurrentWord(words[0]);
    setCurrentWordIndex(0);
    setTimeLeft(timeLimit);
    setScore(0);
    setGameStats({
      correct: 0,
      attempts: 0,
      skipped: 0,
      accuracy: 0,
      totalTime: timeLimit
    });
    setGameState('playing');
  };

  const startRecording = () => {
    if (recognition && !isListening) {
      setIsRecording(true);
      setIsListening(true);
      recognition.start();
    }
  };

  const handlePronunciationResult = (transcript) => {
    const isCorrect = transcript === currentWord.toLowerCase();
    
    setGameStats(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      accuracy: Math.round(((prev.correct + (isCorrect ? 1 : 0)) / (prev.attempts + 1)) * 100)
    }));
    
    if (isCorrect) {
      setScore(prev => prev + getScoreForClass());
      nextWord();
    }
  };

  const getScoreForClass = () => {
    const baseScore = {
      'Class I-II': 10,
      'Class III-V': 15,
      'Class VI-X': 25
    };
    return baseScore[selectedClass] || 10;
  };

  const nextWord = () => {
    const words = WORD_DATABASE[selectedClass].words;
    const nextIndex = currentWordIndex + 1;
    
    if (nextIndex < words.length) {
      setCurrentWord(words[nextIndex]);
      setCurrentWordIndex(nextIndex);
    } else {
      endGame();
    }
  };

  const skipWord = () => {
    setGameStats(prev => ({
      ...prev,
      skipped: prev.skipped + 1
    }));
    nextWord();
  };

  const playWordAudio = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const endGame = () => {
    setGameState('summary');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedClass('');
    setSelectedDifficulty('');
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
              🎯 Pronunciation Power Star 🌟
            </h1>
            <p className="text-xl text-white/80">Practice reading and become a reading champion!</p>
          </div>

          {/* Main Menu Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Your Class */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🎓</div>
                <h3 className="text-2xl font-bold text-white mb-6">Your Class</h3>
                <div className="space-y-4">
                  {Object.keys(WORD_DATABASE).map((classLevel) => (
                    <button
                      key={classLevel}
                      onClick={() => setSelectedClass(classLevel)}
                      className={`w-full p-4 rounded-xl font-bold transition-all duration-300 ${
                        selectedClass === classLevel
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg transform scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ⭐ {classLevel}
                      <div className="text-sm opacity-80">{WORD_DATABASE[classLevel].difficultyLevel}</div>
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Difficulty */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-6">Difficulty</h3>
                <div className="space-y-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`w-full p-3 rounded-xl font-bold transition-all duration-300 ${
                        selectedDifficulty === level.id
                          ? `bg-gradient-to-r ${level.color} text-white shadow-lg transform scale-105`
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {level.icon} {level.name}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Content */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-6">Content</h3>
                <div className="space-y-4">
                  <div className="bg-cyan-500/20 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📖</div>
                    <h4 className="font-bold text-white">Words</h4>
                    <p className="text-sm text-white/80">Single word adventures</p>
                  </div>
                  <div className="bg-orange-500/20 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📝</div>
                    <h4 className="font-bold text-white">Sentences</h4>
                    <p className="text-sm text-white/80">Complete sentence journeys</p>
                  </div>
                  <div className="bg-pink-500/20 p-4 rounded-xl">
                    <div className="text-2xl mb-2">📄</div>
                    <h4 className="font-bold text-white">Paragraphs</h4>
                    <p className="text-sm text-white/80">Epic paragraph quests</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <AnimatedButton
              onClick={startGame}
              disabled={!selectedClass || !selectedDifficulty}
              className="text-2xl py-6 px-12"
            >
              <Mic className="w-8 h-8" />
              START THE ADVENTURE!
              <Star className="w-8 h-8" />
            </AnimatedButton>
          </div>

          {/* Instructions */}
          <GlassCard className="mt-8 p-6">
            <div className="text-center">
              <p className="text-white/80 text-lg">
                ⭐ Please select your class, difficulty, and content type to begin your reading adventure! ⭐
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Home className="w-6 h-6" />
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">{score}</span>
              </div>
              
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold">{timeLeft}s</span>
              </div>
              
              <button 
                onClick={endGame}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                End Game
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-white/20 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                style={{ 
                  width: `${((currentWordIndex + 1) / WORD_DATABASE[selectedClass].words.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Main Game Area */}
          <GlassCard className="p-12 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Volume2 className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Read this word:</h2>
              </div>
              
              <p className="text-blue-300 text-lg mb-8">
                Ready for the next one? Click the microphone!
              </p>
              
              <div className="text-8xl font-bold text-white mb-12 tracking-wider">
                {currentWord}
              </div>
              
              <div className="flex justify-center items-center gap-6 mb-8">
                <button
                  onClick={startRecording}
                  disabled={isRecording}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl
                    transition-all duration-300 transform hover:scale-110
                    ${isRecording 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-green-500 hover:bg-green-600 shadow-lg'
                    }
                  `}
                >
                  <Mic className={`w-10 h-10 ${isRecording ? 'animate-bounce' : ''}`} />
                </button>
                
                <AnimatedButton onClick={playWordAudio} variant="secondary">
                  <Volume2 className="w-6 h-6" />
                  Play Audio
                </AnimatedButton>
                
                <AnimatedButton onClick={skipWord} variant="warning">
                  <SkipForward className="w-6 h-6" />
                  Skip Word
                </AnimatedButton>
              </div>
              
              <p className="text-white/60">
                {isRecording ? 'Listening... Speak now!' : 'Click to start speaking'}
              </p>
            </div>
          </GlassCard>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-blue-300">{gameStats.correct}</div>
              <div className="text-white/80">Correct</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-green-300">{gameStats.accuracy}%</div>
              <div className="text-white/80">Accuracy</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-purple-300">{gameStats.attempts}</div>
              <div className="text-white/80">Attempts</div>
            </GlassCard>
            
            <GlassCard className="p-4 text-center" hover={false}>
              <div className="text-3xl font-bold text-orange-300">{gameStats.skipped}</div>
              <div className="text-white/80">Skipped</div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const totalPossibleScore = WORD_DATABASE[selectedClass].words.length * getScoreForClass();
    const scorePercentage = Math.round((score / totalPossibleScore) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌟</div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
              Keep Practicing!
            </h1>
          </div>

          {/* Session Summary */}
          <GlassCard className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              📊 Session Summary
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">📖 Words</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Completed: <span className="text-white font-bold">{gameStats.correct}</span></div>
                  <div>Skipped: <span className="text-white font-bold">{gameStats.skipped}</span></div>
                  <div>Display Class: <span className="text-white font-bold">{WORD_DATABASE[selectedClass].difficultyLevel}</span></div>
                  <div>Difficulty: <span className="text-white font-bold">Easy</span></div>
                </div>
              </div>
              
              <div className="bg-green-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">📝 Sentences</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Completed: <span className="text-white font-bold">0</span></div>
                  <div>Skipped: <span className="text-white font-bold">0</span></div>
                  <div>Display Class: <span className="text-white font-bold">Intermediate</span></div>
                  <div>Difficulty: <span className="text-white font-bold">Medium</span></div>
                </div>
              </div>
              
              <div className="bg-pink-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-white mb-2">📄 Paragraphs</h3>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Completed: <span className="text-white font-bold">0</span></div>
                  <div>Skipped: <span className="text-white font-bold">0</span></div>
                  <div>Display Class: <span className="text-white font-bold">Advanced</span></div>
                  <div>Difficulty: <span className="text-white font-bold">Hard</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-500/20 p-4 rounded-xl text-center">
              <span className="text-yellow-300">⚠️</span>
              <span className="text-white font-bold ml-2">Total Skipped: {gameStats.skipped}</span>
            </div>
          </GlassCard>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-blue-400 mb-2">{score}</div>
              <div className="text-white/80">Total Score</div>
              <div className="text-sm text-white/60">Points Earned</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-green-400 mb-2">{gameStats.accuracy}%</div>
              <div className="text-white/80">Overall Accuracy</div>
              <div className="text-sm text-white/60">Precision Rate</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-purple-400 mb-2">{gameStats.correct}</div>
              <div className="text-white/80">Correct Readings</div>
              <div className="text-sm text-white/60">Well Done!</div>
            </GlassCard>
            
            <GlassCard className="p-6 text-center" hover={false}>
              <div className="text-4xl font-bold text-orange-400 mb-2">{WORD_DATABASE[selectedClass].timeLimit - timeLeft}s</div>
              <div className="text-white/80">Time Taken</div>
              <div className="text-sm text-white/60">Duration</div>
            </GlassCard>
          </div>

          {/* Recent Results */}
          <GlassCard className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              📋 Recent Results
            </h2>
            <div className="text-white/60 text-center py-8">
              Session completed! Check your progress above.
            </div>
          </GlassCard>

          {/* Play Again */}
          <div className="text-center">
            <AnimatedButton
              onClick={resetGame}
              className="text-2xl py-6 px-12"
            >
              <RotateCcw className="w-8 h-8" />
              🎮 Play Again!
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const AudioSpeechEngine = ({ 
  targetWord, 
  onResult, 
  classGroup = 'I-II',
  difficulty = 'easy' 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize Speech Recognition and Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition Setup
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        recognitionInstance.maxAlternatives = 3;
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
          startAudioLevelMonitoring();
        };
        
        recognitionInstance.onresult = (event) => {
          const results = Array.from(event.results);
          const finalResult = results.find(result => result.isFinal);
          
          if (finalResult) {
            const speechResult = finalResult[0];
            const transcriptText = speechResult.transcript.toLowerCase().trim();
            const confidenceScore = speechResult.confidence || 0;
            
            setTranscript(transcriptText);
            setConfidence(confidenceScore);
            
            const analysis = analyzePronounciation(transcriptText, targetWord, confidenceScore);
            setAnalysisResult(analysis);
            
            if (onResult) {
              onResult(analysis);
            }
          }
        };
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          stopAudioLevelMonitoring();
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
          stopAudioLevelMonitoring();
        };
        
        setRecognition(recognitionInstance);
      }
      
      // Speech Synthesis Setup
      if (window.speechSynthesis) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio Level Monitoring
  const startAudioLevelMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          
          if (isListening) {
            animationRef.current = requestAnimationFrame(updateAudioLevel);
          }
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioLevelMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  // Pronunciation Analysis Engine
  const analyzePronounciation = (spoken, target, confidence) => {
    const spokenWords = spoken.split(' ');
    const targetWords = target.toLowerCase().split(' ');
    
    // Basic similarity calculation (can be enhanced with more sophisticated algorithms)
    const similarity = calculateSimilarity(spoken, target.toLowerCase());
    const wordMatch = spokenWords.some(word => 
      targetWords.some(targetWord => 
        levenshteinDistance(word, targetWord) <= Math.max(1, Math.floor(targetWord.length * 0.2))
      )
    );
    
    // Class-specific scoring
    let scoreMultiplier = 1;
    let minAccuracy = 0.6;
    
    switch (classGroup) {
      case 'I-II':
        scoreMultiplier = 1.2;
        minAccuracy = 0.5;
        break;
      case 'III-V':
        scoreMultiplier = 1.0;
        minAccuracy = 0.65;
        break;
      case 'VI-X':
        scoreMultiplier = 0.9;
        minAccuracy = 0.75;
        break;
    }
    
    const baseScore = (similarity * 0.4 + confidence * 0.4 + (wordMatch ? 0.2 : 0)) * scoreMultiplier;
    const finalScore = Math.max(0, Math.min(1, baseScore));
    
    return {
      transcript: spoken,
      target: target,
      confidence: confidence,
      similarity: similarity,
      wordMatch: wordMatch,
      score: finalScore,
      accuracy: finalScore * 100,
      passed: finalScore >= minAccuracy,
      feedback: generateFeedback(finalScore, classGroup),
      phonetics: generatePhoneticFeedback(spoken, target, classGroup)
    };
  };

  // String similarity calculation
  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Generate contextual feedback
  const generateFeedback = (score, classGroup) => {
    const feedbackSets = {
      'I-II': {
        excellent: ['🌟 Perfect! You are a star!', '🎉 Amazing job!', '🏆 You did it!'],
        good: ['😊 Good try! Almost there!', '👍 Nice work!', '🌈 Keep going!'],
        poor: ['💪 Try again! You can do it!', '🎯 Listen and repeat!', '🌟 Practice makes perfect!']
      },
      'III-V': {
        excellent: ['🌟 Excellent pronunciation!', '🎯 Spot on! Well done!', '🏆 Perfect accuracy!'],
        good: ['👍 Good effort! Getting closer!', '😊 Nice try! Keep practicing!', '🎵 Almost perfect!'],
        poor: ['🎯 Focus on the sounds!', '📚 Listen carefully and try again!', '💡 Break it into syllables!']
      },
      'VI-X': {
        excellent: ['🌟 Outstanding pronunciation mastery!', '🎯 Flawless execution!', '🏆 Exceptional accuracy!'],
        good: ['👍 Solid pronunciation skills!', '😊 Good accuracy, minor adjustments needed!', '📈 Showing improvement!'],
        poor: ['🎯 Focus on phonetic accuracy!', '📚 Analyze the sound patterns!', '💡 Consider stress and intonation!']
      }
    };
    
    const level = score >= 0.8 ? 'excellent' : score >= 0.6 ? 'good' : 'poor';
    const messages = feedbackSets[classGroup][level];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Generate phonetic feedback
  const generatePhoneticFeedback = (spoken, target, classGroup) => {
    if (classGroup === 'VI-X') {
      // More detailed phonetic analysis for advanced students
      return {
        vowelAccuracy: Math.random() * 0.3 + 0.7, // Placeholder for actual analysis
        consonantAccuracy: Math.random() * 0.3 + 0.7,
        stressPattern: Math.random() > 0.5 ? 'correct' : 'needs_work',
        suggestions: ['Focus on vowel clarity', 'Work on consonant precision']
      };
    }
    return null;
  };

  // Speech Functions
  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      setAnalysisResult(null);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const playWord = () => {
    if (speechSynthesis && !isMuted) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.rate = classGroup === 'I-II' ? 0.8 : classGroup === 'III-V' ? 0.9 : 1.0;
      utterance.pitch = classGroup === 'I-II' ? 1.2 : 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      
      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    }
  };

  const stopPlaying = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying) {
      stopPlaying();
    }
  };

  const reset = () => {
    stopListening();
    stopPlaying();
    setTranscript('');
    setAnalysisResult(null);
    setConfidence(0);
    setAudioLevel(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🎤 Pronunciation Engine</h2>
        <p className="text-white/80">Target Word: <span className="font-semibold text-blue-200">{targetWord}</span></p>
      </div>

      {/* Audio Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={isPlaying ? stopPlaying : playWord}
          disabled={isMuted}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-xl text-white hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Stop' : 'Play'}
        </button>

        <button
          onClick={toggleMute}
          className="flex items-center gap-2 px-4 py-3 bg-gray-500/20 backdrop-blur-sm border border-gray-300/30 rounded-xl text-white hover:bg-gray-500/30 transition-all duration-300"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 bg-orange-500/20 backdrop-blur-sm border border-orange-300/30 rounded-xl text-white hover:bg-orange-500/30 transition-all duration-300"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Recording Controls */}
      <div className="text-center mb-6">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 transition-all duration-300 ${
            isListening 
              ? 'bg-red-500/30 border-red-400 animate-pulse' 
              : 'bg-green-500/20 border-green-400 hover:bg-green-500/30'
          }`}
        >
          {isListening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
          
          {/* Audio level indicator */}
          {isListening && (
            <div 
              className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"
              style={{ 
                transform: `scale(${1 + (audioLevel / 255) * 0.5})`,
                opacity: audioLevel / 255 
              }}
            />
          )}
        </button>
        
        <p className="text-white/80 mt-2">
          {isListening ? '🎤 Listening...' : '👆 Click to start recording'}
        </p>
      </div>

      {/* Results Display */}
      {transcript && (
        <div className="mb-4 p-4 bg-white/10 rounded-xl border border-white/20">
          <h3 className="text-white font-semibold mb-2">📝 What you said:</h3>
          <p className="text-blue-200 text-lg">{transcript}</p>
        </div>
      )}

      {analysisResult && (
        <div className="space-y-4">
          {/* Score Display */}
          <div className="p-4 bg-white/10 rounded-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">📊 Score</h3>
              <span className={`text-2xl font-bold ${
                analysisResult.passed ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {Math.round(analysisResult.accuracy)}%
              </span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 mb-3">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  analysisResult.passed ? 'bg-green-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${analysisResult.accuracy}%` }}
              />
            </div>
            
            <p className="text-white/90 text-center">{analysisResult.feedback}</p>
          </div>

          {/* Detailed Analysis for Advanced Classes */}
          {classGroup === 'VI-X' && analysisResult.phonetics && (
            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
              <h3 className="text-white font-semibold mb-2">🔍 Phonetic Analysis</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/70">Vowel Accuracy:</span>
                  <span className="text-blue-200 ml-2">{Math.round(analysisResult.phonetics.vowelAccuracy * 100)}%</span>
                </div>
                <div>
                  <span className="text-white/70">Consonant Accuracy:</span>
                  <span className="text-blue-200 ml-2">{Math.round(analysisResult.phonetics.consonantAccuracy * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Comprehensive Word Database
const WORD_DATABASE = {
  'I-II': {
    easy: [
      { word: 'cat', syllables: 1, difficulty: 1, category: 'animals', phonetic: '/kæt/', definition: 'A small furry pet animal', example: 'The cat is sleeping.' },
      { word: 'dog', syllables: 1, difficulty: 1, category: 'animals', phonetic: '/dɒg/', definition: 'A friendly pet animal', example: 'My dog likes to play.' },
      { word: 'sun', syllables: 1, difficulty: 1, category: 'nature', phonetic: '/sʌn/', definition: 'The bright star in the sky', example: 'The sun is shining.' },
      { word: 'moon', syllables: 1, difficulty: 1, category: 'nature', phonetic: '/muːn/', definition: 'The bright circle in the night sky', example: 'The moon is full tonight.' },
      { word: 'tree', syllables: 1, difficulty: 1, category: 'nature', phonetic: '/triː/', definition: 'A tall plant with leaves', example: 'The tree has green leaves.' },
      { word: 'house', syllables: 1, difficulty: 2, category: 'objects', phonetic: '/haʊs/', definition: 'A place where people live', example: 'I live in a big house.' },
      { word: 'water', syllables: 2, difficulty: 2, category: 'nature', phonetic: '/ˈwɔːtə/', definition: 'Clear liquid we drink', example: 'I drink water every day.' },
      { word: 'happy', syllables: 2, difficulty: 2, category: 'emotions', phonetic: '/ˈhæpi/', definition: 'Feeling good and joyful', example: 'I am happy today.' },
      { word: 'flower', syllables: 2, difficulty: 2, category: 'nature', phonetic: '/ˈflaʊə/', definition: 'A pretty part of a plant', example: 'The flower smells nice.' },
      { word: 'rainbow', syllables: 2, difficulty: 3, category: 'nature', phonetic: '/ˈreɪnboʊ/', definition: 'Colors in the sky after rain', example: 'I see a beautiful rainbow.' }
    ],
    medium: [
      { word: 'elephant', syllables: 3, difficulty: 3, category: 'animals', phonetic: '/ˈeləfənt/', definition: 'A big gray animal with a long nose', example: 'The elephant is very big.' },
      { word: 'butterfly', syllables: 3, difficulty: 3, category: 'animals', phonetic: '/ˈbʌtərflaɪ/', definition: 'A pretty flying insect', example: 'The butterfly has colorful wings.' },
      { word: 'chocolate', syllables: 3, difficulty: 3, category: 'food', phonetic: '/ˈtʃɔːklət/', definition: 'A sweet brown treat', example: 'I love eating chocolate.' },
      { word: 'umbrella', syllables: 3, difficulty: 3, category: 'objects', phonetic: '/ʌmˈbrelə/', definition: 'Something to keep you dry in rain', example: 'Take your umbrella, it might rain.' },
      { word: 'bicycle', syllables: 3, difficulty: 3, category: 'objects', phonetic: '/ˈbaɪsɪkəl/', definition: 'A bike with two wheels', example: 'I can ride my bicycle fast.' }
    ]
  },
  'III-V': {
    easy: [
      { word: 'adventure', syllables: 3, difficulty: 4, category: 'action', phonetic: '/ədˈventʃər/', definition: 'An exciting experience or journey', example: 'We went on an adventure in the forest.' },
      { word: 'beautiful', syllables: 3, difficulty: 4, category: 'description', phonetic: '/ˈbjuːtəfəl/', definition: 'Very pretty or pleasing to look at', example: 'The sunset looks beautiful tonight.' },
      { word: 'computer', syllables: 3, difficulty: 4, category: 'technology', phonetic: '/kəmˈpjuːtər/', definition: 'An electronic device for processing data', example: 'I use my computer for homework.' },
      { word: 'dangerous', syllables: 3, difficulty: 4, category: 'description', phonetic: '/ˈdeɪndʒərəs/', definition: 'Something that could cause harm', example: 'It is dangerous to play with fire.' },
      { word: 'exciting', syllables: 3, difficulty: 4, category: 'emotions', phonetic: '/ɪkˈsaɪtɪŋ/', definition: 'Making you feel eager and enthusiastic', example: 'The roller coaster ride was exciting.' }
    ],
    medium: [
      { word: 'magnificent', syllables: 4, difficulty: 5, category: 'description', phonetic: '/mægˈnɪfəsənt/', definition: 'Extremely beautiful or impressive', example: 'The palace was magnificent to behold.' },
      { word: 'temperature', syllables: 4, difficulty: 5, category: 'science', phonetic: '/ˈtemprətʃər/', definition: 'How hot or cold something is', example: 'The temperature outside is very high.' },
      { word: 'understand', syllables: 3, difficulty: 5, category: 'mental', phonetic: '/ˌʌndərˈstænd/', definition: 'To know the meaning of something', example: 'I understand the math problem now.' },
      { word: 'vocabulary', syllables: 4, difficulty: 5, category: 'language', phonetic: '/voʊˈkæbjəˌleri/', definition: 'All the words a person knows', example: 'Reading books helps expand your vocabulary.' },
      { word: 'wonderful', syllables: 3, difficulty: 4, category: 'description', phonetic: '/ˈwʌndərfəl/', definition: 'Extremely good or pleasant', example: 'We had a wonderful time at the park.' }
    ],
    hard: [
      { word: 'extraordinary', syllables: 5, difficulty: 6, category: 'description', phonetic: '/ɪkˈstrɔːrdənˌeri/', definition: 'Very unusual or remarkable', example: 'Her performance was extraordinary.' },
      { word: 'imagination', syllables: 5, difficulty: 6, category: 'mental', phonetic: '/ɪˌmædʒəˈneɪʃən/', definition: 'The ability to create ideas and images in your mind', example: 'Use your imagination to write a story.' },
      { word: 'responsibility', syllables: 6, difficulty: 6, category: 'character', phonetic: '/rɪˌspɑːnsəˈbɪləti/', definition: 'Being accountable for your actions', example: 'Taking care of pets is a big responsibility.' }
    ]
  },
  'VI-X': {
    easy: [
      { word: 'abbreviation', syllables: 5, difficulty: 6, category: 'language', phonetic: '/əˌbriviˈeɪʃən/', definition: 'A shortened form of a word or phrase', example: 'NASA is an abbreviation for National Aeronautics and Space Administration.' },
      { word: 'achievement', syllables: 3, difficulty: 6, category: 'success', phonetic: '/əˈtʃiːvmənt/', definition: 'Something accomplished successfully', example: 'Graduating from school is a great achievement.' },
      { word: 'bibliography', syllables: 5, difficulty: 7, category: 'academic', phonetic: '/ˌbɪbliˈɑːgrə fi/', definition: 'A list of books and sources used in research', example: 'The research paper included a comprehensive bibliography.' },
      { word: 'circumstance', syllables: 3, difficulty: 6, category: 'situation', phonetic: '/ˈsɜːrkəmstəns/', definition: 'The conditions or factors affecting a situation', example: 'Under the circumstances, we made the best decision possible.' },
      { word: 'democracy', syllables: 4, difficulty: 6, category: 'politics', phonetic: '/dɪˈmɑːkrəsi/', definition: 'A system of government by the people', example: 'In a democracy, citizens have the right to vote.' }
    ],
    medium: [
      { word: 'entrepreneurship', syllables: 5, difficulty: 8, category: 'business', phonetic: '/ˌɑːntrəprəˈnɜːrʃɪp/', definition: 'The activity of setting up businesses', example: 'Entrepreneurship requires creativity and risk-taking.' },
      { word: 'phenomenon', syllables: 4, difficulty: 7, category: 'science', phonetic: '/fəˈnɑːmənən/', definition: 'A remarkable or observable occurrence', example: 'The aurora borealis is a natural phenomenon.' },
      { word: 'psychological', syllables: 5, difficulty: 7, category: 'science', phonetic: '/ˌsaɪkəˈlɑːdʒɪkəl/', definition: 'Related to the human mind and behavior', example: 'The psychological effects of stress can be significant.' },
      { word: 'representation', syllables: 5, difficulty: 7, category: 'concept', phonetic: '/ˌreprɪzənˈteɪʃən/', definition: 'The action of speaking or acting on behalf of someone', example: 'Each state has representation in Congress.' },
      { word: 'sophisticated', syllables: 4, difficulty: 7, category: 'description', phonetic: '/səˈfɪstəˌkeɪtəd/', definition: 'Complex, refined, or advanced', example: 'The smartphone has sophisticated features.' }
    ],
    hard: [
      { word: 'conscientious', syllables: 4, difficulty: 8, category: 'character', phonetic: '/ˌkɑːnʃiˈenʃəs/', definition: 'Careful and thorough in work or duties', example: 'She is a conscientious student who always completes assignments.' },
      { word: 'incomprehensible', syllables: 6, difficulty: 9, category: 'description', phonetic: '/ɪnˌkɑːmprɪˈhensəbəl/', definition: 'Impossible to understand', example: 'The advanced physics theory was incomprehensible to most students.' },
      { word: 'philanthropist', syllables: 4, difficulty: 8, category: 'character', phonetic: '/fɪˈlænθrəpɪst/', definition: 'A person who helps others through charitable giving', example: 'The philanthropist donated millions to education.' },
      { word: 'superintendent', syllables: 5, difficulty: 8, category: 'profession', phonetic: '/ˌsuːpərɪnˈtendənt/', definition: 'A person who supervises or manages something', example: 'The school superintendent oversees all district schools.' },
      { word: 'uncharacteristic', syllables: 6, difficulty: 9, category: 'description', phonetic: '/ˌʌnˌkærəktəˈrɪstɪk/', definition: 'Not typical of someone\'s usual behavior', example: 'It was uncharacteristic of him to arrive late.' }
    ]
  }
};

// Categories for filtering
const CATEGORIES = {
  'I-II': ['animals', 'nature', 'objects', 'emotions', 'food'],
  'III-V': ['action', 'description', 'technology', 'emotions', 'science', 'mental', 'language', 'character'],
  'VI-X': ['language', 'success', 'academic', 'situation', 'politics', 'business', 'science', 'concept', 'character', 'profession']
};

const WordDatabaseManager = ({ 
  classGroup = 'III-V', 
  onWordSelect, 
  selectedWords = [],
  practiceHistory = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('difficulty');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, practice
  const [customWords, setCustomWords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({
    word: '',
    syllables: 1,
    difficulty: 1,
    category: '',
    phonetic: '',
    definition: '',
    example: ''
  });

  // Get available words for current class group
  const availableWords = useMemo(() => {
    const classWords = WORD_DATABASE[classGroup];
    if (!classWords) return [];
    
    return [
      ...(classWords.easy || []),
      ...(classWords.medium || []),
      ...(classWords.hard || []),
      ...customWords.filter(word => word.classGroup === classGroup)
    ];
  }, [classGroup, customWords]);

  // Filter and sort words
  const filteredWords = useMemo(() => {
    let filtered = availableWords.filter(word => {
      const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           word.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty.toString() === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort words
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          return a.difficulty - b.difficulty;
        case 'alphabetical':
          return a.word.localeCompare(b.word);
        case 'syllables':
          return a.syllables - b.syllables;
        case 'practice':
          const aCount = practiceHistory.filter(h => h.word === a.word).length;
          const bCount = practiceHistory.filter(h => h.word === b.word).length;
          return bCount - aCount; // Most practiced first
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableWords, searchTerm, selectedCategory, selectedDifficulty, sortBy, practiceHistory]);

  // Get practice statistics for a word
  const getWordStats = (word) => {
    const attempts = practiceHistory.filter(h => h.word === word.word);
    const successful = attempts.filter(a => a.passed);
    
    return {
      attempts: attempts.length,
      successRate: attempts.length > 0 ? (successful.length / attempts.length) * 100 : 0,
      lastAttempt: attempts.length > 0 ? new Date(attempts[attempts.length - 1].timestamp) : null,
      averageScore: attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0
    };
  };

  // Add custom word
  const addCustomWord = () => {
    if (newWord.word.trim()) {
      const customWord = {
        ...newWord,
        id: `custom_${Date.now()}`,
        classGroup: classGroup,
        isCustom: true
      };
      
      setCustomWords(prev => [...prev, customWord]);
      setNewWord({
        word: '',
        syllables: 1,
        difficulty: 1,
        category: '',
        phonetic: '',
        definition: '',
        example: ''
      });
      setShowAddForm(false);
    }
  };

  // Difficulty colors
  const getDifficultyColor = (difficulty) => {
    const colors = {
      1: 'text-green-400 bg-green-500/20',
      2: 'text-green-400 bg-green-500/20',
      3: 'text-blue-400 bg-blue-500/20',
      4: 'text-blue-400 bg-blue-500/20',
      5: 'text-yellow-400 bg-yellow-500/20',
      6: 'text-yellow-400 bg-yellow-500/20',
      7: 'text-orange-400 bg-orange-500/20',
      8: 'text-red-400 bg-red-500/20',
      9: 'text-red-400 bg-red-500/20'
    };
    return colors[difficulty] || 'text-gray-400 bg-gray-500/20';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">📚 Word Database Manager</h2>
          <p className="text-white/80">Class Group: <span className="font-semibold text-blue-200">{classGroup}</span></p>
        </div>
        <div className="text-right">
          <p className="text-white/80">Total Words: <span className="font-semibold text-blue-200">{availableWords.length}</span></p>
          <p className="text-white/80">Filtered: <span className="font-semibold text-green-200">{filteredWords.length}</span></p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all"
        >
          <option value="all">All Categories</option>
          {CATEGORIES[classGroup]?.map(category => (
            <option key={category} value={category} className="bg-gray-800">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all"
        >
          <option value="all">All Difficulties</option>
          {Array.from({ length: 9 }, (_, i) => i + 1).map(level => (
            <option key={level} value={level.toString()} className="bg-gray-800">
              Level {level}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 transition-all"
        >
          <option value="difficulty" className="bg-gray-800">Sort by Difficulty</option>
          <option value="alphabetical" className="bg-gray-800">Sort Alphabetically</option>
          <option value="syllables" className="bg-gray-800">Sort by Syllables</option>
          <option value="practice" className="bg-gray-800">Sort by Practice</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === 'grid' 
              ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50' 
              : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === 'list' 
              ? 'bg-blue-500/30 text-blue-200 border border-blue-400/50' 
              : 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/20'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-500/20 text-green-200 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition-all"
        >
          + Add Custom Word
        </button>
      </div>

      {/* Add Custom Word Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Add Custom Word</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Word"
              value={newWord.word}
              onChange={(e) => setNewWord(prev => ({ ...prev, word: e.target.value }))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
            />
            <input
              type="number"
              placeholder="Syllables"
              min="1"
              max="10"
              value={newWord.syllables}
              onChange={(e) => setNewWord(prev => ({ ...prev, syllables: parseInt(e.target.value) || 1 }))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
            />
            <input
              type="number"
              placeholder="Difficulty (1-9)"
              min="1"
              max="9"
              value={newWord.difficulty}
              onChange={(e) => setNewWord(prev => ({ ...prev, difficulty: parseInt(e.target.value) || 1 }))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
            />
            <select
              value={newWord.category}
              onChange={(e) => setNewWord(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="">Select Category</option>
              {CATEGORIES[classGroup]?.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Phonetic (optional)"
              value={newWord.phonetic}
              onChange={(e) => setNewWord(prev => ({ ...prev, phonetic: e.target.value }))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
            />
            <input
              type="text"
              placeholder="Definition"
              value={newWord.definition}
              onChange={(e) => setNewWord(prev => ({ ...prev, definition: e.target.value }))}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
            />
            <input
              type="text"
              placeholder="Example sentence"
              value={newWord.example}
              onChange={(e) => setNewWord(prev => ({ ...prev, example: e.target.value }))}
              className="md:col-span-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addCustomWord}
              className="px-6 py-2 bg-green-500/20 text-green-200 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition-all"
            >
              Add Word
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-gray-500/20 text-gray-200 border border-gray-400/50 rounded-lg hover:bg-gray-500/30 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Words Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word, index) => {
            const stats = getWordStats(word);
            const isSelected = selectedWords.includes(word.word);
            
            return (
              <div
                key={`${word.word}-${index}`}
                className={`p-4 bg-white/10 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                  isSelected ? 'border-blue-400/50 bg-blue-500/20' : 'border-white/20'
                }`}
                onClick={() => onWordSelect && onWordSelect(word)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{word.word}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(word.difficulty)}`}>
                    L{word.difficulty}
                  </span>
                </div>
                
                {classGroup !== 'I-II' && word.phonetic && (
                  <p className="text-blue-200 text-sm mb-2 font-mono">{word.phonetic}</p>
                )}
                
                <p className="text-white/80 text-sm mb-2">{word.definition}</p>
                
                <div className="flex items-center gap-4 text-xs text-white/60 mb-2">
                  <span>📊 {word.syllables} syllables</span>
                  <span>🏷️ {word.category}</span>
                </div>
                
                {stats.attempts > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-400">✓ {Math.round(stats.successRate)}%</span>
                    <span className="text-blue-400">🎯 {stats.attempts} attempts</span>
                  </div>
                )}
                
                {word.isCustom && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                    Custom
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredWords.map((word, index) => {
            const stats = getWordStats(word);
            const isSelected = selectedWords.includes(word.word);
            
            return (
              <div
                key={`${word.word}-${index}`}
                className={`p-4 bg-white/10 backdrop-blur-sm border rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                  isSelected ? 'border-blue-400/50 bg-blue-500/20' : 'border-white/20'
                }`}
                onClick={() => onWordSelect && onWordSelect(word)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-white">{word.word}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(word.difficulty)}`}>
                        Level {word.difficulty}
                      </span>
                      <span className="text-white/60 text-sm">({word.syllables} syllables)</span>
                      <span className="text-blue-200 text-sm capitalize">{word.category}</span>
                    </div>
                    
                    {classGroup !== 'I-II' && word.phonetic && (
                      <p className="text-blue-200 text-sm mt-1 font-mono">{word.phonetic}</p>
                    )}
                    
                    <p className="text-white/80 text-sm mt-2">{word.definition}</p>
                    
                    {classGroup !== 'I-II' && (
                      <p className="text-white/60 text-sm mt-1 italic">"{word.example}"</p>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    {stats.attempts > 0 && (
                      <div className="text-sm space-y-1">
                        <div className="text-green-400">✓ {Math.round(stats.successRate)}%</div>
                        <div className="text-blue-400">🎯 {stats.attempts}</div>
                        <div className="text-yellow-400">⭐ {Math.round(stats.averageScore * 100)}%</div>
                      </div>
                    )}
                    
                    {word.isCustom && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-white/40 mb-4" />
          <p className="text-white/60 text-lg">No words found matching your criteria.</p>
          <p className="text-white/40 text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-400">{filteredWords.length}</div>
          <div className="text-white/80 text-sm">Available Words</div>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">{selectedWords.length}</div>
          <div className="text-white/80 text-sm">Selected</div>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-yellow-400">{customWords.filter(w => w.classGroup === classGroup).length}</div>
          <div className="text-white/80 text-sm">Custom Words</div>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-purple-400">{CATEGORIES[classGroup]?.length || 0}</div>
          <div className="text-white/80 text-sm">Categories</div>
        </div>
      </div>
    </div>
  );
};


const ScoringAnalyticsSystem = ({ 
  practiceHistory = [], 
  classGroup = 'III-V',
  studentName = 'Student'
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, all
  const [selectedMetric, setSelectedMetric] = useState('accuracy'); // accuracy, speed, consistency
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, comparison

  // Class-specific scoring configurations
  const scoringConfig = {
    'I-II': {
      passingScore: 60,
      excellentScore: 85,
      weights: { accuracy: 0.6, confidence: 0.3, attempt: 0.1 },
      badges: ['First Word', 'Animal Expert', 'Nature Lover', 'Happy Speaker'],
      levels: ['Beginner', 'Speaker', 'Word Star', 'Pronunciation Pro']
    },
    'III-V': {
      passingScore: 65,
      excellentScore: 80,
      weights: { accuracy: 0.5, confidence: 0.3, consistency: 0.2 },
      badges: ['Vocabulary Builder', 'Syllable Master', 'Fluency Fighter', 'Word Warrior'],
      levels: ['Learner', 'Speaker', 'Fluent', 'Master', 'Expert']
    },
    'VI-X': {
      passingScore: 70,
      excellentScore: 85,
      weights: { accuracy: 0.4, confidence: 0.25, consistency: 0.2, phonetics: 0.15 },
      badges: ['Phonetic Pro', 'Accent Master', 'Vocabulary Virtuoso', 'Speaking Specialist'],
      levels: ['Novice', 'Intermediate', 'Advanced', 'Proficient', 'Expert', 'Master']
    }
  };

  const config = scoringConfig[classGroup];

  // Filter practice history by selected period
  const filteredHistory = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
      default:
        cutoffDate.setFullYear(1970);
        break;
    }
    
    return practiceHistory.filter(record => new Date(record.timestamp) >= cutoffDate);
  }, [practiceHistory, selectedPeriod]);

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    if (filteredHistory.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        successRate: 0,
        improvementRate: 0,
        consistencyScore: 0,
        totalWordsLearned: 0,
        averageConfidence: 0,
        timeSpent: 0,
        streakDays: 0,
        strongCategories: [],
        weakCategories: [],
        levelProgress: 0,
        nextLevel: config.levels[0],
        badges: [],
        trendsData: [],
        categoryData: [],
        difficultyData: [],
        weeklyData: []
      };
    }

    const totalAttempts = filteredHistory.length;
    const successfulAttempts = filteredHistory.filter(h => h.passed).length;
    const averageScore = filteredHistory.reduce((sum, h) => sum + (h.score || 0), 0) / totalAttempts;
    const successRate = (successfulAttempts / totalAttempts) * 100;
    const averageConfidence = filteredHistory.reduce((sum, h) => sum + (h.confidence || 0), 0) / totalAttempts;
    
    // Calculate improvement rate
    const firstHalf = filteredHistory.slice(0, Math.floor(totalAttempts / 2));
    const secondHalf = filteredHistory.slice(Math.floor(totalAttempts / 2));
    const firstHalfAvg = firstHalf.reduce((sum, h) => sum + (h.score || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, h) => sum + (h.score || 0), 0) / secondHalf.length;
    const improvementRate = totalAttempts > 1 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;
    
    // Calculate consistency score (lower standard deviation = higher consistency)
    const scores = filteredHistory.map(h => h.score || 0);
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - (standardDeviation * 200)); // Normalize to 0-100
    
    // Count unique words learned
    const uniqueWords = new Set(filteredHistory.filter(h => h.passed).map(h => h.word));
    const totalWordsLearned = uniqueWords.size;
    
    // Calculate time spent (estimate based on attempts)
    const timeSpent = totalAttempts * 2; // Assume ~2 minutes per attempt
    
    // Calculate streak days
    const dates = [...new Set(filteredHistory.map(h => new Date(h.timestamp).toDateString()))];
    const streakDays = dates.length;
    
    // Analyze categories
    const categoryStats = {};
    filteredHistory.forEach(h => {
      if (!categoryStats[h.category]) {
        categoryStats[h.category] = { attempts: 0, successes: 0, scores: [] };
      }
      categoryStats[h.category].attempts++;
      if (h.passed) categoryStats[h.category].successes++;
      categoryStats[h.category].scores.push(h.score || 0);
    });
    
    const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      successRate: (stats.successes / stats.attempts) * 100,
      averageScore: stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length,
      attempts: stats.attempts
    }));

    const sortedCategories = categoryData.sort((a, b) => b.successRate - a.successRate);
  };


const GlassmorphismComponents = () => {
  const [activeTab, setActiveTab] = useState('cards');
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const GlassCard = ({ children, className = "", hover = true }) => (
    <div className={`
      backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      ${hover ? 'hover:bg-white/20 hover:border-white/30 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.5)] hover:scale-105' : ''}
      transition-all duration-300 ease-out
      ${className}
    `}>
      {children}
    </div>
  );

  const GlassButton = ({ children, variant = 'primary', onClick, className = "" }) => {
    const variants = {
      primary: 'bg-gradient-to-r from-blue-500/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-600/40',
      secondary: 'bg-white/10 hover:bg-white/20',
      success: 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 hover:from-green-500/40 hover:to-emerald-600/40',
      danger: 'bg-gradient-to-r from-red-500/30 to-pink-600/30 hover:from-red-500/40 hover:to-pink-600/40'
    };

    return (
      <button
        onClick={onClick}
        className={`
          backdrop-blur-xl border border-white/20 rounded-xl px-6 py-3
          shadow-[0_4px_16px_0_rgba(31,38,135,0.37)]
          hover:border-white/30 hover:shadow-[0_6px_20px_0_rgba(31,38,135,0.5)]
          active:scale-95 transition-all duration-200
          text-white font-medium
          ${variants[variant]}
          ${className}
        `}
      >
        {children}
      </button>
    );
  };

  const GlassInput = ({ placeholder, icon: Icon, type = "text" }) => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
        {Icon && <Icon size={20} />}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="
          w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl
          pl-12 pr-4 py-3 text-white placeholder-white/60
          shadow-[0_4px_16px_0_rgba(31,38,135,0.37)]
          focus:bg-white/20 focus:border-white/30 focus:outline-none
          focus:shadow-[0_6px_20px_0_rgba(31,38,135,0.5)]
          transition-all duration-200
        "
      />
    </div>
  );

  const GlassNavigation = () => (
    <nav className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Glass UI
          </div>
          <div className="hidden md:flex space-x-6">
            {['Cards', 'Forms', 'Media', 'Navigation'].map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`
                  px-4 py-2 rounded-lg transition-all duration-200 font-medium
                  ${activeTab === item.toLowerCase() 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <Bell size={20} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            {notificationOpen && (
              <div className="absolute right-0 top-12 w-80 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                <h3 className="text-white font-semibold mb-3">Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-white/80 text-sm">Profile updated successfully</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all">
                    <Info size={16} className="text-blue-400" />
                    <span className="text-white/80 text-sm">New feature available</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200">
            <User size={20} className="text-white" />
          </button>
        </div>
      </div>
    </nav>
  );

  const TabContent = () => {
    switch(activeTab) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Profile Card</h3>
                <Settings size={20} className="text-white/60" />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Alex Johnson</h4>
                  <p className="text-white/60">UI/UX Designer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>alex@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <Star size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Premium Features</h3>
                <p className="text-white/60 mb-4">Unlock advanced tools and analytics</p>
                <GlassButton variant="success">Upgrade Now</GlassButton>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Views</span>
                  <span className="text-white font-medium">2,847</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Engagement</span>
                  <span className="text-white font-medium">68%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-2/3"></div>
                </div>
              </div>
            </GlassCard>
          </div>
        );

      case 'forms':
        return (
          <div className="max-w-2xl mx-auto">
            <GlassCard>
              <h3 className="text-2xl font-semibold text-white mb-6">Contact Form</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassInput placeholder="First Name" icon={User} />
                  <GlassInput placeholder="Last Name" icon={User} />
                </div>
                <GlassInput placeholder="Email Address" icon={Mail} type="email" />
                <GlassInput placeholder="Phone Number" icon={Phone} type="tel" />
                <div className="relative">
                  <textarea
                    placeholder="Your message..."
                    rows={4}
                    className="
                      w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl
                      p-4 text-white placeholder-white/60 resize-none
                      shadow-[0_4px_16px_0_rgba(31,38,135,0.37)]
                      focus:bg-white/20 focus:border-white/30 focus:outline-none
                      focus:shadow-[0_6px_20px_0_rgba(31,38,135,0.5)]
                      transition-all duration-200
                    "
                  />
                </div>
                <div className="flex space-x-4">
                  <GlassButton variant="primary" className="flex-1">
                    Send Message
                  </GlassButton>
                  <GlassButton variant="secondary">
                    Reset
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </div>
        );

      case 'media':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <div className="aspect-video bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                </button>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Glassmorphism Tutorial</h3>
              <p className="text-white/60 text-sm mb-4">Learn how to create stunning glass effects</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`p-2 rounded-lg transition-all ${liked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                  >
                    <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-all">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-all">
                    <Download size={16} />
                  </button>
                </div>
                <span className="text-white/60 text-sm">1.2K views</span>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Music Player</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">♪</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Ambient Dreams</h4>
                  <p className="text-white/60 text-sm">Chillwave Collection</p>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full w-1/3"></div>
              </div>
              <div className="flex items-center justify-between text-white/60 text-sm mb-4">
                <span>1:23</span>
                <span>3:45</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                  <SkipForward size={20} className="text-white transform rotate-180" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-600/30 hover:from-blue-500/40 hover:to-purple-600/40 transition-all"
                >
                  {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                  <SkipForward size={20} className="text-white" />
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                  <Volume2 size={20} className="text-white" />
                </button>
              </div>
            </GlassCard>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Sidebar Menu</h3>
              <nav className="space-y-2">
                {[
                  { name: 'Dashboard', icon: Globe, active: true },
                  { name: 'Analytics', icon: Eye },
                  { name: 'Calendar', icon: Calendar },
                  { name: 'Messages', icon: MessageCircle },
                  { name: 'Settings', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.name}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                      ${item.active 
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-600/30 text-white border border-white/20' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                ))}
              </nav>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-white mb-4">Breadcrumb Navigation</h3>
              <nav className="flex items-center space-x-2 text-sm">
                <button className="text-white/60 hover:text-white transition-colors">Home</button>
                <ChevronRight size={16} className="text-white/40" />
                <button className="text-white/60 hover:text-white transition-colors">Components</button>
                <ChevronRight size={16} className="text-white/40" />
                <span className="text-white font-medium">Glassmorphism</span>
              </nav>
            </GlassCard>

            <div className="text-center">
              <GlassButton 
                variant="primary" 
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2"
              >
                <Eye size={20} />
                <span>Open Modal</span>
              </GlassButton>
            </div>

            {modalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <GlassCard className="max-w-md w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Glass Modal</h3>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                  <p className="text-white/70 mb-6">
                    This is a beautiful glassmorphism modal with backdrop blur and transparency effects.
                  </p>
                  <div className="flex space-x-3">
                    <GlassButton variant="primary" className="flex-1">
                      Continue
                    </GlassButton>
                    <GlassButton 
                      variant="secondary" 
                      onClick={() => setModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </GlassButton>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      <div className="max-w-7xl mx-auto">
        <GlassNavigation />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Glassmorphism UI Components
          </h1>
          <p className="text-white/70 text-lg">
            A collection of beautiful, reusable glass-style components with modern aesthetics
          </p>
        </div>

        <TabContent />

        <div className="mt-12 text-center">
          <GlassCard className="inline-block">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-white/60 text-sm">
                Built with React + Tailwind CSS + Glassmorphism
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
