import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Target, 
  BookOpen, 
  Volume2, 
  AlertCircle,
  Trophy,
  Zap,
  Star
} from 'lucide-react';

// Word collections for different class levels
const WORD_COLLECTIONS = {
  "III-V": {
    theme: "Elementary",
    emoji: "🌟",
    words: [
      "cat", "dog", "sun", "run", "fun", "big", "red", "yes", "can", "see",
      "the", "and", "you", "are", "for", "not", "with", "his", "they", "have",
      "this", "will", "your", "from", "they", "know", "want", "been", "good", "much"
    ]
  },
  "VI-VIII": {
    theme: "Intermediate",
    emoji: "🚀",
    words: [
      "adventure", "beautiful", "challenge", "different", "education", "fantastic", "government", "important",
      "knowledge", "language", "mountain", "necessary", "opportunity", "powerful", "question", "remember",
      "scientist", "technology", "understand", "wonderful", "yesterday", "together", "through", "thought",
      "something", "children", "between", "another", "because", "without"
    ]
  },
  "IX-XII": {
    theme: "Advanced",
    emoji: "🎓",
    words: [
      "extraordinary", "responsibility", "contemporary", "philosophical", "architectural", "psychological",
      "environmental", "international", "revolutionary", "technological", "independence", "achievement",
      "communication", "demonstration", "establishment", "investigation", "organization", "transformation",
      "understanding", "characteristic", "administration", "recommendation", "interpretation", "representation",
      "identification", "concentration", "determination", "appreciation", "configuration", "pronunciation"
    ]
  }
};

// Custom hook for speech recognition with continuous listening
const useSpeechRecognition = (isEnabled, onResult, onError) => {
  const [speechState, setSpeechState] = useState({
    isSupported: true,
    isRecording: false,
    isListening: false,
    error: null
  });

  const recognitionRef = useRef(null);
  const isMountedRef = useRef(true);
  const restartTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechState((prev) => ({
        ...prev,
        isSupported: false,
        error: "Speech recognition not supported",
      }));
      return;
    }

    // Check microphone permissions first
    const checkMicPermissions = async () => {
      try {
        // Request microphone access first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permission granted');
      } catch (error) {
        console.error('Microphone permission error:', error);
        setSpeechState((prev) => ({
          ...prev,
          isSupported: false,
          error: `Microphone access denied: ${error.message}. Please allow microphone access and refresh the page.`,
        }));
        return;
      }
    };

    checkMicPermissions();

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        if (!isMountedRef.current) return;
        
        if (event.results.length > 0) {
          const lastResult = event.results[event.results.length - 1];
          
          if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript.toLowerCase().trim();
            
            if (transcript && onResult) {
              onResult(transcript);
            }
          }
        }
      };

      recognition.onerror = (event) => {
        if (!isMountedRef.current) return;
        console.error('Speech recognition error:', event.error);

        // Handle specific error types
        if (event.error === 'not-allowed') {
          setSpeechState((prev) => ({
            ...prev,
            error: "Microphone access denied. Please allow microphone access in your browser settings and refresh the page.",
            isListening: false,
            isRecording: false,
            isSupported: false
          }));
          if (onError) onError("Microphone access denied");
          return;
        }

        // Don't stop for minor errors in continuous mode
        if (['no-speech', 'audio-capture'].includes(event.error)) {
          console.log('Minor error, continuing...');
          return;
        }

        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }

        const errorMessage = `Speech recognition error: ${event.error}`;
        setSpeechState((prev) => ({
          ...prev,
          error: errorMessage,
          isListening: false,
          isRecording: false,
        }));

        if (onError) onError(errorMessage);

        // Quick restart for recoverable errors
        if (isEnabled && ['aborted', 'network'].includes(event.error)) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current && isEnabled) {
              startRecognition();
            }
          }, 500);
        }
      };

      recognition.onend = () => {
        if (!isMountedRef.current) return;
        
        setSpeechState((prev) => ({
          ...prev,
          isListening: false,
          isRecording: false,
        }));

        // Immediately restart if still enabled
        if (isEnabled) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current && isEnabled) {
              startRecognition();
            }
          }, 100);
        }
      };

      recognition.onstart = () => {
        if (!isMountedRef.current) return;
        setSpeechState(prev => ({
          ...prev,
          isRecording: true,
          isListening: true,
          error: null
        }));
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn("Error stopping recognition:", e);
        }
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [onResult, onError]);

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current || speechState.isRecording || !speechState.isSupported) return;
    
    try {
      // Double-check microphone permissions before starting
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          if (recognitionRef.current && isMountedRef.current) {
            recognitionRef.current.stop();
            setTimeout(() => {
              if (recognitionRef.current && isMountedRef.current) {
                recognitionRef.current.start();
              }
            }, 100);
          }
        })
        .catch((error) => {
          console.error('Microphone access error during start:', error);
          setSpeechState(prev => ({
            ...prev,
            error: `Microphone access denied: ${error.message}. Please allow microphone access and try again.`,
            isRecording: false,
            isListening: false,
            isSupported: false
          }));
        });
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setSpeechState(prev => ({
        ...prev,
        error: error.message,
        isRecording: false,
        isListening: false
      }));
    }
  }, [speechState.isRecording, speechState.isSupported]);

  const stopRecognition = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setSpeechState((prev) => ({
          ...prev,
          isRecording: false,
          isListening: false,
        }));
      } catch (e) {
        console.warn("Error stopping recognition:", e);
      }
    }
  }, []);

  const toggleRecognition = useCallback(() => {
    if (speechState.isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [speechState.isRecording, startRecognition, stopRecognition]);

  return {
    ...speechState,
    startRecognition,
    stopRecognition,
    toggleRecognition,
  };
};

// Custom hook for game timer
const useGameTimer = (isActive, onTick) => {
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (onTick) onTick(elapsed);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, onTick]);

  const resetTimer = useCallback(() => {
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return { resetTimer };
};

// Helper functions
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getWordStatus = (wordIndex, currentWordIndex, recognizedWords) => {
  if (recognizedWords.some(w => w.position === wordIndex)) {
    return 'recognized';
  } else if (wordIndex === currentWordIndex) {
    return 'current';
  } else if (wordIndex < currentWordIndex) {
    return 'skipped';
  } else {
    return 'pending';
  }
};

// Word Display Component
const WordDisplay = ({ word, index, status, isLastRecognized }) => {
  const getWordClasses = () => {
    const baseClasses = "p-3 rounded-xl font-bold text-sm transition-all duration-300 border-2 flex items-center justify-center min-h-[60px] relative";
    
    switch (status) {
      case 'current':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-300 ring-2 ring-blue-300 shadow-lg transform scale-105`;
      case 'recognized':
        return `${baseClasses} bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400 shadow-lg`;
      case 'skipped':
        return `${baseClasses} bg-gradient-to-br from-gray-400 to-gray-500 text-gray-100 border-gray-500`;
      default:
        return `${baseClasses} bg-white/10 text-gray-300 border-white/20 hover:bg-white/20`;
    }
  };

  return (
    <div className={`${getWordClasses()} ${isLastRecognized ? 'animate-bounce' : ''}`}>
      <div className="text-center relative">
        {word}
        {status === 'current' && (
          <div className="absolute -top-1 -right-1">
            <Mic className="text-white animate-pulse" size={12} />
          </div>
        )}
        {status === 'recognized' && (
          <div className="absolute -top-1 -right-1">
            <CheckCircle className="text-white" size={12} />
          </div>
        )}
      </div>
    </div>
  );
};

// Game Controls Component
const GameControls = ({ gameState, speechState, onPause, onReset, onToggleRecording, stats }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onPause}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
            aria-label={gameState.isPaused ? "Resume challenge" : "Pause challenge"}
          >
            {gameState.isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
            aria-label="Reset challenge"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={onToggleRecording}
            className={`p-3 rounded-xl transition-all shadow-lg ${
              speechState.isRecording
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
            }`}
            aria-label={speechState.isRecording ? "Stop recording" : "Start recording"}
          >
            {speechState.isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {speechState.error && (
            <div className="flex items-center gap-2 text-red-400 text-sm max-w-md">
              <AlertCircle size={16} />
              <span className="break-words">{speechState.error}</span>
            </div>
          )}
          {!speechState.isSupported && (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle size={16} />
              <span>Speech recognition not available</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-white flex-wrap">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-400" />
            <span className="font-bold">{stats.progress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-green-400" />
            <span className="font-bold">{stats.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-purple-400" />
            <span className="font-bold">{stats.recognized}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={18} className="text-orange-400" />
            <span className="font-bold">{stats.accuracy}%</span>
          </div>
          {speechState.isRecording && (
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-red-400 animate-pulse" />
              <span className="font-bold text-sm">Listening...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Permission Setup Component
const PermissionSetup = ({ onPermissionGranted, error }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Permission granted successfully');
      onPermissionGranted();
    } catch (error) {
      console.error('Permission request failed:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
      <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
      <h2 className="text-2xl font-bold text-white mb-4">Microphone Access Required</h2>
      <p className="text-gray-300 mb-6 max-w-md mx-auto">
        This game needs microphone access to recognize your speech. Please allow microphone access when prompted.
      </p>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={requestPermission}
        disabled={isRequesting}
        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRequesting ? 'Requesting...' : 'Allow Microphone Access'}
      </button>

      <div className="mt-6 text-sm text-gray-400">
        <p className="mb-2">If you're still having issues:</p>
        <ul className="text-left max-w-md mx-auto space-y-1">
          <li>• Check your browser's microphone settings</li>
          <li>• Make sure no other app is using your microphone</li>
          <li>• Try refreshing the page</li>
          <li>• Ensure you're using HTTPS (not HTTP)</li>
        </ul>
      </div>
    </div>
  );
};
const ClassSelector = ({ classGroup, onClassChange }) => (
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 mb-6">
    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
      <Target className="text-pink-400" size={24} />
      Select Class Level
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {Object.entries(WORD_COLLECTIONS).map(([key, data]) => (
        <button
          key={key}
          onClick={() => onClassChange(key)}
          className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
            classGroup === key
              ? "border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/25"
              : "border-white/20 bg-white/5 hover:border-pink-300 hover:bg-white/10"
          }`}
          aria-pressed={classGroup === key}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label={`${data.theme} emoji`}>
              {data.emoji}
            </span>
            <div className="text-left">
              <div className="text-lg font-bold text-white">Class {key}</div>
              <div className="text-sm text-gray-300">{data.theme}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Game Summary Component
const GameSummary = ({ stats, gameState, onReset, recognizedWords, totalWords }) => {
  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-400', icon: Trophy };
    if (accuracy >= 75) return { level: 'Great', color: 'text-blue-400', icon: Star };
    if (accuracy >= 60) return { level: 'Good', color: 'text-yellow-400', icon: Zap };
    return { level: 'Keep Trying', color: 'text-orange-400', icon: Target };
  };

  const performance = getPerformanceLevel(stats.accuracy);
  const PerformanceIcon = performance.icon;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
      <div className="mb-6">
        <PerformanceIcon className={`${performance.color} mx-auto mb-3`} size={48} />
        <h2 className="text-3xl font-bold text-white mb-2">Challenge Complete!</h2>
        <p className={`text-xl font-semibold ${performance.color}`}>{performance.level}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.recognized}</div>
          <div className="text-sm text-gray-300">Words Recognized</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="text-2xl font-bold text-green-400">{stats.time}</div>
          <div className="text-sm text-gray-300">Total Time</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.accuracy}%</div>
          <div className="text-sm text-gray-300">Accuracy</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="text-2xl font-bold text-orange-400">{Math.round(stats.recognized / (gameState.timeElapsed / 60))}</div>
          <div className="text-sm text-gray-300">Words/Min</div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
      >
        Play Again
      </button>
    </div>
  );
};

// Main Game Component
const WordRecognitionGame = () => {
  const [gameState, setGameState] = useState({
    phase: 'setup', // setup, playing, completed, permission
    classGroup: 'III-V',
    currentWordIndex: 0,
    timeElapsed: 0,
    isPaused: false,
    isCompleted: false,
  });

  const [recognizedWords, setRecognizedWords] = useState([]);
  const [lastRecognized, setLastRecognized] = useState([]);
  const [permissionError, setPermissionError] = useState(null);

  const currentCollection = WORD_COLLECTIONS[gameState.classGroup];
  const currentWords = currentCollection.words.slice(0, 25); // Show 25 words for grid

  const handleSpeechResult = useCallback((transcript) => {
    if (gameState.phase !== 'playing' || gameState.isPaused) return;

    const spokenWords = transcript.toLowerCase().trim().split(/\s+/);
    const currentWord = currentWords[gameState.currentWordIndex]?.toLowerCase();

    if (!currentWord) return;

    const hasMatch = spokenWords.some(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      return cleanWord === currentWord || 
             (cleanWord.length > 2 && currentWord.includes(cleanWord)) ||
             (currentWord.length > 2 && cleanWord.includes(currentWord));
    });

    if (hasMatch) {
      setLastRecognized({
        word: currentWord,
        position: gameState.currentWordIndex,
        timestamp: Date.now(),
      });

      setRecognizedWords((prev) => {
        const newWords = [...prev];
        if (!newWords.some((w) => w.position === gameState.currentWordIndex)) {
          newWords.push({
            word: currentWord,
            position: gameState.currentWordIndex,
            isCorrect: true,
            timestamp: Date.now(),
          });
        }
        return newWords;
      });

      setTimeout(() => {
        setGameState((prev) => {
          if (prev.currentWordIndex < currentWords.length - 1) {
            return {
              ...prev,
              currentWordIndex: prev.currentWordIndex + 1,
            };
          } else {
            return {
              ...prev,
              phase: 'completed',
              isCompleted: true,
            };
          }
        });
      }, 300);
    }
  }, [gameState, currentWords]);

  const handleSpeechError = useCallback((error) => {
    console.error("Speech recognition error:", error);
    if (error.includes('denied') || error.includes('not-allowed')) {
      setGameState(prev => ({ ...prev, phase: 'permission' }));
      setPermissionError(error);
    }
  }, []);

  const speech = useSpeechRecognition(
    gameState.phase === 'playing' && !gameState.isPaused,
    handleSpeechResult,
    handleSpeechError
  );

  const timer = useGameTimer(
    gameState.phase === 'playing' && !gameState.isPaused && !gameState.isCompleted,
    useCallback((elapsed) => {
      setGameState((prev) => ({ ...prev, timeElapsed: elapsed }));
    }, [])
  );

  const stats = useMemo(() => {
    const recognizedCount = recognizedWords.length;
    const totalWords = currentWords.length;
    const currentIndex = Math.min(gameState.currentWordIndex + 1, totalWords);
    
    return {
      progress: `${currentIndex}/${totalWords}`,
      recognized: recognizedCount,
      time: formatTime(gameState.timeElapsed),
      accuracy: currentIndex > 0 ? Math.round((recognizedCount / currentIndex) * 100) : 0
    };
  }, [recognizedWords.length, currentWords.length, gameState.currentWordIndex, gameState.timeElapsed]);

  const handleStartGame = () => {
    // Check if speech recognition is available before starting
    if (!speech.isSupported) {
      setGameState(prev => ({ ...prev, phase: 'permission' }));
      setPermissionError('Speech recognition is not supported or microphone access is denied.');
      return;
    }
    setGameState(prev => ({ ...prev, phase: 'playing' }));
  };

  const handlePermissionGranted = () => {
    setGameState(prev => ({ ...prev, phase: 'setup' }));
    setPermissionError(null);
  };

  const handlePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const handleReset = () => {
    setGameState({
      phase: 'setup',
      classGroup: gameState.classGroup,
      currentWordIndex: 0,
      timeElapsed: 0,
      isPaused: false,
      isCompleted: false,
    });
    setRecognizedWords([]);
    setLastRecognized(null);
    setPermissionError(null);
    speech.stopRecognition();
    timer.resetTimer();
  };

  const handleClassChange = (newClass) => {
    setGameState(prev => ({ ...prev, classGroup: newClass }));
  };

  // Clear animation after it plays
  useEffect(() => {
    if (lastRecognized) {
      const timer = setTimeout(() => {
        setLastRecognized(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastRecognized]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Word Recognition Challenge
          </h1>
          <p className="text-xl text-gray-300">Speak the words as they appear highlighted!</p>
        </header>

        {gameState.phase === 'permission' && (
          <PermissionSetup 
            onPermissionGranted={handlePermissionGranted}
            error={permissionError}
          />
        )}

        {gameState.phase === 'setup' && (
          <div className="space-y-6">
            <ClassSelector 
              classGroup={gameState.classGroup} 
              onClassChange={handleClassChange} 
            />
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                Start Challenge
              </button>
            </div>
          </div>
        )}

        {gameState.phase === 'playing' && (
          <>
            <GameControls
              gameState={gameState}
              speechState={speech}
              onPause={handlePause}
              onReset={handleReset}
              onToggleRecording={speech.toggleRecognition}
              stats={stats}
            />

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {currentCollection.emoji} {currentCollection.theme} Words
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {currentWords.map((word, index) => (
                  <WordDisplay
                    key={index}
                    word={word}
                    index={index}
                    status={getWordStatus(index, gameState.currentWordIndex, recognizedWords)}
                    isLastRecognized={lastRecognized?.position === index}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {gameState.phase === 'completed' && (
          <GameSummary
            stats={stats}
            gameState={gameState}
            onReset={handleReset}
            recognizedWords={recognizedWords}
            totalWords={currentWords.length}
          />
        )}
      </div>
    </div>
  );
};

export default WordRecognitionGame;