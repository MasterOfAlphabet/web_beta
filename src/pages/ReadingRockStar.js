import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStar, FaTrophy, FaHome, FaBook, FaChartLine } from 'react-icons/fa';

const ReadingRockStar = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [userProgress, setUserProgress] = useState({
    words: { rookie: 0, racer: 0, master: 0, prodigy: 0, wizard: 0 },
    sentences: { rookie: 0, racer: 0, master: 0, prodigy: 0, wizard: 0 },
    paragraphs: { rookie: 0, racer: 0, master: 0, prodigy: 0, wizard: 0 },
    stories: { rookie: 0, racer: 0, master: 0, prodigy: 0, wizard: 0 },
    comprehension: { rookie: 0, racer: 0, master: 0, prodigy: 0, wizard: 0 },
  });
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [spokenWords, setSpokenWords] = useState([]);
  const recognitionRef = useRef(null);

  const gameContent = {
    words: {
      rookie: ['cat', 'dog', 'sun', 'hat', 'run'],
      racer: ['elephant', 'butterfly', 'umbrella', 'adventure', 'celebrate'],
      master: ['extravaganza', 'phenomenon', 'quintessential', 'magnificent', 'extraordinary'],
      prodigy: ['antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosis', 'floccinaucinihilipilification', 'pseudopseudohypoparathyroidism'],
      wizard: ['sesquipedalian', 'xenotransplantation', 'quizzaciously', 'syzygy', 'onomatopoeia']
    },
    sentences: {
      rookie: ['The sun is bright.', 'I like to play.', 'She has a red hat.', 'We run fast.', 'It is fun.'],
      racer: ['The quick brown fox jumps over the lazy dog.', 'Reading regularly improves comprehension skills.', 'Adventure awaits around every corner.', 'Celebrate small victories every day.', 'Learning new words expands your world.'],
      master: ['The phenomenon of bioluminescence occurs in various marine organisms.', 'Her magnanimous donation helped build the new community center.', 'Quintessential examples of Renaissance art can be found in Florence.', 'The extraterrestrial hypothesis remains controversial among scientists.'],
      prodigy: ['The antidisestablishmentarianism movement opposed the withdrawal of state support from an established church.', 'Pneumonoultramicroscopicsilicovolcanoconiosis is a lung disease caused by inhaling very fine silicate or quartz dust.', 'His argument was dismissed as mere floccinaucinihilipilification by the academic panel.'],
      wizard: ['The sesquipedalian professor\'s loquacious discourse on xenotransplantation left the audience both enlightened and exhausted.', 'Quizzaciously, she solved the cryptic crossword while juggling three other mental puzzles.', 'The syzygy of celestial bodies created a spectacular astronomical event visible across the hemisphere.']
    },
    paragraphs: {
      rookie: [
        'My dog is brown. His name is Spot. He likes to run. We play ball.',
        'I see the sun. It is yellow. The sky is blue. I like the day.'
      ],
      racer: [
        'The library was quiet except for the occasional turning of pages. Sarah found herself lost in a world of ancient civilizations, marveling at how people lived thousands of years ago. History wasn\'t just dates and facts—it was stories of real people.',
        'Rain tapped gently against the window as Emma stirred her hot chocolate. The steam rose in swirls, carrying the rich aroma of chocolate and cinnamon. It was the perfect afternoon for reading her new mystery novel.'
      ],
      master: [
        'As the spacecraft entered the planet\'s atmosphere, the crew observed the strange phosphorescent vegetation below. The alien flora pulsed with bioluminescent patterns that seemed almost communicative in nature. Dr. Chen adjusted the spectral analyzer, hoping to decode what might be a complex biological signaling system.',
        'The discovery of the ancient manuscript in the monastery\'s archives sent shockwaves through the academic community. Its cryptic illustrations and undeciphered script suggested a previously unknown branch of medieval alchemy. Professor Whitaker\'s hands trembled as she carefully turned the fragile vellum pages.'
      ],
      prodigy: [
        'The quantum entanglement experiment yielded results that defied classical explanation. When particles separated by kilometers instantaneously mirrored each other\'s states, it challenged our fundamental understanding of locality and causality. Dr. Kapoor\'s team spent months verifying their methodology before daring to publish their controversial findings that might rewrite physics textbooks.',
        'Linguistic analysis of the newly discovered Indus Valley script revealed surprising syntactic similarities to proto-Dravidian languages, while the logographic elements showed influences from Mesopotamian cuneiform. This unexpected fusion suggested a previously unknown cultural exchange network spanning thousands of miles in the Bronze Age, forcing historians to reconsider trade routes and migration patterns.'
      ],
      wizard: []
    },
    stories: {
      rookie: [
        {
          title: 'The Lost Puppy',
          content: 'Sam saw a puppy. It looked sad. "Are you lost?" asked Sam. The puppy wagged its tail. Sam took it home. Mom said, "Let\'s find its owner." They made posters. Soon, the owner came. Sam was happy.',
          questions: ['How did the puppy look at first?', 'What did Sam and Mom make?']
        }
      ],
      racer: [
        {
          title: 'The Secret Cave',
          content: 'While hiking, Mia noticed an unusual rock formation. Behind it was a narrow opening. Curious, she squeezed through and found a cave with sparkling walls. As her eyes adjusted, she realized the sparkles came from thousands of tiny crystals embedded in the stone. She carefully marked the location to share with her science teacher.',
          questions: ['Where did Mia find the cave?', 'What made the cave walls sparkle?']
        }
      ],
      master: [
        {
          title: 'The Clockmaker\'s Legacy',
          content: 'When elderly Mr. Thornton passed away, he left his antique shop to his granddaughter, Claire. Among the dusty clocks, she found an unusual timepiece with strange symbols. As she wound it, the shop vanished around her, and she stood in a 19th-century street. The pocket watch wasn\'t just a clock—it was a time machine, and her grandfather had been its guardian.',
          questions: ['What did Claire inherit from her grandfather?', 'What was special about the unusual timepiece?']
        }
      ],
      prodigy: [],
      wizard: []
    },
    comprehension: {
      rookie: [
        {
          passage: 'Frogs live near water. They can jump high. Frogs eat bugs. They say "ribbit". Some frogs are green.',
          questions: [
            { question: 'Where do frogs live?', options: ['In trees', 'Near water', 'In deserts', 'Underground'], answer: 1 },
            { question: 'What do frogs eat?', options: ['Leaves', 'Bugs', 'Fish', 'Fruit'], answer: 1 }
          ]
        }
      ],
      racer: [
        {
          passage: 'The invention of the printing press in 1440 by Johannes Gutenberg revolutionized information sharing. Before this, books were handwritten and very expensive. The printing press made books more affordable and allowed ideas to spread quickly across Europe, contributing to the Renaissance and scientific revolution.',
          questions: [
            { question: 'Who invented the printing press?', options: ['Leonardo da Vinci', 'Johannes Gutenberg', 'Isaac Newton', 'Galileo Galilei'], answer: 1 },
            { question: 'What was one effect of the printing press?', options: ['Books became more expensive', 'Ideas spread more slowly', 'Books became more affordable', 'People stopped writing by hand'], answer: 2 }
          ]
        }
      ],
      master: [],
      prodigy: [],
      wizard: []
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setSpokenWords([]);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const spokenWordsArray = transcript.toLowerCase().split(/\s+/);
        setSpokenWords(spokenWordsArray);
        checkAnswer(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        setFeedback(`Error: ${event.error}`);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentChallenge]);

  const HighlightedText = ({ text, spokenWords }) => {
    if (!text) return null;

    const words = text.split(/\s+/);
    
    return (
      <div className="text-2xl md:text-3xl font-medium text-gray-800 mb-6 leading-relaxed">
        {words.map((word, index) => {
          const normalizedWord = word.toLowerCase().replace(/[.,!?]/g, '');
          const isSpoken = spokenWords.includes(normalizedWord);
          
          return (
            <span 
              key={index} 
              className={`transition-colors duration-300 ${isSpoken ? 'bg-yellow-200 text-gray-900' : ''}`}
            >
              {word}{' '}
            </span>
          );
        })}
      </div>
    );
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView('difficulty');
  };

  const selectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    startChallenge();
  };

  const startChallenge = () => {
    setSpokenWords([]);
    setCurrentView('challenge');
    
    if (!gameContent[selectedCategory] || !gameContent[selectedCategory][selectedDifficulty]) {
      setFeedback(`No challenges available for ${selectedCategory} - ${selectedDifficulty}. Please try another combination.`);
      setCurrentView('difficulty');
      return;
    }

    const challenges = gameContent[selectedCategory][selectedDifficulty];
    
    if (!challenges || challenges.length === 0) {
      setFeedback(`No challenges available for ${selectedCategory} - ${selectedDifficulty}. Please try another combination.`);
      setCurrentView('difficulty');
      return;
    }

    const randomIndex = Math.floor(Math.random() * challenges.length);
    
    if (selectedCategory === 'stories' || selectedCategory === 'comprehension') {
      setCurrentChallenge(challenges[randomIndex]);
    } else {
      setCurrentChallenge({
        text: challenges[randomIndex],
        questions: []
      });
    }
  };

  const checkAnswer = (userAnswer) => {
    if (!currentChallenge || !currentChallenge.text) {
      setFeedback('Challenge not properly loaded. Please try again.');
      return;
    }

    let isCorrect = false;
    
    if (selectedCategory === 'comprehension') {
      return;
    }
    
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentChallenge.text.trim().toLowerCase();
    
    if (!normalizedUserAnswer || !normalizedCorrectAnswer) {
      setFeedback('Please try reading again.');
      return;
    }

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      isCorrect = true;
    } else {
      const similarity = calculateSimilarity(normalizedUserAnswer, normalizedCorrectAnswer);
      isCorrect = similarity > 0.85;
    }
    
    if (isCorrect) {
      const newProgress = {...userProgress};
      newProgress[selectedCategory][selectedDifficulty] += 1;
      setUserProgress(newProgress);
      
      const starAward = {
        rookie: 1,
        racer: 2,
        master: 3,
        prodigy: 4,
        wizard: 5
      }[selectedDifficulty];
      
      setStars(prev => prev + starAward);
      setFeedback('Correct! Great job! 🎉');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setFeedback('Almost! Try again. The correct answer was: ' + currentChallenge.text);
    }
  };

  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length <= str2.length ? str1 : str2;
    const longerLength = longer.length;
    
    if (longerLength === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longerLength - distance) / parseFloat(longerLength);
  };

  const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
      arr[i] = [i];
      for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
          i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              );
      }
    }
    return arr[t.length][s.length];
  };

  const checkComprehensionAnswer = (questionIndex, selectedOption) => {
    const correctAnswer = currentChallenge.questions[questionIndex].answer;
    if (selectedOption === correctAnswer) {
      setFeedback('Correct! Well done!');
      const newProgress = {...userProgress};
      newProgress[selectedCategory][selectedDifficulty] += 1;
      setUserProgress(newProgress);
      setStars(prev => prev + 3);
    } else {
      setFeedback('Not quite right. Try another question!');
    }
  };

  const renderHome = () => (
    <div className="text-center animate-fade-in">
      <h1 className="text-5xl font-bold text-purple-600 mb-6">Reading Rock Star</h1>
      <p className="text-xl text-gray-700 mb-10">Become a reading superstar by mastering words, sentences, and stories!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('categories')}>
          <FaBook className="text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Start Reading</h2>
          <p className="text-gray-600">Choose from different reading challenges</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('progress')}>
          <FaChartLine className="text-4xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">My Progress</h2>
          <p className="text-gray-600">Track your reading achievements</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setCurrentView('rewards')}>
          <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Rewards</h2>
          <p className="text-gray-600">See your earned stars and badges</p>
        </div>
      </div>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="text-yellow-700">
          <span className="font-bold">Tip:</span> Use voice input to read aloud and get feedback on your pronunciation!
        </p>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">Choose a Category</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard 
          title="Words" 
          description="Master individual words" 
          icon="📝"
          color="bg-blue-100"
          onClick={() => selectCategory('words')}
        />
        <CategoryCard 
          title="Sentences" 
          description="Read complete sentences" 
          icon="📜"
          color="bg-green-100"
          onClick={() => selectCategory('sentences')}
        />
        <CategoryCard 
          title="Paragraphs" 
          description="Tackle short paragraphs" 
          icon="📖"
          color="bg-purple-100"
          onClick={() => selectCategory('paragraphs')}
        />
        <CategoryCard 
          title="Stories" 
          description="Read and answer questions" 
          icon="📚"
          color="bg-yellow-100"
          onClick={() => selectCategory('stories')}
        />
        <CategoryCard 
          title="Comprehension" 
          description="Read and understand" 
          icon="🧠"
          color="bg-red-100"
          onClick={() => selectCategory('comprehension')}
        />
      </div>
      
      <button 
        onClick={() => setCurrentView('home')}
        className="mt-8 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        <FaHome /> Back to Home
      </button>
    </div>
  );

  const renderDifficulty = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">Select Difficulty</h2>
      <p className="text-center text-gray-600 mb-10">Choose how challenging you want your reading to be</p>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DifficultyLevel 
          title="Rookie" 
          description="Simple words and short sentences"
          icon="👶"
          color="bg-blue-200"
          onClick={() => selectDifficulty('rookie')}
        />
        <DifficultyLevel 
          title="Racer" 
          description="Common vocabulary, longer sentences"
          icon="🚀"
          color="bg-green-200"
          onClick={() => selectDifficulty('racer')}
        />
        <DifficultyLevel 
          title="Master" 
          description="Advanced vocabulary, complex sentences"
          icon="🎓"
          color="bg-purple-200"
          onClick={() => selectDifficulty('master')}
        />
        <DifficultyLevel 
          title="Prodigy" 
          description="Specialized vocabulary, technical content"
          icon="🌟"
          color="bg-yellow-200"
          onClick={() => selectDifficulty('prodigy')}
        />
        <DifficultyLevel 
          title="Wizard" 
          description="Expert level with rare and complex words"
          icon="🧙"
          color="bg-red-200"
          onClick={() => selectDifficulty('wizard')}
        />
      </div>
      
      <button 
        onClick={() => setCurrentView('categories')}
        className="mt-8 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        ← Back to Categories
      </button>
    </div>
  );

  const renderChallenge = () => {
    if (!currentChallenge) return null;
    
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}: {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
          </h2>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold">{stars}</span>
          </div>
        </div>
        
        {selectedCategory === 'stories' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{currentChallenge.title}</h3>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="whitespace-pre-line text-gray-800">{currentChallenge.content}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Questions:</h4>
              <ul className="space-y-3">
                {currentChallenge.questions.map((q, idx) => (
                  <li key={idx} className="bg-white p-3 rounded shadow">
                    <p className="font-medium">{q}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {selectedCategory === 'comprehension' && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="whitespace-pre-line text-gray-800">{currentChallenge.passage}</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Questions:</h4>
              {currentChallenge.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">{q.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => checkComprehensionAnswer(qIdx, optIdx)}
                        className="bg-white hover:bg-blue-100 text-left p-2 rounded border border-blue-200 transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(selectedCategory !== 'stories' && selectedCategory !== 'comprehension') && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <div className="text-center">
              {selectedCategory === 'words' ? (
                <p className="text-4xl md:text-5xl font-medium text-gray-800 mb-6">
                  {currentChallenge.text}
                </p>
              ) : (
                <HighlightedText 
                  text={currentChallenge.text} 
                  spokenWords={spokenWords} 
                />
              )}
              
              <button
                onClick={startListening}
                disabled={isListening}
                className={`flex items-center justify-center gap-2 mx-auto py-3 px-6 rounded-full text-white font-semibold ${isListening ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'} transition-colors`}
              >
                <FaMicrophone />
                {isListening ? 'Listening...' : 'Read Aloud'}
              </button>
              
              <p className="mt-3 text-sm text-gray-500">
                Read the text above aloud when prompted
              </p>
            </div>
          </div>
        )}
        
        {feedback && (
          <div className={`p-4 rounded-lg mb-6 ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback}
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={() => {
              setCurrentView('difficulty');
              setFeedback('');
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ← Change Difficulty
          </button>
          
          <button
            onClick={() => {
              startChallenge();
              setFeedback('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Next Challenge →
          </button>
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">My Reading Progress</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaStar className="text-yellow-500" /> Stars Earned: {stars}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(userProgress).map(([category, levels]) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3 capitalize">{category}</h4>
              <div className="space-y-2">
                {Object.entries(levels).map(([level, count]) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="capitalize">{level}</span>
                    <span className="font-medium">{count} completed</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => setCurrentView('home')}
        className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        <FaHome /> Back to Home
      </button>
    </div>
  );

  const renderRewards = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">Your Rewards</h2>
      
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
          <FaStar className="text-yellow-500 text-2xl" /> 
          <span>Total Stars: {stars}</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(Math.min(stars, 15))].map((_, i) => (
            <div key={i} className="flex justify-center">
              <FaStar className="text-yellow-500 text-4xl" />
            </div>
          ))}
        </div>
        
        {stars >= 5 && (
          <div className="mt-8 bg-white p-4 rounded-lg shadow-inner border-2 border-yellow-300">
            <h4 className="font-bold text-lg text-center mb-2">🏆 Bronze Reader</h4>
            <p className="text-center text-gray-700">Earned for collecting 5 stars</p>
          </div>
        )}
        
        {stars >= 15 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-inner border-2 border-gray-300">
            <h4 className="font-bold text-lg text-center mb-2">🏆 Silver Reader</h4>
            <p className="text-center text-gray-700">Earned for collecting 15 stars</p>
          </div>
        )}
        
        {stars >= 30 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-inner border-2 border-yellow-500">
            <h4 className="font-bold text-lg text-center mb-2">🏆 Gold Reader</h4>
            <p className="text-center text-gray-700">Earned for collecting 30 stars</p>
          </div>
        )}
      </div>
      
      <button 
        onClick={() => setCurrentView('home')}
        className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        <FaHome /> Back to Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {currentView === 'home' && renderHome()}
        {currentView === 'categories' && renderCategories()}
        {currentView === 'difficulty' && renderDifficulty()}
        {currentView === 'challenge' && renderChallenge()}
        {currentView === 'progress' && renderProgress()}
        {currentView === 'rewards' && renderRewards()}
      </div>
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex justify-center items-center z-50">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 2}s`,
                color: ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)]
              }}
            >
              <FaStar />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryCard = ({ title, description, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`${color} p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center`}
  >
    <span className="text-4xl mb-3">{icon}</span>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const DifficultyLevel = ({ title, description, icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`${color} p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer text-center`}
  >
    <span className="text-3xl block mb-2">{icon}</span>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

export default ReadingRockStar;