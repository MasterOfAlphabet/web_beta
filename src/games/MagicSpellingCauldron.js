import React, { useState, useEffect, useCallback } from 'react';

const MagicSpellingCauldron = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [spelledWord, setSpelledWord] = useState([]);
  const [wizardMessage, setWizardMessage] = useState("Welcome, young wizard! Drag the letters to spell the word and create magic! ✨");
  const [isBrewingAnimation, setIsBrewingAnimation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [magicParticles, setMagicParticles] = useState([]);

  const words = [
    // Level 1 - 3 letter words
    {word: 'CAT', image: '🐱', level: 1},
    {word: 'DOG', image: '🐶', level: 1},
    {word: 'SUN', image: '☀️', level: 1},
    {word: 'BAT', image: '🦇', level: 1},
    {word: 'HAT', image: '👒', level: 1},
    // Level 2 - 4 letter words
    {word: 'FISH', image: '🐟', level: 2},
    {word: 'BIRD', image: '🐦', level: 2},
    {word: 'TREE', image: '🌳', level: 2},
    {word: 'MOON', image: '🌙', level: 2},
    {word: 'STAR', image: '⭐', level: 2},
    // Level 3 - 5 letter words
    {word: 'HOUSE', image: '🏠', level: 3},
    {word: 'FLOWER', image: '🌸', level: 3},
    {word: 'HEART', image: '❤️', level: 3},
    {word: 'SMILE', image: '😊', level: 3},
    {word: 'MAGIC', image: '✨', level: 3}
  ];

  const wizardMessages = [
    "Excellent spelling, young wizard! ✨",
    "Magical! Your spelling powers are growing! 🌟",
    "Wonderful! The magic flows through you! 🪄",
    "Brilliant spell casting! Keep it up! ⭐",
    "Amazing! You're becoming a spelling master! 🧙‍♂️"
  ];

  const hintMessages = [
    "Listen carefully to the sound of each letter! 👂",
    "Think about what letter comes first! 🤔",
    "What sound do you hear at the end? 🎵",
    "Break the word into smaller sounds! 🔤",
    "You've got this! Trust your instincts! 💪"
  ];

  const generateStars = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2
    }));
  };

  const [backgroundStars] = useState(generateStars());

  const generateLetters = useCallback(() => {
    const currentWord = words[currentWordIndex];
    const wordLetters = currentWord.word.split('');
    
    const extraLetters = ['A', 'E', 'I', 'O', 'U', 'B', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    const letters = [...wordLetters];
    
    for (let i = 0; i < Math.min(5, 8 - wordLetters.length); i++) {
      const randomLetter = extraLetters[Math.floor(Math.random() * extraLetters.length)];
      if (!letters.includes(randomLetter) || Math.random() > 0.7) {
        letters.push(randomLetter);
      }
    }

    // Shuffle letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    setAvailableLetters(letters);
  }, [currentWordIndex]);

  const loadWord = useCallback(() => {
    const currentWord = words[currentWordIndex];
    
    if (currentWord.level !== currentLevel) {
      setCurrentLevel(currentWord.level);
    }

    generateLetters();
    setSpelledWord([]);
    setHintsUsed(0);
    setWizardMessage("Try spelling the word! You can do it! 🌟");
  }, [currentWordIndex, currentLevel, generateLetters]);

  useEffect(() => {
    loadWord();
  }, [loadWord]);

  const addLetterToSpell = (letter) => {
    const currentWord = words[currentWordIndex];
    if (spelledWord.length < currentWord.word.length) {
      setSpelledWord(prev => [...prev, letter]);
    }
  };

  const clearSpell = () => {
    setSpelledWord([]);
    setWizardMessage("Try spelling the word! You can do it! 🌟");
  };

  const createMagicParticle = () => {
    const colors = ['bg-yellow-400', 'bg-red-400', 'bg-blue-400', 'bg-purple-400'];
    return {
      id: Date.now() + Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  };

  const showMagicEffect = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        particles.push(createMagicParticle());
        setMagicParticles(prev => [...prev, createMagicParticle()]);
      }, i * 50);
    }

    setTimeout(() => {
      setMagicParticles([]);
    }, 2000);
  };

  const calculateStars = () => {
    let newStars;
    if (hintsUsed === 0) {
      newStars = 3;
    } else if (hintsUsed === 1) {
      newStars = 2;
    } else {
      newStars = 1;
    }
    setStars(newStars);
  };

  const showSuccessAnimation = () => {
    setIsBrewingAnimation(true);
    setShowSuccess(true);
    calculateStars();
    setScore(prev => prev + (100 * currentLevel));
    showMagicEffect();
    
    const randomMessage = wizardMessages[Math.floor(Math.random() * wizardMessages.length)];
    setWizardMessage(randomMessage);

    setTimeout(() => {
      setShowSuccess(false);
      setIsBrewingAnimation(false);
      if (currentWordIndex < words.length - 1) {
        nextWord();
      } else {
        setWizardMessage("🎉 Congratulations! You've completed all the spelling challenges! You're now a Master Spell Caster! 🧙‍♂️✨");
      }
    }, 2000);
  };

  const showIncorrectFeedback = () => {
    setWizardMessage("Hmm, that's not quite right. Try again! The magic needs the correct spelling. 🤔");
  };

  const castSpell = () => {
    const currentWord = words[currentWordIndex];
    const userSpelling = spelledWord.join('');
    
    if (userSpelling === currentWord.word) {
      showSuccessAnimation();
    } else {
      showIncorrectFeedback();
    }
  };

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  const getHint = () => {
    setHintsUsed(prev => prev + 1);
    const currentWord = words[currentWordIndex];
    const randomHint = hintMessages[Math.floor(Math.random() * hintMessages.length)];
    
    let specificHint = "";
    if (spelledWord.length === 0) {
      specificHint = `The word starts with the letter "${currentWord.word[0]}"! `;
    } else if (spelledWord.length < currentWord.word.length) {
      const nextLetter = currentWord.word[spelledWord.length];
      specificHint = `The next letter is "${nextLetter}"! `;
    }
    
    setWizardMessage(specificHint + randomHint);
  };

  const currentWord = words[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-x-hidden relative font-sans">
      {/* Background Stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {backgroundStars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Magic Particles */}
      {magicParticles.map(particle => (
        <div
          key={particle.id}
          className={`fixed w-2 h-2 ${particle.color} rounded-full animate-bounce pointer-events-none z-50`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: 'sparkle 1s ease-out forwards'
          }}
        />
      ))}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-5xl text-yellow-400 font-bold animate-bounce">
            ✨ PERFECT SPELL! ✨
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto p-5 min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
            🧙‍♂️ Magic Spelling Cauldron ✨
          </h1>
        </div>

        {/* Level Info */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 space-y-4 md:space-y-0">
          <div className="text-yellow-400 text-xl font-bold">
            Level {currentLevel}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <span
                key={i}
                className={`text-2xl ${
                  i <= stars ? 'text-yellow-400' : 'text-gray-600'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
          <div className="text-white text-xl font-bold">
            Score: {score}
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cauldron Area */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Target Word */}
            <div className="bg-white/15 backdrop-blur-md p-6 rounded-2xl mb-6 text-center border-2 border-yellow-400/30 w-full max-w-md">
              <div className="text-yellow-400 text-xl mb-4">Spell the word:</div>
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg">
                {currentWord.image}
              </div>
              <div className="text-white text-2xl font-bold">
                {currentWord.word}
              </div>
            </div>

            {/* Cauldron */}
            <div className={`relative mb-6 ${isBrewingAnimation ? 'animate-bounce' : ''}`}>
              <div className="w-48 h-48 bg-gradient-to-b from-gray-600 via-gray-700 to-black rounded-b-full relative shadow-2xl border-4 border-gray-500">
                {/* Cauldron rim */}
                <div className="absolute -top-3 -left-4 -right-4 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full shadow-lg border-2 border-gray-400"></div>
                {/* Magic glow effect */}
                <div className="absolute inset-4 bg-gradient-to-t from-purple-900/20 to-blue-900/20 rounded-b-full"></div>
                {/* Bubbling effect indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl">
                  🔮
                </div>
              </div>
            </div>

            {/* Spell Area */}
            <div className="min-h-16 bg-white/10 border-2 border-dashed border-yellow-400/50 rounded-2xl flex items-center justify-center gap-3 p-4 mb-6 w-full max-w-lg">
              {Array.from({ length: currentWord.word.length }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold ${
                    spelledWord[i]
                      ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-lg'
                      : 'bg-white/10 border-yellow-400/30 text-white'
                  }`}
                >
                  {spelledWord[i] || ''}
                </div>
              ))}
            </div>

            {/* Letters Container */}
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {availableLetters.map((letter, index) => (
                <div
                  key={`${letter}-${index}`}
                  className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg md:text-xl font-bold text-white cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 animate-pulse shadow-md"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => addLetterToSpell(letter)}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Companion */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center h-fit">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl animate-bounce">
              🧙‍♀️
            </div>
            <div className="bg-white/20 p-4 rounded-2xl text-white text-lg mb-4 min-h-16 flex items-center justify-center">
              {wizardMessage}
            </div>
            <button
              className="bg-gradient-to-r from-red-400 to-yellow-400 text-white px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
              onClick={getHint}
            >
              Get Hint 💡
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="bg-gradient-to-r from-teal-400 to-pink-400 text-gray-800 px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            onClick={clearSpell}
          >
            Clear Spell
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            onClick={castSpell}
          >
            Cast Spell! 🪄
          </button>
          <button
            className="bg-gradient-to-r from-teal-400 to-pink-400 text-gray-800 px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            onClick={nextWord}
          >
            Next Word
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: scale(0) translateY(0);
          }
          100% {
            opacity: 0;
            transform: scale(1) translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
};

export default MagicSpellingCauldron;