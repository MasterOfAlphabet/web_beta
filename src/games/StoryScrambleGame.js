import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen, Puzzle, CheckCircle, XCircle, RotateCcw, Volume2, Lightbulb,
  Award, Clock, Star, Trophy, Info, ChevronRight, Lock
} from "lucide-react";

// Story Mode Sentences (build a narrative)
const storySentences = [
  {
    id: 'story1',
    parts: ["The", "cat", "is", "sleeping", "."],
    hint: "What is the cat doing?",
    storySegment: "Once upon a time, a fluffy cat found a cozy spot under the warm sun.",
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'story2',
    parts: ["Birds", "fly", "in", "the", "sky", "."],
    hint: "Where do birds fly?",
    storySegment: "Above, colorful birds soared gracefully, singing sweet songs.",
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'story3',
    parts: ["We", "love", "to", "read", "books", "."],
    hint: "What do we enjoy doing with books?",
    storySegment: "Inside a small house, children curled up with their favorite books.",
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'story4',
    parts: ["The", "sun", "is", "bright", "today", "."],
    hint: "How is the sun today?",
    storySegment: "The bright sun warmed everything, making it a perfect day.",
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'story5',
    parts: ["I", "eat", "an", "apple", "every", "day", "."],
    hint: "What do I eat every day?",
    storySegment: "For a healthy snack, a crisp apple was always a good choice.",
    difficulty: 'medium',
    points: 15
  }
];

// Timed Mode Sentences (more challenging)
const timedSentences = [
  {
    id: 'timed1',
    parts: ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog", "."],
    hint: "Complete this classic pangram",
    storySegment: "In the meadow, animals played their daily games.",
    difficulty: 'medium',
    points: 15,
    timeBonus: 2
  },
  {
    id: 'timed2',
    parts: ["Learning", "new", "things", "makes", "our", "brains", "stronger", "."],
    hint: "What makes our brains stronger?",
    storySegment: "Education opens doors to countless possibilities.",
    difficulty: 'medium',
    points: 15,
    timeBonus: 3
  },
  {
    id: 'timed3',
    parts: ["She", "sells", "seashells", "by", "the", "seashore", "."],
    hint: "Complete this tongue twister",
    storySegment: "The beach was full of treasures waiting to be found.",
    difficulty: 'hard',
    points: 20,
    timeBonus: 5
  },
  {
    id: 'timed4',
    parts: ["Mathematics", "is", "the", "language", "of", "the", "universe", "."],
    hint: "What is considered the universe's language?",
    storySegment: "Numbers and equations reveal nature's secrets.",
    difficulty: 'hard',
    points: 20,
    timeBonus: 4
  },
  {
    id: 'timed5',
    parts: ["Practice", "makes", "perfect", "so", "keep", "trying", "."],
    hint: "What leads to perfection?",
    storySegment: "Perseverance is the key to mastering any skill.",
    difficulty: 'medium',
    points: 15,
    timeBonus: 3
  },
  {
    id: 'timed6',
    parts: ["Reading", "expands", "your", "knowledge", "and", "imagination", "."],
    hint: "What does reading do for you?",
    storySegment: "Books are portals to countless worlds and ideas.",
    difficulty: 'hard',
    points: 20,
    timeBonus: 5
  }
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Utility: tokenize a story for highlighting
function tokenize(text) {
  return text.match(/[\w'-]+|[^\w\s]|[\s]+/g) || [];
}

const StoryScrambleGame = () => {
  const [gameMode, setGameMode] = useState(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [assembledSentence, setAssembledSentence] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [storyProgress, setStoryProgress] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);

  // For story reading with highlight
  const [highlightedWord, setHighlightedWord] = useState(null);
  const utteranceRef = useRef(null);

  const timeLeftRef = useRef(null);
  const currentSentences = gameMode === 'story' ? storySentences : timedSentences;
  const currentSentence = currentSentences[currentSentenceIndex];

  // ---------- EFFECTS ----------

  // Initialize game when mode is selected
  useEffect(() => {
    if (gameMode) {
      resetGameState();
      if (gameMode === 'timed') {
        setTimeLeft(60);
        startTimedMode();
      }
    }
    return () => {
      clearInterval(timeLeftRef.current);
    };
    // eslint-disable-next-line
  }, [gameMode, currentSentenceIndex]);

  // Cleanup for speech synthesis
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setHighlightedWord(null);
    };
  }, []);

  // ---------- HANDLERS ----------

  const resetGameState = () => {
    const wordsWithOriginalIndex = currentSentence.parts.map((word, idx) => ({
      word,
      originalIndex: idx,
      id: `${currentSentence.id}-${idx}`
    }));
    setShuffledWords(shuffleArray([...wordsWithOriginalIndex]));
    setAssembledSentence([]);
    setFeedback(null);
    setShowHint(false);
    setIsSpeaking(false);
    setHighlightedWord(null);
  };

  const startTimedMode = () => {
    clearInterval(timeLeftRef.current);
    timeLeftRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timeLeftRef.current);
          setFeedback('time-up');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleWordClick = (wordObj, isAssembled) => {
    if (!hasStarted) setHasStarted(true);
    if (feedback === 'correct' || isSpeaking) return;

    if (isAssembled) {
      setAssembledSentence(prev => prev.filter(w => w.id !== wordObj.id));
      setShuffledWords(prev => shuffleArray([...prev, wordObj]));
    } else {
      setAssembledSentence(prev => [...prev, wordObj]);
      setShuffledWords(prev => prev.filter(w => w.id !== wordObj.id));
    }
    setFeedback(null);
  };

  const checkSentence = () => {
    if (assembledSentence.length !== currentSentence.parts.length) {
      setFeedback('incorrect');
      return;
    }

    const isCorrect = assembledSentence.every((w, idx) => w.originalIndex === idx);

    if (isCorrect) {
      const pointsEarned = calculatePoints();
      setScore(prev => prev + pointsEarned);
      setFeedback('correct');

      if (!storyProgress.includes(currentSentence.storySegment)) {
        setStoryProgress(prev => [...prev, currentSentence.storySegment]);
      }

      checkAchievements(pointsEarned);

      if (gameMode === 'timed') {
        setTimeLeft(prev => prev + (currentSentence.timeBonus || 0));
      }
    } else {
      setFeedback('incorrect');
    }
  };

  const calculatePoints = () => {
    let points = currentSentence.points;
    if (showHint) points = Math.floor(points * 0.7);
    if (gameMode === 'timed') points = Math.floor(points * (1 + timeLeft / 60));
    return points;
  };

  const checkAchievements = (pointsEarned) => {
    const newAchievements = [];
    if (pointsEarned >= 20 && !achievements.includes('high-scorer')) {
      newAchievements.push('high-scorer');
    }
    if (currentSentenceIndex === currentSentences.length - 1 && !achievements.includes('game-completer')) {
      newAchievements.push('game-completer');
    }
    if (score + pointsEarned >= 50 && !achievements.includes('point-master')) {
      newAchievements.push('point-master');
    }
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < currentSentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setFeedback('game-complete');
      setHasStarted(false);
    }
  };

  const handleSelectMode = (mode) => {
    setGameMode(mode);
    setCurrentSentenceIndex(0);
    setScore(0);
    setStoryProgress([]);
    setAchievements([]);
    setFeedback(null);
    setHasStarted(false);
    setHighlightedWord(null);
    if (mode === 'timed') {
      setTimeLeft(60);
    }
  };

  const speakSentence = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Story Read with Highlight (Production ready) ---

  const readStoryWithHighlight = useCallback(() => {
    if (!storyProgress.length || isSpeaking) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setHighlightedWord(null);

    const fullStory = storyProgress.join(' ');
    const tokens = tokenize(fullStory);

    const utterance = new window.SpeechSynthesisUtterance(fullStory);
    utteranceRef.current = utterance;

    // Only works if browser supports onboundary
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        let charCount = 0;
        for (let i = 0; i < tokens.length; i++) {
          charCount += tokens[i].length;
          // Only highlight words, not spaces/punctuation
          if (charIndex < charCount && /\w/.test(tokens[i])) {
            setHighlightedWord(i);
            break;
          }
        }
      }
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setHighlightedWord(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setHighlightedWord(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [storyProgress, isSpeaking]);

  // ----------- COMPONENTS -----------

  const GameHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 flex items-center">
        <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mr-3" />
        Story Scramble
      </h1>
      {gameMode && (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAchievements(true)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
            aria-label="Show achievements"
          >
            <Award className="text-yellow-500 w-5 h-5" />
            {achievements.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {achievements.length}
              </span>
            )}
          </button>
          <div className="bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md flex items-center">
            <Star className="text-yellow-500 w-4 h-4 md:w-5 md:h-5 mr-1.5" />
            <span className="font-bold text-sm md:text-base">{score}</span>
          </div>
          {gameMode === 'timed' && (
            <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md flex items-center ${
              timeLeft < 15 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              <Clock className={`w-4 h-4 md:w-5 md:h-5 mr-1.5 ${
                timeLeft < 15 ? 'text-red-600' : 'text-green-600'
              }`} />
              <span className="font-bold text-sm md:text-base">{timeLeft}s</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const GameModes = () => (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-3 text-center text-gray-700">
        {gameMode ? (hasStarted ? "Current Mode" : "Change Mode") : "Select Game Mode"}
      </h3>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={() => handleSelectMode('story')}
          disabled={hasStarted && gameMode !== 'story'}
          className={`px-6 py-2 rounded-full font-medium transition-all flex flex-col items-center ${
            hasStarted && gameMode !== 'story' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          } ${
            gameMode === 'story'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <span>Story Mode</span>
          {hasStarted && gameMode === 'story' && (
            <span className="text-xs mt-1 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> In Progress
            </span>
          )}
        </button>
        <button
          onClick={() => handleSelectMode('timed')}
          disabled={hasStarted && gameMode !== 'timed'}
          className={`px-6 py-2 rounded-full font-medium transition-all flex flex-col items-center ${
            hasStarted && gameMode !== 'timed' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
          } ${
            gameMode === 'timed'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <span>Timed Challenge</span>
          {hasStarted && gameMode === 'timed' && (
            <span className="text-xs mt-1 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> In Progress
            </span>
          )}
        </button>
      </div>
      {hasStarted && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {gameMode === 'story'
            ? "Complete the story to switch modes"
            : "Finish the timed challenge to switch modes"}
        </p>
      )}
    </div>
  );

  const handleResetSentence = () => {
    resetGameState();
  };

  const SentenceConstructionArea = () => (
    <div className="min-h-[120px] bg-purple-50 p-4 rounded-xl border-2 border-purple-300 border-dashed flex flex-wrap gap-2 items-center justify-center mb-6 shadow-inner">
      {assembledSentence.length === 0 ? (
        <p className="text-gray-500 italic">Click words below to build the sentence...</p>
      ) : (
        assembledSentence.map((wordObj) => (
          <button
            key={`assembled-${wordObj.id}`}
            onClick={() => handleWordClick(wordObj, true)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-base md:text-lg transition-all
              ${feedback === 'correct' ? 'bg-green-200 text-green-800 animate-pulse' :
                feedback === 'incorrect' ? 'bg-red-200 text-red-800' :
                  'bg-purple-300 text-purple-900 hover:bg-purple-400'
              }
              ${isSpeaking ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            disabled={isSpeaking}
          >
            {wordObj.word}
          </button>
        ))
      )}
    </div>
  );

  const WordBank = () => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md mb-6">
      <h4 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">Word Bank:</h4>
      <div className="flex flex-wrap gap-2 items-center justify-center min-h-[80px]">
        {shuffledWords.length === 0 && assembledSentence.length === currentSentence.parts.length ? (
          <p className="text-gray-500 italic">All words placed. Check your sentence!</p>
        ) : (
          shuffledWords.map((wordObj) => (
            <button
              key={`shuffled-${wordObj.id}`}
              onClick={() => handleWordClick(wordObj, false)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-blue-500 text-white font-bold text-base md:text-lg shadow-md
                hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95
                ${isSpeaking ? 'opacity-70 cursor-not-allowed' : ''}
              `}
              disabled={isSpeaking}
            >
              {wordObj.word}
            </button>
          ))
        )}
      </div>
    </div>
  );

  const GameControls = () => (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
      <button
        onClick={checkSentence}
        disabled={assembledSentence.length !== currentSentence.parts.length || feedback === 'correct' || isSpeaking}
        className={`px-5 py-2.5 font-bold rounded-full shadow-md transition-all flex-1 sm:flex-none
          ${assembledSentence.length !== currentSentence.parts.length || feedback === 'correct' || isSpeaking
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
          }`}
      >
        <CheckCircle className="inline-block w-5 h-5 mr-2" /> Check
      </button>

      <button
        onClick={handleResetSentence}
        disabled={assembledSentence.length === 0 || isSpeaking}
        className={`px-5 py-2.5 font-bold rounded-full shadow-md transition-all flex-1 sm:flex-none
          ${assembledSentence.length === 0 || isSpeaking
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
      >
        <RotateCcw className="inline-block w-5 h-5 mr-2" /> Reset
      </button>

      <button
        onClick={() => speakSentence(currentSentence.parts.join(' '))}
        disabled={isSpeaking}
        className={`px-5 py-2.5 font-bold rounded-full shadow-md transition-all flex-1 sm:flex-none
          ${isSpeaking
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
      >
        <Volume2 className="inline-block w-5 h-5 mr-2" /> {isSpeaking ? 'Speaking...' : 'Hear It'}
      </button>
    </div>
  );

  const FeedbackArea = () => (
    <div className="text-center mb-6 min-h-[40px]">
      {feedback === 'correct' && (
        <div className="text-green-600 text-xl font-bold flex flex-col sm:flex-row items-center justify-center animate-fade-in gap-2">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-2" /> Great Job!
          </div>
          <button
            onClick={handleNextSentence}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            {currentSentenceIndex < currentSentences.length - 1 ? 'Next Sentence →' : 'View Story'}
          </button>
        </div>
      )}
      {feedback === 'incorrect' && (
        <p className="text-red-600 text-xl font-bold flex items-center justify-center animate-shake">
          <XCircle className="w-6 h-6 mr-2" /> Try Again!
        </p>
      )}
    </div>
  );

  const HintArea = () => (
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm text-center">
      <button
        onClick={() => setShowHint(prev => !prev)}
        className="text-blue-700 font-semibold hover:underline flex items-center justify-center mx-auto"
      >
        <Lightbulb className="w-5 h-5 mr-2" /> {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>
      {showHint && (
        <p className="mt-2 text-blue-800 text-lg italic animate-fade-in-down">"{currentSentence.hint}"</p>
      )}
    </div>
  );

  const AchievementsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
          <Trophy className="mr-2" /> Your Achievements
        </h2>
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.includes('high-scorer') && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Award className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-bold text-yellow-800">High Scorer</h3>
                  <p className="text-sm text-yellow-700">Earned 20+ points on a single sentence</p>
                </div>
              </div>
            )}
            {achievements.includes('game-completer') && (
              <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Award className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-bold text-purple-800">Game Master</h3>
                  <p className="text-sm text-purple-700">Completed the entire game mode</p>
                </div>
              </div>
            )}
            {achievements.includes('point-master') && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Award className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-bold text-blue-800">Point Master</h3>
                  <p className="text-sm text-blue-700">Reached 50+ total points</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">Complete sentences to earn achievements!</p>
          </div>
        )}
        <button
          onClick={() => setShowAchievements(false)}
          className="mt-6 w-full py-2 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );

  // -- Story display with read+highlight after completion
  const StoryDisplay = () => {
    if (!storyProgress.length) return null;
    const fullStory = storyProgress.join(' ');
    const tokens = tokenize(fullStory);
    return (
      <div className="bg-white p-4 rounded-lg shadow-inner mb-6 max-h-96 overflow-y-auto">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">
          Your Completed Story:
        </h3>
        <div className="text-left" aria-live="polite">
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {tokens.map((token, index) => {
              const isWord = /\w/.test(token);
              return (
                <span
                  key={index}
                  className={`transition-colors duration-200 ${
                    isWord && highlightedWord === index
                      ? 'bg-yellow-200 text-yellow-900 rounded px-1'
                      : ''
                  }`}
                >
                  {token}
                </span>
              );
            })}
          </p>
        </div>
        <button
          onClick={readStoryWithHighlight}
          disabled={isSpeaking}
          className={`mt-4 px-4 py-2 rounded-full font-medium flex items-center justify-center mx-auto ${
            isSpeaking
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          aria-label={isSpeaking ? 'Reading the story' : 'Read me the story'}
        >
          <Volume2 className="w-5 h-5 mr-2" />
          {isSpeaking ? 'Reading...' : 'Read Me The Story'}
        </button>
        {!('onboundary' in window.SpeechSynthesisUtterance.prototype) && (
          <div className="mt-2 text-xs text-red-500 text-center">
            Word highlighting is not supported in this browser.
          </div>
        )}
      </div>
    );
  };

  const GameCompleteScreen = () => (
    <div className="text-center p-6 md:p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 shadow-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-4 animate-bounce">
        {feedback === 'game-complete' ? '🎉 Game Complete! 🎉' : '⏰ Time Up! ⏰'}
      </h2>
      <StoryDisplay />
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-purple-600">Final Score: {score}</h3>
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 className="text-md font-semibold text-yellow-800 flex items-center justify-center mb-2">
            <Trophy className="mr-2" /> Achievements Earned
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {achievements.length > 0 ? (
              achievements.map((ach, idx) => (
                <div key={idx} className="bg-white px-3 py-1 rounded-full border border-yellow-300 flex items-center">
                  <Award className="w-4 h-4 text-yellow-600 mr-1" />
                  <span className="text-sm font-medium text-yellow-700">
                    {ach === 'high-scorer' ? 'High Scorer' :
                      ach === 'game-completer' ? 'Game Master' : 'Point Master'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-yellow-700 italic text-sm">Keep playing to earn achievements!</p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => handleSelectMode(gameMode === 'story' ? 'timed' : 'story')}
        className="px-6 md:px-8 py-2.5 md:py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 transition-colors mb-4"
      >
        Try {gameMode === 'story' ? 'Timed Challenge' : 'Story Mode'}
      </button>
      <button
        onClick={() => handleSelectMode(gameMode)}
        className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-purple-300"
      >
        Play Again
      </button>
    </div>
  );

  // ----------- MAIN RETURN -----------

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-6">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-purple-200">
        <GameHeader />
        {!gameMode ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Welcome to Story Scramble!</h2>
            <GameModes />
            <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Play</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Select a game mode above to begin</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Story Mode builds a narrative across sentences</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Timed Mode challenges you with more difficult sentences against the clock</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <GameModes />
            {showAchievements && <AchievementsModal />}
            {feedback === 'game-complete' || feedback === 'time-up' ? (
              <GameCompleteScreen />
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-700">
                    {gameMode === 'story'
                      ? `Story Part ${currentSentenceIndex + 1} of ${currentSentences.length}`
                      : `Challenge ${currentSentenceIndex + 1} of ${currentSentences.length}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Difficulty: <span className="font-medium capitalize">{currentSentence.difficulty}</span>
                    {gameMode === 'timed' && currentSentence.timeBonus && (
                      <span className="ml-2">• Time Bonus: +{currentSentence.timeBonus}s</span>
                    )}
                  </p>
                </div>
                <SentenceConstructionArea />
                <WordBank />
                <GameControls />
                <FeedbackArea />
                <HintArea />
              </>
            )}
          </>
        )}
      </div>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-bounce { animation: bounce 1s infinite; }
      `}</style>
    </div>
  );
};

export default StoryScrambleGame;