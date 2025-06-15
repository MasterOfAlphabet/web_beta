import { useState, useEffect, useRef } from 'react';

const SHARPWordHunt = () => {
  // Game constants
  const SHARP_GAME_MODES = {
    SYNONYMS: 'Synonyms',
    HOMONYMS: 'Homonyms',
    ANTONYMS: 'Antonyms',
    RHYMING: 'Rhyming',
    PLURALS: 'Plurals'
  };

  const DIFFICULTY_LEVELS = {
    EASY: 'Grade 1',
    MEDIUM: 'Grade 2',
    HARD: 'Advanced'
  };

  const ANIMAL_GUIDES = ['🦉', '🐻', '🦊', '🐸', '🐰', '🦝', '🐨', '🐱', '🐼', '🦋'];

  // Game state
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [gameMode, setGameMode] = useState(SHARP_GAME_MODES.RHYMING);
  const [targetWord, setTargetWord] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [words, setWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [particles, setParticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  // Refs
  const gameTimer = useRef(null);
  const wordSets = useRef({
    [SHARP_GAME_MODES.RHYMING]: {
      'CAT': ['BAT', 'HAT', 'MAT', 'RAT', 'SAT', 'FAT'],
      'DOG': ['LOG', 'FOG', 'HOG', 'JOG', 'COG', 'BOG'],
      'SUN': ['RUN', 'FUN', 'GUN', 'BUN', 'NUN', 'PUN'],
      'BALL': ['CALL', 'FALL', 'HALL', 'MALL', 'TALL', 'WALL'],
      'CAKE': ['LAKE', 'MAKE', 'TAKE', 'WAKE', 'RAKE', 'SAKE'],
      'BIKE': ['LIKE', 'HIKE', 'MIKE', 'PIKE', 'DIKE', 'TYKE']
    },
    [SHARP_GAME_MODES.ANTONYMS]: {
      'HOT': ['COLD', 'COOL', 'CHILL', 'FROZEN', 'ICY', 'FRIGID'],
      'BIG': ['SMALL', 'TINY', 'LITTLE', 'MINI', 'PETITE', 'MICRO'],
      'FAST': ['SLOW', 'SLUGGISH', 'LAZY', 'GRADUAL', 'STEADY', 'CRAWL'],
      'HAPPY': ['SAD', 'ANGRY', 'UPSET', 'GLOOMY', 'GRUMPY', 'BLUE'],
      'LIGHT': ['DARK', 'BLACK', 'SHADOWY', 'GLOOMY', 'DIM', 'MURKY'],
      'UP': ['DOWN', 'BELOW', 'UNDER', 'BENEATH', 'LOWER', 'BOTTOM']
    },
    [SHARP_GAME_MODES.SYNONYMS]: {
      'HAPPY': ['JOYFUL', 'GLAD', 'CHEERFUL', 'DELIGHTED', 'PLEASED', 'CONTENT'],
      'SAD': ['UNHAPPY', 'SORROWFUL', 'DEPRESSED', 'MISERABLE', 'GLOOMY', 'HEARTBROKEN'],
      'BIG': ['LARGE', 'HUGE', 'ENORMOUS', 'GIANT', 'MASSIVE', 'IMMENSE'],
      'SMALL': ['TINY', 'LITTLE', 'MINIATURE', 'PETITE', 'MINUSCULE', 'MICROSCOPIC'],
      'FAST': ['QUICK', 'RAPID', 'SWIFT', 'SPEEDY', 'BRIEF', 'HURRIED'],
      'WALK': ['STROLL', 'SAUNTER', 'AMBLE', 'TRUDGE', 'HIKE', 'MARCH']
    },
    [SHARP_GAME_MODES.HOMONYMS]: {
      'BAT': ['BAT (animal)', 'BAT (sports)'],
      'BARK': ['BARK (tree)', 'BARK (dog)'],
      'FAIR': ['FAIR (just)', 'FAIR (carnival)'],
      'LEAD': ['LEAD (metal)', 'LEAD (guide)'],
      'WIND': ['WIND (breeze)', 'WIND (twist)'],
      'TEAR': ['TEAR (rip)', 'TEAR (eye)']
    },
    [SHARP_GAME_MODES.PLURALS]: {
      'CAT': ['CATS'],
      'DOG': ['DOGS'],
      'BUSH': ['BUSHES'],
      'BABY': ['BABIES'],
      'TOOTH': ['TEETH'],
      'MOUSE': ['MICE'],
      'CHILD': ['CHILDREN'],
      'OX': ['OXEN'],
      'CACTUS': ['CACTI'],
      'FUNGUS': ['FUNGI']
    }
  });

  const gameModes = useRef(Object.values(SHARP_GAME_MODES));
  const distractorWords = useRef([
    'BOOK', 'CHAIR', 'APPLE', 'WATER', 'HOUSE', 'SCHOOL', 
    'HAPPY', 'JUMP', 'SING', 'DANCE', 'WRITE', 'READ',
    'PLAY', 'WORK', 'SLEEP', 'EAT', 'WALK', 'TALK',
    'LAUGH', 'CRY', 'SMILE', 'THINK', 'LEARN', 'TEACH'
  ]);

  const phonicsMap = useRef({
    'CAT': '/kæt/', 'BAT': '/bæt/', 'HAT': '/hæt/',
    'DOG': '/dɔg/', 'LOG': '/lɔg/', 'FOG': '/fɔg/',
    'SUN': '/sʌn/', 'RUN': '/rʌn/', 'FUN': '/fʌn/',
    'BALL': '/bɔːl/', 'CALL': '/kɔːl/', 'FALL': '/fɔːl/',
    'CAKE': '/keɪk/', 'LAKE': '/leɪk/', 'MAKE': '/meɪk/',
    'HOT': '/hɒt/', 'COLD': '/kəʊld/', 'COOL': '/kuːl/',
    'BIG': '/bɪɡ/', 'SMALL': '/smɔːl/', 'TINY': '/ˈtaɪni/',
    'FAST': '/fɑːst/', 'SLOW': '/sləʊ/', 'QUICK': '/kwɪk/',
    'HAPPY': '/ˈhæpi/', 'SAD': '/sæd/', 'JOYFUL': '/ˈdʒɔɪfəl/',
    'BAT (animal)': '/bæt/', 'BAT (sports)': '/bæt/',
    'BARK (tree)': '/bɑːk/', 'BARK (dog)': '/bɑːk/'
  });

  // Modal functions
  const showConfirmation = (title, message, onConfirm, onCancel = () => {}) => {
    setModalConfig({
      title,
      message,
      onConfirm: () => {
        setShowModal(false);
        onConfirm();
      },
      onCancel: () => {
        setShowModal(false);
        onCancel();
      }
    });
    setShowModal(true);
  };

  // Game functions
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setTimeLeft(60);
    setIsPaused(false);
    startLevel();
    startTimer();
  };

  const startTimer = () => {
    clearInterval(gameTimer.current);
    gameTimer.current = setInterval(() => {
      if (!isPaused && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
        
        if (timeLeft === 1) {
          timeUp();
        }
      }
    }, 1000);
  };

  const startLevel = () => {
    setSelectedWords([]);
    setTimeLeft(Math.max(45, 60 - level * 2));
    
    // Rotate through game modes
    const modeIndex = (level - 1) % gameModes.current.length;
    const currentMode = gameModes.current[modeIndex];
    setGameMode(currentMode);
    
    const wordSet = wordSets.current[currentMode];
    const targets = Object.keys(wordSet);
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    setTargetWord(randomTarget);
    setCorrectAnswers(wordSet[randomTarget]);
    
    generateWordGrid(wordSet[randomTarget]);
  };

  const generateWordGrid = (correctWords) => {
    const distractors = [...distractorWords.current]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(correctWords.length + 8, 24));
    
    const allWords = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map(word => ({
        word,
        isCorrect: correctWords.includes(word),
        isSelected: false
      }));
    
    setWords(allWords);
  };

  const handleWordClick = (wordObj) => {
    if (wordObj.isSelected) return;
    
    const updatedWords = words.map(w => 
      w.word === wordObj.word ? { ...w, isSelected: true } : w
    );
    setWords(updatedWords);
    
    setSelectedWords(prev => [...prev, wordObj.word]);
    
    if (wordObj.isCorrect) {
      correctAnswer(wordObj.word);
    } else {
      wrongAnswer();
    }
  };

  const correctAnswer = (word) => {
    const pointsEarned = (10 + level * 5) * (streak + 1);
    setScore(prev => prev + pointsEarned);
    setStreak(prev => prev + 1);
    setCorrectAnswers(prev => prev.filter(w => w !== word));
    
    celebrate(`Excellent! +${pointsEarned}`);
    createParticles();
    
    if (correctAnswers.length === 1) { // Last correct answer
      setTimeout(() => levelComplete(), 1500);
    } else if (correctAnswers.length <= 3) {
      showRemainingHint();
    }
  };

  const wrongAnswer = () => {
    setStreak(0);
  };

  const levelComplete = () => {
    setLevel(prev => prev + 1);
    setTimeLeft(prev => prev + 15); // Bonus time
    celebrate(`Level ${level} Complete! 🎉<br>+15 Bonus Seconds!`);
    
    setTimeout(() => {
      startLevel();
    }, 3000);
  };

  const timeUp = () => {
    clearInterval(gameTimer.current);
    celebrate(`Time's Up!<br>Final Score: ${score}<br>Level Reached: ${level}`);
    
    setTimeout(() => {
      showConfirmation(
        "Game Over!",
        `Your score: ${score}\nLevel reached: ${level}`,
        startGame,
        () => {}
      );
    }, 3000);
  };

  const celebrate = (message) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    
    setTimeout(() => {
      setShowCelebration(false);
    }, 2500);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      delay: Math.random() * 0.5
    }));
    
    setParticles(newParticles);
    
    setTimeout(() => {
      setParticles([]);
    }, 2000);
  };

  const showHint = () => {
    // Find unselected correct answers
    const remainingCorrect = words.filter(
      w => w.isCorrect && !w.isSelected
    ).slice(0, 2);
    
    // Temporarily highlight them
    const updatedWords = words.map(w => {
      if (remainingCorrect.some(rc => rc.word === w.word)) {
        return { ...w, isHinted: true };
      }
      return w;
    });
    
    setWords(updatedWords);
    
    setTimeout(() => {
      setWords(prev => prev.map(w => ({ ...w, isHinted: false })));
    }, 2000);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const skipChallenge = () => {
    showConfirmation(
      "Skip Challenge",
      "Are you sure you want to skip this challenge? (No points awarded)",
      () => {
        setLevel(prev => prev + 1);
        startLevel();
      }
    );
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    startLevel();
  };

  const changeAnimal = () => {
    setCurrentAnimal(prev => (prev + 1) % ANIMAL_GUIDES.length);
  };

  const showRemainingHint = () => {
    // Similar to showHint but automatic
    const remainingCorrect = words.filter(
      w => w.isCorrect && !w.isSelected
    );
    
    const updatedWords = words.map(w => {
      if (remainingCorrect.some(rc => rc.word === w.word)) {
        return { ...w, isHinted: true };
      }
      return w;
    });
    
    setWords(updatedWords);
    
    setTimeout(() => {
      setWords(prev => prev.map(w => ({ ...w, isHinted: false })));
    }, 4000);
  };

  const getChallengeDescription = () => {
    switch(gameMode) {
      case SHARP_GAME_MODES.RHYMING:
        return `Find words that rhyme with:`;
      case SHARP_GAME_MODES.ANTONYMS:
        return `Find words opposite to:`;
      case SHARP_GAME_MODES.SYNONYMS:
        return `Find words similar to:`;
      case SHARP_GAME_MODES.HOMONYMS:
        return `Find words that sound like:`;
      case SHARP_GAME_MODES.PLURALS:
        return `Find the plural of:`;
      default:
        return `Find words that match:`;
    }
  };

  const getWordCardClass = (wordObj) => {
    let baseClass = "flex flex-col items-center justify-center p-2 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-105 ";
    
    if (wordObj.isSelected) {
      if (wordObj.isCorrect) {
        return baseClass + "bg-gradient-to-br from-green-400 to-green-600 text-white animate-pulse";
      } else {
        return baseClass + "bg-gradient-to-br from-red-400 to-red-600 text-white animate-shake";
      }
    }
    
    if (wordObj.isHinted) {
      return baseClass + "bg-gradient-to-br from-yellow-300 to-yellow-500 text-white";
    }
    
    return baseClass + "bg-white/90 hover:bg-white";
  };

  // Initialize game on first render
  useEffect(() => {
    startGame();
    return () => clearInterval(gameTimer.current);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 animate-gradient-xy overflow-hidden relative">
      {/* Header */}
      <div className="absolute top-4 left-0 right-0 text-center z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg animate-bounce">
          🌈 SHARP Word Hunt 🌈
        </h1>
        
        <div className="flex justify-center gap-4 md:gap-6 text-lg md:text-xl text-white drop-shadow-md">
          <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full">
            Score: <span className="font-bold">{score}</span>
          </div>
          <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full">
            Level: <span className="font-bold">{level}</span>
          </div>
          <div className={`bg-white/25 backdrop-blur-md px-4 py-2 rounded-full ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-300'}`}>
            Time: <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full">
            Mode: <span className="font-bold">{gameMode}</span>
          </div>
        </div>
        
        <div className={`${streak >= 3 ? 'bg-gradient-to-r from-red-500 to-yellow-500 text-white' : 'bg-white/90'} 
          absolute top-28 right-8 px-4 py-2 rounded-xl shadow-md transition-all`}>
          🔥 Streak: <span className="font-bold">{streak}</span>
        </div>
      </div>
      
      {/* Animal Guide */}
      <div 
        className="absolute top-32 right-8 text-5xl animate-bounce cursor-pointer hover:scale-110 transition-transform z-10"
        onClick={changeAnimal}
      >
        {ANIMAL_GUIDES[currentAnimal]}
      </div>
      
      {/* Controls */}
      <div className="absolute top-32 left-8 flex flex-col gap-3 z-10">
        <button 
          onClick={showHint}
          className="w-12 h-12 bg-white/90 rounded-full shadow-md flex items-center justify-center text-2xl hover:bg-yellow-300 hover:scale-110 transition-all"
          title="Get a hint"
        >
          💡
        </button>
        
        <button 
          onClick={togglePause}
          className="w-12 h-12 bg-white/90 rounded-full shadow-md flex items-center justify-center text-2xl hover:bg-blue-300 hover:scale-110 transition-all"
          title={isPaused ? "Resume game" : "Pause game"}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
        
        <button 
          onClick={skipChallenge}
          className="w-12 h-12 bg-white/90 rounded-full shadow-md flex items-center justify-center text-2xl hover:bg-red-300 hover:scale-110 transition-all"
          title="Skip challenge"
        >
          ⏭️
        </button>
        
        <select 
          value={difficulty}
          onChange={(e) => changeDifficulty(e.target.value)}
          className="bg-white/90 rounded-full px-3 py-2 text-sm shadow-md focus:outline-none"
        >
          {Object.values(DIFFICULTY_LEVELS).map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      
      {/* Game Board */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-2/3">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 h-full p-4">
          {words.map((wordObj, index) => (
            <div 
              key={index}
              className={getWordCardClass(wordObj)}
              onClick={() => handleWordClick(wordObj)}
            >
              <div className="text-xl font-bold text-gray-800">{wordObj.word}</div>
              <div className="text-sm text-gray-500 italic">
                {phonicsMap.current[wordObj.word] || `/${wordObj.word.toLowerCase()}/`}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mission Panel */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg text-center">
        <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">
          {gameMode} Challenge
        </div>
        <div className="text-lg font-semibold">
          {getChallengeDescription()} <span className="text-indigo-600 font-bold">{targetWord}</span>
        </div>
      </div>
      
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl md:text-4xl font-bold text-center text-yellow-300 drop-shadow-lg z-20 animate-scale-in">
          <div dangerouslySetInnerHTML={{ __html: celebrationMessage }} />
        </div>
      )}
      
      {/* Particles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              top: '50%',
              left: '50%',
              animation: `particle-fall 2s linear ${particle.delay}s forwards`,
            }}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">{modalConfig.title}</h3>
            <p className="whitespace-pre-line mb-6">{modalConfig.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={modalConfig.onCancel}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={modalConfig.onConfirm}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SHARPWordHunt;