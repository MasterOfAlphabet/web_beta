import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Star, Trophy, Clock, Target, Volume2, AlertCircle, SkipForward } from 'lucide-react';

const ReadingRockStar = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [category, setCategory] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [skippedWords, setSkippedWords] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // success, error, info
  const [speechSupported, setSpeechSupported] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    wordsCorrect: 0,
    sentencesCorrect: 0,
    paragraphsCorrect: 0,
    wordsSkipped: 0,
    sentencesSkipped: 0,
    paragraphsSkipped: 0,
    totalTime: 0
  });
  const [results, setResults] = useState([]);
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Sample content for different categories and levels
  const prompts = {
    Words: [
      "apple", "music", "planet", "school", "friend", "magic", "guitar", "animal", "rocket", "banana",
      "happy", "garden", "window", "yellow", "purple", "orange", "table", "water", "elephant", "butterfly"
    ],
    Sentences: [
      "The cat is sleeping.",
      "She likes to read books.",
      "We play soccer after school.",
      "Reading is fun and exciting!",
      "The sun is bright in the sky.",
      "The beautiful butterfly flew over the colorful garden.",
      "My friend and I went to school together this morning.",
      "The big elephant was drinking water near the river."
    ],
    Paragraphs: [
      `Reading helps us learn new things every day. When you read a book, you can travel to different places and meet interesting characters. Reading makes your mind strong and your imagination bigger.`,
      `Music is a wonderful part of our lives. It can make us feel happy, calm, or excited. Learning to play an instrument is fun and helps you express yourself.`,
      `Once upon a time there was a little cat. The cat loved to play in the garden. Every day the cat would chase butterflies and climb trees. The cat was very happy.`
    ]
  };

  const categories = [
    { id: "Words", label: "Words", icon: "🔤" },
    { id: "Sentences", label: "Sentences", icon: "✍️" },
    { id: "Paragraphs", label: "Paragraphs", icon: "📄" },
  ];

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Utility to normalize for comparison
  function normalize(str) {
    return str.trim().toLowerCase().replace(/[^\w\s]/g, "");
  }

  // Initialize speech recognition check
  useEffect(() => {
    if (SpeechRecognition) {
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
      setFeedback('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setFeedbackType('error');
    }
  }, []);

  // Timer for tracking game time
  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      timerRef.current = setInterval(() => {
        setGameTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [gameState, startTime]);

  const startGame = (selectedCategory) => {
    if (!speechSupported) {
      setFeedback('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      setFeedbackType('error');
      return;
    }
    
    setCategory(selectedCategory);
    setGameState('playing');
    setStep(0);
    setResults([]);
    setScore(0);
    setTotalAttempts(0);
    setCorrectWords(0);
    setSkippedWords(0);
    setSpokenText('');
    setCorrect(null);
    setShowFeedback(false);
    setStartTime(Date.now());
    setGameTime(0);
    setFeedback('');
    setFeedbackType('');
    setCurrentText(prompts[selectedCategory][0]);
    setCurrentWordIndex(0);
    
    // Reset session stats for this category
    setSessionStats({
      wordsCorrect: 0,
      sentencesCorrect: 0,
      paragraphsCorrect: 0,
      wordsSkipped: 0,
      sentencesSkipped: 0,
      paragraphsSkipped: 0,
      totalTime: 0
    });

    // Auto-start listening for the first word
    setTimeout(() => {
      startListening();
    }, 1000);
  };

  // Speech recognition
  const startListening = () => {
    if (!SpeechRecognition) {
      setFeedback("Sorry, your browser does not support speech recognition.");
      setFeedbackType('error');
      return;
    }
    
    setSpokenText("");
    setCorrect(null);
    setShowFeedback(false);
    setFeedback('');
    setFeedbackType('');

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;

    setIsListening(true);

    recognitionRef.current.onresult = e => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(" ");
      setSpokenText(transcript);
      setTotalAttempts(prev => prev + 1);

      let isCorrect = false;
      const prompt = currentText;

      if (category === "Words") {
        isCorrect = normalize(transcript) === normalize(prompt);
      } else {
        // sentences or paragraphs: check word-by-word
        const expected = prompt.split(/\s+/);
        const spokenWords = normalize(transcript).split(/\s+/);
        let match = true;
        for (let i = 0; i < expected.length; i++) {
          if (spokenWords[i] !== normalize(expected[i])) {
            match = false;
            break;
          }
        }
        isCorrect = match && (spokenWords.length === expected.length);
      }
      
      setCorrect(isCorrect);
      setShowFeedback(true);
      
      if (isCorrect) {
        setScore(prev => prev + (category === "Words" ? 10 : category === "Sentences" ? 15 : 25));
        setCorrectWords(prev => prev + 1);
        setFeedback('🌟 Perfect! You rock! 🎸');
        setFeedbackType('success');
        
        // Update session stats
        if (category === "Words") {
          setSessionStats(prev => ({ ...prev, wordsCorrect: prev.wordsCorrect + 1 }));
        } else if (category === "Sentences") {
          setSessionStats(prev => ({ ...prev, sentencesCorrect: prev.sentencesCorrect + 1 }));
        } else {
          setSessionStats(prev => ({ ...prev, paragraphsCorrect: prev.paragraphsCorrect + 1 }));
        }
      } else {
        setFeedback(`❌ Not quite. Try to say: "${prompt}"`);
        setFeedbackType('error');
      }
      
      setResults(r => [
        ...r,
        {
          prompt: prompt,
          spoken: transcript,
          correct: isCorrect,
          skipped: false
        },
      ]);
      
      setIsListening(false);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      let errorMessage = 'Please try speaking again!';
      switch(event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please speak clearly!';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not found. Please check your microphone!';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access!';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection!';
          break;
      }
      setFeedback(errorMessage);
      setFeedbackType('error');
      setShowFeedback(true);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const skipWord = () => {
    setSkippedWords(prev => prev + 1);
    
    // Update session stats for skipped items
    if (category === "Words") {
      setSessionStats(prev => ({ ...prev, wordsSkipped: prev.wordsSkipped + 1 }));
    } else if (category === "Sentences") {
      setSessionStats(prev => ({ ...prev, sentencesSkipped: prev.sentencesSkipped + 1 }));
    } else {
      setSessionStats(prev => ({ ...prev, paragraphsSkipped: prev.paragraphsSkipped + 1 }));
    }
    
    setResults(r => [
      ...r,
      {
        prompt: currentText,
        spoken: '',
        correct: false,
        skipped: true
      },
    ]);
    
    nextText();
  };

  const nextText = () => {
    setSpokenText("");
    setCorrect(null);
    setShowFeedback(false);
    setStep(s => s + 1);
    
    if (step + 1 < prompts[category].length) {
      setCurrentText(prompts[category][step + 1]);
      setFeedback('');
      setFeedbackType('');
      // Auto-start listening for next word
      setTimeout(() => {
        startListening();
      }, 500);
    } else {
      // Game completed
      endGame();
    }
  };

  const endGame = () => {
    setGameState('results');
    setSessionStats(prev => ({ ...prev, totalTime: gameTime }));
  };

  const resetGame = () => {
    setGameState('menu');
    setCategory('');
    setCurrentText('');
    setStep(0);
    setResults([]);
    setSpokenText('');
    setCorrect(null);
    setShowFeedback(false);
    setScore(0);
    setTotalAttempts(0);
    setCorrectWords(0);
    setSkippedWords(0);
    setGameTime(0);
    setFeedback('');
    setFeedbackType('');
    
    // Reset session stats
    setSessionStats({
      wordsCorrect: 0,
      sentencesCorrect: 0,
      paragraphsCorrect: 0,
      wordsSkipped: 0,
      sentencesSkipped: 0,
      paragraphsSkipped: 0,
      totalTime: 0
    });
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getFeedbackColor = () => {
    switch(feedbackType) {
      case 'success': return 'bg-green-100 border-green-300 text-green-800';
      case 'error': return 'bg-red-100 border-red-300 text-red-800';
      case 'info': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  function ProgressBar({ current, total }) {
    const percent = ((current) / total) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-pink-400 h-4 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    );
  }

  if (!speechSupported && gameState !== 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-purple-400 p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Browser Not Supported</h2>
          <p className="text-gray-600 mb-6">
            Speech recognition is not supported in your browser. Please use:
          </p>
          <ul className="text-left text-gray-600 mb-6">
            <li>• Google Chrome</li>
            <li>• Microsoft Edge</li>
            <li>• Safari (on macOS/iOS)</li>
          </ul>
          <button
            onClick={() => setGameState('menu')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              📚 Reading Rock Star 🌟
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Practice reading and become a reading champion!
            </p>
          </div>

          {!speechSupported && (
            <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-6 text-center">
              <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-800">
                Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => startGame(cat.id)}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl ${
                  speechSupported ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div className="text-6xl mb-4">{cat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{cat.label}</h3>
                <p className="text-gray-600">
                  {cat.id === 'Words' ? 'Read individual words' :
                   cat.id === 'Sentences' ? 'Read complete sentences' :
                   'Read full paragraphs'}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
              <p className="text-white text-lg">
                🎤 Make sure your microphone is enabled and you're in a quiet environment!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const accuracy = totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Amazing Work!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600">{score}</div>
                <div className="text-blue-800">Total Score</div>
              </div>
              <div className="bg-green-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-green-800">Accuracy</div>
              </div>
              <div className="bg-purple-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">{correctWords}</div>
                <div className="text-purple-800">Correct Readings</div>
              </div>
              <div className="bg-orange-100 rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-600">{gameTime}s</div>
                <div className="text-orange-800">Time Taken</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Session Summary</h3>
              <div className="text-lg space-y-2">
                <div>🔤 Words - Completed: {sessionStats.wordsCorrect}, Skipped: {sessionStats.wordsSkipped}</div>
                <div>📝 Sentences - Completed: {sessionStats.sentencesCorrect}, Skipped: {sessionStats.sentencesSkipped}</div>
                <div>📄 Paragraphs - Completed: {sessionStats.paragraphsCorrect}, Skipped: {sessionStats.paragraphsSkipped}</div>
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <div className="text-lg font-bold text-yellow-800">Total Skipped: {skippedWords}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3">Recent Results:</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {results.slice(-5).map((result, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    result.skipped ? 'bg-yellow-100' : result.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <div className="font-medium">{result.prompt}</div>
                    <div className="text-gray-600">
                      {result.skipped ? 'Skipped' : `You said: "${result.spoken}"`}
                    </div>
                    <div className={`${
                      result.skipped ? 'text-yellow-600' : result.correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.skipped ? '⏭️ Skipped' : result.correct ? '✅ Correct!' : '❌ Try again'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Play Again! 🎮
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                className="text-blue-500 underline hover:text-blue-700" 
                onClick={() => setGameState('menu')}
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
              <div className="flex items-center space-x-2 text-blue-600">
                <Star className="w-5 h-5" />
                <span className="font-bold">{score}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Clock className="w-5 h-5" />
                <span className="font-bold">{gameTime}s</span>
              </div>
              <button
                onClick={endGame}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                End Game
              </button>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <ProgressBar current={step} total={prompts[category].length} />
            
            <div className="flex justify-center items-center mb-6">
              <button
                onClick={() => speakText(currentText)}
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors mr-4"
                title="Listen to the text"
              >
                <Volume2 className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {category === 'Words' ? 'Read this word:' : 
                   category === 'Sentences' ? 'Read this sentence:' : 
                   'Read this paragraph:'}
                </h3>
                {!showFeedback && (
                  <p className="text-lg text-blue-600 font-medium">
                    Ready for the next one? Click the microphone!
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-6">
              <div className={`font-bold text-gray-800 ${
                category === 'Words' ? 'text-6xl tracking-wider' : 
                category === 'Sentences' ? 'text-3xl' : 
                'text-xl leading-8'
              } ${category === 'Paragraphs' ? 'max-h-36 overflow-y-auto' : ''}`}>
                {currentText}
              </div>
            </div>

            {/* Feedback and spoken text - above microphone */}
            {showFeedback && (
              <div className="mb-6">
                {spokenText && (
                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">You said:</p>
                    <p className="font-bold text-gray-800">"{spokenText}"</p>
                  </div>
                )}
                
                {feedback && (
                  <div className={`border rounded-xl p-4 inline-block max-w-lg mb-4 ${getFeedbackColor()}`}>
                    <p className="text-lg font-medium">{feedback}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Microphone Control */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!speechSupported}
                className={`${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white p-6 rounded-full text-2xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-2">
                  {isListening ? '🎤 Listening... Speak clearly!' : 'Click to start speaking'}
                </p>
                
                <button
                  onClick={skipWord}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center mx-auto"
                  title={`Skip this ${category.slice(0, -1).toLowerCase()}`}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip {category === 'Words' ? 'Word' : category === 'Sentences' ? 'Sentence' : 'Paragraph'}
                </button>
              </div>
            </div>
          </div>

          {/* Next button when correct */}
          {correct !== null && showFeedback && (
            <div className="text-center mb-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-colors text-lg"
                onClick={nextText}
              >
                Next ➡️
              </button>
            </div>
          )}

          {/* Progress Stats */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-blue-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">{correctWords}</div>
              <div className="text-blue-800">Correct</div>
            </div>
            <div className="bg-green-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {totalAttempts > 0 ? Math.round((correctWords / totalAttempts) * 100) : 0}%
              </div>
              <div className="text-green-800">Accuracy</div>
            </div>
            <div className="bg-purple-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">{totalAttempts}</div>
              <div className="text-purple-800">Attempts</div>
            </div>
            <div className="bg-orange-100 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600">{skippedWords}</div>
              <div className="text-orange-800">Skipped</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingRockStar;