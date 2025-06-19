import React, { useState, useEffect, useRef } from 'react';

// Sample dictionary with words and definitions
const wordDictionary = {
  easy: [
    { word: "apple", definition: "A sweet fruit that grows on trees", phonetic: "AP-uhl" },
    { word: "brave", definition: "Showing courage in the face of danger", phonetic: "BRAYV" },
    { word: "climb", definition: "To go up something, like a mountain or ladder", phonetic: "KLIME" },
    { word: "dream", definition: "Images and stories created by your mind while sleeping", phonetic: "DREEM" },
    { word: "earth", definition: "The planet we live on", phonetic: "URTH" },
    { word: "flame", definition: "The bright part of a fire", phonetic: "FLAYM" },
    { word: "glass", definition: "A hard, transparent material", phonetic: "GLAS" },
    { word: "house", definition: "A building where people live", phonetic: "HOWS" }
  ],
  medium: [
    { word: "bicycle", definition: "A two-wheeled vehicle you pedal to move", phonetic: "BY-si-kuhl" },
    { word: "capture", definition: "To catch or take control of something", phonetic: "KAP-cher" },
    { word: "dolphin", definition: "A highly intelligent marine mammal", phonetic: "DOL-fin" },
    { word: "elephant", definition: "A large mammal with a trunk", phonetic: "EL-uh-fuhnt" },
    { word: "fantastic", definition: "Extremely good or impressive", phonetic: "fan-TAS-tik" },
    { word: "gigantic", definition: "Extremely large", phonetic: "jy-GAN-tik" },
    { word: "helicopter", definition: "An aircraft with rotating blades", phonetic: "HEL-i-kop-ter" },
    { word: "important", definition: "Of great significance or value", phonetic: "im-POR-tuhnt" }
  ],
  hard: [
    { word: "kaleidoscope", definition: "A tube with mirrors creating changing patterns", phonetic: "kuh-LY-duh-skohp" },
    { word: "labyrinth", definition: "A complicated network of passages; a maze", phonetic: "LAB-uh-rinth" },
    { word: "magnificent", definition: "Extremely beautiful and impressive", phonetic: "mag-NIF-uh-suhnt" },
    { word: "necessary", definition: "Required to be done or present", phonetic: "NES-uh-ser-ee" },
    { word: "opportunity", definition: "A chance for advancement or progress", phonetic: "op-er-TOO-ni-tee" },
    { word: "personality", definition: "The combination of characteristics forming character", phonetic: "pur-suh-NAL-i-tee" },
    { word: "questionnaire", definition: "A set of questions for gathering information", phonetic: "kwes-chuh-NAIR" },
    { word: "responsibility", definition: "The state of being accountable for something", phonetic: "ri-spon-suh-BIL-i-tee" }
  ]
};

// Game modes
const GAME_MODES = {
  SINGLE_PLAYER: 'single',
  MULTI_PLAYER: 'multi',
  VOICE_MODE: 'voice'
};

const SpellingDuel = () => {
  // Game state
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState(GAME_MODES.SINGLE_PLAYER);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [playerInput, setPlayerInput] = useState('');
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceResult, setVoiceResult] = useState('');
  const [wordStreak, setWordStreak] = useState(0);
  const [dynamicDifficulty, setDynamicDifficulty] = useState('medium');
  const [aiTyping, setAiTyping] = useState(false);
  const [aiAnswer, setAiAnswer] = useState('');
  const [playerTurn, setPlayerTurn] = useState(true);
  const [roundPhase, setRoundPhase] = useState('listening'); // 'listening', 'spelling', 'results'
  
  // Refs
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Speech synthesis
  const speakWord = (word, rate = 1) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initialize voice recognition
  useEffect(() => {
    if (gameMode === GAME_MODES.VOICE_MODE) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          setVoiceResult(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Voice recognition error', event.error);
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [gameMode]);

  // Start/stop voice recognition
  const toggleVoiceRecognition = () => {
    if (recognitionRef.current) {
      if (voiceActive) {
        recognitionRef.current.stop();
        setVoiceActive(false);
      } else {
        recognitionRef.current.start();
        setVoiceActive(true);
      }
    }
  };

  // Adjust difficulty based on player performance
  const adjustDifficulty = (correct) => {
    if (correct) {
      setWordStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak >= 3 && dynamicDifficulty !== 'hard') {
          setDynamicDifficulty('hard');
          setMessage("Difficulty increased to Hard!");
        } else if (newStreak >= 2 && dynamicDifficulty === 'easy') {
          setDynamicDifficulty('medium');
          setMessage("Difficulty increased to Medium!");
        }
        return newStreak;
      });
    } else {
      setWordStreak(0);
      if (dynamicDifficulty !== 'easy') {
        setDynamicDifficulty('medium');
        setMessage("Difficulty decreased to Medium!");
      }
    }
  };

  // AI response times based on difficulty
  const getAiTypingTime = () => {
    const baseTimes = { easy: 3000, medium: 4000, hard: 5000 };
    return baseTimes[dynamicDifficulty] * (0.8 + Math.random() * 0.4);
  };

  // Start a new game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setAiScore(0);
    setPlayer2Score(0);
    setRound(1);
    setTimeLeft(60);
    setDynamicDifficulty(difficulty);
    setWordStreak(0);
    setPlayerTurn(true);
    setRoundPhase('listening');
    nextWord();
  };

  // Get a new random word
  const nextWord = () => {
    const words = wordDictionary[dynamicDifficulty];
    const randomWordObj = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWordObj);
    setPlayerInput('');
    setVoiceResult('');
    setMessage('');
    setShowHint(false);
    setAiTyping(false);
    setAiAnswer('');
    setRoundPhase('listening');
    
    // Speak the word after a brief delay
    setTimeout(() => {
      speakWord(randomWordObj.word, 0.8);
      setMessage(`Listen carefully and spell: "${randomWordObj.word}"`);
      
      // After speaking, allow spelling
      setTimeout(() => {
        setRoundPhase('spelling');
        setMessage('Now type what you heard!');
        inputRef.current?.focus();
        
        // Start AI typing simulation if in single player mode
        if (gameMode === GAME_MODES.SINGLE_PLAYER) {
          startAiTyping();
        }
      }, 2000);
    }, 1000);
  };

  // Simulate AI typing
  const startAiTyping = () => {
    setAiTyping(true);
    setAiAnswer('');
    
    const typingTime = getAiTypingTime();
    const word = currentWord.word;
    
    // AI makes mistakes based on difficulty
    let aiSpelling = word;
    const mistakeChance = { easy: 0.3, medium: 0.15, hard: 0.08 }[dynamicDifficulty];
    
    if (Math.random() < mistakeChance) {
      // Different types of mistakes
      const mistakes = [
        () => aiSpelling.replace(/(.)(.)/, '$2$1'), // swap two letters
        () => aiSpelling.replace(/[aeiou]/, 'e'), // vowel confusion
        () => aiSpelling.slice(0, -1) + (aiSpelling.slice(-1) === 's' ? '' : 's'), // add/remove s
        () => aiSpelling.replace(/c/, 'k').replace(/k/, 'c'), // c/k confusion
        () => aiSpelling.replace(/ph/, 'f').replace(/f/, 'ph') // ph/f confusion
      ];
      
      const randomMistake = mistakes[Math.floor(Math.random() * mistakes.length)];
      try {
        aiSpelling = randomMistake();
      } catch (e) {
        // If mistake function fails, use original word
        aiSpelling = word;
      }
    }
    
    // Simulate typing character by character
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < aiSpelling.length) {
        setAiAnswer(aiSpelling.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setAiTyping(false);
        
        // AI submits after finishing typing
        setTimeout(() => {
          checkAiSpelling(aiSpelling);
        }, 500);
      }
    }, typingTime / aiSpelling.length);
  };

  // Check AI spelling
  const checkAiSpelling = (aiSpelling) => {
    const correct = aiSpelling.toLowerCase() === currentWord.word.toLowerCase();
    
    if (correct) {
      setAiScore(s => s + 10);
      setMessage(`AI spelled "${aiSpelling}" - Correct! AI gets 10 points`);
    } else {
      setMessage(`AI spelled "${aiSpelling}" - Incorrect! The word was "${currentWord.word}"`);
    }
    
    // Move to next round after showing results
    setTimeout(() => {
      if (round < 10) {
        setRound(r => r + 1);
        nextWord();
      } else {
        endGame();
      }
    }, 3000);
  };

  // Handle player submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (roundPhase !== 'spelling') return;
    checkSpelling(playerInput);
  };

  // Handle voice submission
  const handleVoiceSubmit = () => {
    if (roundPhase !== 'spelling') return;
    checkSpelling(voiceResult);
  };

  // Check spelling attempt
  const checkSpelling = (attempt) => {
    if (!attempt.trim()) return;
    
    const correct = attempt.toLowerCase().trim() === currentWord.word.toLowerCase();
    
    if (correct) {
      setScore(s => s + 10);
      setMessage(`Correct! You spelled "${attempt}" - You get 10 points`);
      adjustDifficulty(true);
    } else {
      setMessage(`Incorrect! You spelled "${attempt}" but the word was "${currentWord.word}"`);
      adjustDifficulty(false);
    }
    
    setRoundPhase('results');
    
    // If AI hasn't finished yet, wait for it
    if (gameMode === GAME_MODES.SINGLE_PLAYER && aiTyping) {
      // Player finished first, wait for AI
      return;
    }
    
    // Move to next round
    setTimeout(() => {
      if (round < 10) {
        setRound(r => r + 1);
        nextWord();
      } else {
        endGame();
      }
    }, 3000);
  };

  // Handle player 2 submission in multiplayer
  const handlePlayer2Submit = (e) => {
    e.preventDefault();
    if (roundPhase !== 'spelling') return;
    
    const attempt = e.target.player2Input.value;
    if (!attempt.trim()) return;
    
    const correct = attempt.toLowerCase().trim() === currentWord.word.toLowerCase();
    
    if (correct) {
      setPlayer2Score(s => s + 10);
      setMessage(`Player 2 spelled "${attempt}" correctly! +10 points`);
    } else {
      setMessage(`Player 2 spelled "${attempt}" incorrectly! The word was "${currentWord.word}"`);
    }
    
    setRoundPhase('results');
    e.target.player2Input.value = '';
    
    // Move to next round
    setTimeout(() => {
      if (round < 10) {
        setRound(r => r + 1);
        nextWord();
      } else {
        endGame();
      }
    }, 3000);
  };

  // Repeat word function
  const repeatWord = () => {
    if (currentWord) {
      speakWord(currentWord.word, 0.6);
    }
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    setRoundPhase('results');
    
    let winMessage = '';
    if (gameMode === GAME_MODES.MULTI_PLAYER) {
      if (score > player2Score) {
        winMessage = "Player 1 Wins! 🎉";
      } else if (player2Score > score) {
        winMessage = "Player 2 Wins! 👏";
      } else {
        winMessage = "It's a Tie! 🤝";
      }
    } else {
      if (score > aiScore) {
        winMessage = "You Win! 🎉";
      } else if (aiScore > score) {
        winMessage = "AI Wins! 🤖";
      } else {
        winMessage = "It's a Tie! 🤝";
      }
    }
    
    setMessage(winMessage);
  };

  // Timer countdown
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex flex-col items-center py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">🎯 Spelling Duel</h1>
        <p className="text-lg text-gray-600">Listen, spell, and compete!</p>
      </header>

      {!gameStarted ? (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Game Settings</h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-medium">Game Mode</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setGameMode(GAME_MODES.SINGLE_PLAYER)}
                className={`p-3 rounded-lg transition-all text-sm ${
                  gameMode === GAME_MODES.SINGLE_PLAYER
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                vs AI
              </button>
              <button
                onClick={() => setGameMode(GAME_MODES.MULTI_PLAYER)}
                className={`p-3 rounded-lg transition-all text-sm ${
                  gameMode === GAME_MODES.MULTI_PLAYER
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                vs Friend
              </button>
              <button
                onClick={() => setGameMode(GAME_MODES.VOICE_MODE)}
                className={`p-3 rounded-lg transition-all text-sm ${
                  gameMode === GAME_MODES.VOICE_MODE
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Voice Mode
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 font-medium">Difficulty Level</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(wordDictionary).map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    difficulty === level 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🎧 How to Play:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Listen carefully to the spoken word</li>
              <li>• Type what you heard (no cheating!)</li>
              <li>• Race against the AI to score points</li>
              <li>• Use hints if you're stuck</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
          >
            Start Spelling Duel! 🚀
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {/* Game stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-1">Round</div>
              <div className="text-2xl font-bold text-gray-800">{round}/10</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-1">You</div>
              <div className="text-2xl font-bold text-blue-600">{score}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-1">
                {gameMode === GAME_MODES.MULTI_PLAYER ? "Player 2" : "AI"}
              </div>
              <div className="text-2xl font-bold text-red-600">
                {gameMode === GAME_MODES.MULTI_PLAYER ? player2Score : aiScore}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-sm text-gray-500 mb-1">Time</div>
              <div className={`text-2xl font-bold ${timeLeft <= 15 ? "text-red-600 animate-pulse" : "text-gray-800"}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {!gameOver ? (
            <>
              {/* Current word display - only show during listening phase */}
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6 text-center relative">
                {roundPhase === 'listening' ? (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 mb-2">🔊 LISTENING...</h2>
                    <div className="text-2xl text-gray-600 animate-pulse">
                      Prepare to hear the word!
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 mb-2">✍️ SPELL THE WORD YOU HEARD</h2>
                    <div className="flex justify-center gap-4 mb-4">
                      <button
                        onClick={repeatWord}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        🔄 Repeat Word
                      </button>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                      >
                        💡 {showHint ? 'Hide' : 'Show'} Hint
                      </button>
                    </div>
                    
                    {showHint && currentWord && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-blue-800 mb-2">
                          <strong>Definition:</strong> {currentWord.definition}
                        </p>
                        <p className="text-blue-700 text-sm">
                          <strong>Sounds like:</strong> {currentWord.phonetic}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Player input area */}
              {roundPhase === 'spelling' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Player 1 Input */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      👤 Your Turn
                    </h3>
                    
                    {gameMode === GAME_MODES.VOICE_MODE ? (
                      <div>
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={toggleVoiceRecognition}
                            className={`flex-1 p-3 rounded-lg font-bold ${
                              voiceActive 
                                ? "bg-red-600 text-white hover:bg-red-700" 
                                : "bg-green-600 text-white hover:bg-green-700"
                            } transition-all`}
                          >
                            {voiceActive ? "🛑 Stop" : "🎤 Speak"}
                          </button>
                          <button
                            onClick={handleVoiceSubmit}
                            disabled={!voiceResult.trim()}
                            className={`px-6 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all ${
                              !voiceResult.trim() ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            Submit
                          </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-500 mb-1">Voice Recognition:</p>
                          <p className="font-mono text-lg">{voiceResult || "Speak to see text here..."}</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="flex gap-2">
                          <input
                            ref={inputRef}
                            type="text"
                            value={playerInput}
                            onChange={(e) => setPlayerInput(e.target.value)}
                            className="flex-1 p-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Type the word you heard..."
                            disabled={roundPhase !== 'spelling'}
                          />
                          <button
                            type="submit"
                            disabled={!playerInput.trim() || roundPhase !== 'spelling'}
                            className="px-6 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                  
                  {/* AI/Player 2 Display */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {gameMode === GAME_MODES.MULTI_PLAYER ? "👥 Player 2" : "🤖 AI Opponent"}
                    </h3>
                    
                    {gameMode === GAME_MODES.MULTI_PLAYER ? (
                      <form onSubmit={handlePlayer2Submit}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="player2Input"
                            className="flex-1 p-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Player 2: Type the word..."
                            disabled={roundPhase !== 'spelling'}
                          />
                          <button
                            type="submit"
                            disabled={roundPhase !== 'spelling'}
                            className="px-6 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-500">AI is typing:</span>
                          {aiTyping && (
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          )}
                        </div>
                        <p className="font-mono text-lg min-h-[2rem] flex items-center">
                          {aiAnswer || (aiTyping ? "..." : "Waiting for round to start...")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Game over screen */
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-4xl font-bold mb-4">
                {score > aiScore && score > player2Score ? (
                  <span className="text-green-600">🎉 You Win!</span>
                ) : gameMode === GAME_MODES.MULTI_PLAYER && player2Score > score ? (
                  <span className="text-red-600">👏 Player 2 Wins!</span>
                ) : (gameMode === GAME_MODES.SINGLE_PLAYER || gameMode === GAME_MODES.VOICE_MODE) && aiScore > score ? (
                  <span className="text-red-600">🤖 AI Wins!</span>
                ) : (
                  <span className="text-blue-600">🤝 It's a Tie!</span>
                )}
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Your Score</div>
                    <div className="text-3xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-gray-400">{Math.round(score/10)} words correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">
                      {gameMode === GAME_MODES.MULTI_PLAYER ? "Player 2" : "AI"} Score
                    </div>
                    <div className="text-3xl font-bold text-red-600">
                      {gameMode === GAME_MODES.MULTI_PLAYER ? player2Score : aiScore}
                    </div>
                    <div className="text-sm text-gray-400">
                      {Math.round((gameMode === GAME_MODES.MULTI_PLAYER ? player2Score : aiScore)/10)} words correct
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <strong>Final Difficulty:</strong> <span className="capitalize">{dynamicDifficulty}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Best Streak:</strong> {wordStreak} words
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  🎯 Play Again
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameOver(false);
                  }}
                  className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-all transform hover:scale-105"
                >
                  ⚙️ New Game
                </button>
              </div>
            </div>
          )}
          
          {/* Message display */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
              message.includes("Correct") || message.includes("Win") ? "bg-green-100 text-green-800 border border-green-200" : 
              message.includes("Incorrect") || message.includes("AI Wins") ? "bg-red-100 text-red-800 border border-red-200" : 
              message.includes("Tie") ? "bg-blue-100 text-blue-800 border border-blue-200" :
              "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}>
              {message}
            </div>
          )}
          
          {/* Game instructions */}
          <div className="mt-8 bg-white/80 p-4 rounded-lg shadow-sm">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>🎯 Current Phase:</strong> {
                  roundPhase === 'listening' ? 'Listening to word...' :
                  roundPhase === 'spelling' ? 'Type what you heard!' :
                  'Checking answers...'
                }
              </p>
              <p>
                <strong>💡 Tip:</strong> Listen carefully, use hints if needed, and spell exactly what you hear!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellingDuel;