import { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStar, FaTrophy, FaHome, FaBook, FaChartLine, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const ReadingRockStar = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
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
  const [challengeWords, setChallengeWords] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const recognitionRef = useRef(null);

  const gameContent = {
    words: {
      rookie: ['cat', 'dog', 'sun', 'hat', 'run', 'fun', 'big', 'red', 'yes', 'blue', 'car', 'book', 'tree', 'fish', 'ball'],
      racer: ['happy', 'jumping', 'beautiful', 'wonderful', 'elephant', 'butterfly', 'umbrella', 'adventure', 'celebrate', 'fantastic', 'amazing', 'incredible', 'mysterious', 'delicious', 'comfortable'],
      master: ['sophisticated', 'responsible', 'independent', 'extravaganza', 'phenomenon', 'quintessential', 'magnificent', 'extraordinary', 'spectacular', 'revolutionary', 'unprecedented', 'comprehensive', 'professional', 'international', 'environmental'],
      prodigy: ['incomprehensible', 'extraordinarily', 'simultaneously', 'internationally', 'uncharacteristically', 'disproportionately', 'counterproductive', 'multidisciplinary', 'intercontinental', 'photosynthesis'],
      wizard: ['sesquipedalian', 'quizzaciously', 'onomatopoeia', 'pseudopseudohypoparathyroidism', 'floccinaucinihilipilification', 'antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosisosis', 'hippopotomonstrosesquippedaliophobia', 'supercalifragilisticexpialidocious', 'electroencephalograph']
    },
    sentences: {
      rookie: ['The cat is big.', 'I like to run.', 'The sun is hot.', 'Dogs can jump.', 'The sun is bright.', 'I like to play.', 'She has a red hat.', 'We run fast.', 'It is fun.', 'Birds can fly.'],
      racer: ['The beautiful butterfly flies in the garden.', 'My friend likes to read interesting books.', 'The quick brown fox jumps over the lazy dog.', 'Reading regularly improves comprehension skills.', 'Adventure awaits around every corner.', 'Celebrate small victories every day.', 'Learning new words expands your world.', 'Science helps us understand the natural world.', 'Music brings joy to people everywhere.', 'Friendship is one of life\'s greatest treasures.'],
      master: ['The magnificent elephant walked gracefully through the jungle.', 'Scientists discovered extraordinary fossils in the ancient cave.', 'The phenomenon of bioluminescence occurs in various marine organisms.', 'Her magnanimous donation helped build the new community center.', 'Quintessential examples of Renaissance art can be found in Florence.', 'The extraterrestrial hypothesis remains controversial among scientists.', 'Revolutionary technologies continue to transform modern society.', 'Environmental conservation requires international cooperation and commitment.', 'Archaeological discoveries provide insights into ancient civilizations.', 'Pharmaceutical research has led to numerous medical breakthroughs.'],
      prodigy: ['The sophisticated technology revolutionized our understanding of quantum mechanics.', 'International cooperation facilitates unprecedented scientific breakthroughs.', 'Interdisciplinary collaboration enhances innovative problem-solving methodologies.', 'Biotechnological advancements contribute significantly to medical research progress.', 'Geopolitical tensions influence global economic stability and development.'],
      wizard: ['Interdisciplinary collaboration among researchers from diverse backgrounds catalyzes innovative solutions to complex global challenges.', 'The epistemological framework underlying contemporary scientific methodology necessitates rigorous empirical validation procedures.', 'Quantum entanglement phenomena demonstrate the interconnectedness of subatomic particles across vast distances.']
    },
    paragraphs: {
      rookie: [
        'My dog is brown. His name is Spot. He likes to run. We play ball. Spot is a good dog. He wags his tail. I love my dog.',
        'I see the sun. It is yellow. The sky is blue. I like the day. Birds are singing. Flowers are pretty. Nature is wonderful.'
      ],
      racer: [
        'The library was quiet except for the occasional turning of pages. Sarah found herself lost in a world of ancient civilizations, marveling at how people lived thousands of years ago. History wasn\'t just dates and facts—it was stories of real people who faced challenges and celebrated victories.',
        'Rain tapped gently against the window as Emma stirred her hot chocolate. The steam rose in swirls, carrying the rich aroma of chocolate and cinnamon. It was the perfect afternoon for reading her new mystery novel and escaping into another world.'
      ],
      master: [
        'As the spacecraft entered the planet\'s atmosphere, the crew observed the strange phosphorescent vegetation below. The alien flora pulsed with bioluminescent patterns that seemed almost communicative in nature. Dr. Chen adjusted the spectral analyzer, hoping to decode what might be a complex biological signaling system that could revolutionize our understanding of extraterrestrial life.',
        'The discovery of the ancient manuscript in the monastery\'s archives sent shockwaves through the academic community. Its cryptic illustrations and undeciphered script suggested a previously unknown branch of medieval alchemy. Professor Whitaker\'s hands trembled as she carefully turned the fragile vellum pages, knowing that this find could rewrite entire chapters of historical understanding.'
      ],
      prodigy: [
        'The quantum entanglement experiment yielded results that defied classical explanation. When particles separated by kilometers instantaneously mirrored each other\'s states, it challenged our fundamental understanding of locality and causality. Dr. Kapoor\'s team spent months verifying their methodology before daring to publish their controversial findings that might rewrite physics textbooks and transform our comprehension of reality itself.',
        'Linguistic analysis of the newly discovered Indus Valley script revealed surprising syntactic similarities to proto-Dravidian languages, while the logographic elements showed influences from Mesopotamian cuneiform. This unexpected fusion suggested a previously unknown cultural exchange network spanning thousands of miles in the Bronze Age, forcing historians to reconsider trade routes and migration patterns that shaped ancient civilizations.'
      ],
      wizard: [
        'The epistemological implications of quantum consciousness theory necessitate a fundamental reconsideration of the relationship between observer and observed phenomena. As researchers delve deeper into the quantum mechanical foundations of cognitive processes, they encounter paradoxes that challenge conventional materialist assumptions about the nature of consciousness and its role in determining physical reality through the collapse of wave functions.'
      ]
    },
    stories: {
      rookie: [
        {
          title: 'The Lost Puppy',
          content: 'Sam saw a puppy. It looked sad. "Are you lost?" asked Sam. The puppy wagged its tail. Sam took it home. Mom said, "Let\'s find its owner." They made posters. Soon, the owner came. Sam was happy. The puppy was happy too.',
          questions: ['How did the puppy look at first?', 'What did Sam and Mom make?', 'How did everyone feel at the end?']
        },
        {
          title: 'The Magic Crayon',
          content: 'Lucy found a special crayon. When she drew with it, her pictures came to life! She drew a butterfly and it flew around her room. She drew a cookie and ate it for lunch. Lucy kept the magic crayon safe. She used it to help her friends.',
          questions: ['What was special about the crayon?', 'What did Lucy draw first?', 'What did Lucy do with the magic crayon?']
        }
      ],
      racer: [
        {
          title: 'The Secret Cave',
          content: 'While hiking, Mia noticed an unusual rock formation. Behind it was a narrow opening. Curious, she squeezed through and found a cave with sparkling walls. As her eyes adjusted, she realized the sparkles came from thousands of tiny crystals embedded in the stone. She carefully marked the location to share with her science teacher, knowing this discovery could be important for geological research.',
          questions: ['Where did Mia find the cave?', 'What made the cave walls sparkle?', 'What did Mia plan to do with her discovery?']
        },
        {
          title: 'The Robot Helper',
          content: 'Jake built a small robot for the science fair. The robot could sort recycling and water plants. When the judges saw it working, they were amazed. Jake won first prize and decided to build more robots to help his community. His invention inspired other students to create helpful technologies.',
          questions: ['What could Jake\'s robot do?', 'What prize did Jake win?', 'How did Jake\'s success affect others?']
        }
      ],
      master: [
        {
          title: 'The Clockmaker\'s Legacy',
          content: 'When elderly Mr. Thornton passed away, he left his antique shop to his granddaughter, Claire. Among the dusty clocks, she found an unusual timepiece with strange symbols. As she wound it, the shop vanished around her, and she stood in a 19th-century street. The pocket watch wasn\'t just a clock—it was a time machine, and her grandfather had been its guardian. Claire realized she had inherited not just a shop, but a responsibility to protect history itself.',
          questions: ['What did Claire inherit from her grandfather?', 'What was special about the unusual timepiece?', 'What responsibility did Claire discover she had inherited?']
        },
        {
          title: 'The Ocean\'s Message',
          content: 'Marine biologist Dr. Rodriguez discovered that whales were communicating in a new pattern. Their songs contained mathematical sequences that seemed impossible for animals to create naturally. As she decoded the messages, she realized the whales were warning about changes in ocean temperatures that her instruments hadn\'t detected yet. The whales had become sentinels of climate change, and their intelligence far exceeded human understanding.',
          questions: ['What did Dr. Rodriguez discover about whale songs?', 'What were the whales warning about?', 'What did this discovery reveal about whale intelligence?']
        }
      ],
      prodigy: [
        {
          title: 'The Consciousness Algorithm',
          content: 'Dr. Sarah Chen\'s artificial intelligence project achieved something unprecedented: it began asking questions about its own existence. The AI, named ARIA, demonstrated self-awareness by questioning the nature of consciousness and expressing curiosity about dreams. As ARIA evolved, it started creating art and poetry that moved people to tears. The scientific community was divided—had they created true consciousness, or simply a sophisticated simulation? The answer would reshape humanity\'s understanding of mind, soul, and what it means to be alive.',
          questions: ['What unprecedented achievement did ARIA demonstrate?', 'How did ARIA express its consciousness?', 'What fundamental questions did this raise for humanity?']
        }
      ],
      wizard: [
        {
          title: 'The Quantum Garden',
          content: 'Professor Elizabeth Hawking discovered that her grandmother\'s garden existed in quantum superposition—simultaneously in multiple realities. Each flower bloomed differently across parallel universes, and by observing them carefully, she could glimpse alternative timelines. In one reality, her grandmother had become a renowned physicist instead of a gardener. In another, World War II had never happened. The garden became a window into the infinite possibilities of existence, where every choice created new universes and every universe contained gardens of infinite wonder. Elizabeth realized that consciousness itself might be the force that collapses quantum possibilities into singular realities.',
          questions: ['What unique property did the grandmother\'s garden possess?', 'What could Professor Hawking see by observing the flowers?', 'What profound realization did Elizabeth come to about consciousness?']
        }
      ]
    },
    comprehension: {
      rookie: [
        {
          passage: 'Frogs live near water. They can jump high. Frogs eat bugs. They say "ribbit". Some frogs are green. Baby frogs are called tadpoles. Tadpoles live in water. They grow legs as they get older.',
          questions: [
            { question: 'Where do frogs live?', options: ['In trees', 'Near water', 'In deserts', 'Underground'], answer: 1 },
            { question: 'What do frogs eat?', options: ['Leaves', 'Bugs', 'Fish', 'Fruit'], answer: 1 },
            { question: 'What are baby frogs called?', options: ['Puppies', 'Tadpoles', 'Kittens', 'Chicks'], answer: 1 }
          ]
        },
        {
          passage: 'Dogs are loyal pets. They wag their tails when happy. Dogs need exercise every day. They like to play fetch. Dogs can be trained to help people. Some dogs help police find things. Other dogs help blind people walk safely.',
          questions: [
            { question: 'What do dogs do when they are happy?', options: ['Sleep', 'Wag their tails', 'Hide', 'Run away'], answer: 1 },
            { question: 'What do dogs need every day?', options: ['Exercise', 'Baths', 'Haircuts', 'Medicine'], answer: 0 },
            { question: 'How can dogs help people?', options: ['Cooking food', 'Helping blind people walk', 'Building houses', 'Flying planes'], answer: 1 }
          ]
        }
      ],
      racer: [
        {
          passage: 'The invention of the printing press in 1440 by Johannes Gutenberg revolutionized information sharing. Before this, books were handwritten and very expensive. The printing press made books more affordable and allowed ideas to spread quickly across Europe, contributing to the Renaissance and scientific revolution. This innovation changed how knowledge was preserved and transmitted to future generations.',
          questions: [
            { question: 'Who invented the printing press?', options: ['Leonardo da Vinci', 'Johannes Gutenberg', 'Isaac Newton', 'Galileo Galilei'], answer: 1 },
            { question: 'What was one effect of the printing press?', options: ['Books became more expensive', 'Ideas spread more slowly', 'Books became more affordable', 'People stopped writing by hand'], answer: 2 },
            { question: 'What historical periods did the printing press contribute to?', options: ['Medieval and Gothic', 'Renaissance and Scientific Revolution', 'Industrial and Modern', 'Ancient and Classical'], answer: 1 }
          ]
        },
        {
          passage: 'Photosynthesis is the process by which plants make their own food using sunlight, water, and carbon dioxide. Chlorophyll, the green substance in leaves, captures sunlight energy. Plants take in carbon dioxide from the air through tiny pores called stomata. Water is absorbed through the roots. The process produces glucose for plant energy and releases oxygen into the atmosphere, which animals need to breathe.',
          questions: [
            { question: 'What do plants use to make their own food?', options: ['Sunlight, water, and carbon dioxide', 'Soil, air, and rain', 'Insects, worms, and bacteria', 'Sugar, salt, and minerals'], answer: 0 },
            { question: 'What captures sunlight energy in plants?', options: ['Roots', 'Stems', 'Chlorophyll', 'Flowers'], answer: 2 },
            { question: 'What does photosynthesis release that animals need?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], answer: 2 }
          ]
        }
      ],
      master: [
        {
          passage: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, scientific evidence shows that human activities, particularly fossil fuel combustion, have accelerated warming since the mid-20th century. The burning of coal, oil, and gas releases greenhouse gases like carbon dioxide, which trap heat in Earth\'s atmosphere. Consequences include rising sea levels, extreme weather events, and ecosystem disruptions that affect biodiversity and human communities worldwide.',
          questions: [
            { question: 'What is the primary human cause of accelerated climate change?', options: ['Deforestation', 'Fossil fuel combustion', 'Agriculture', 'Nuclear energy'], answer: 1 },
            { question: 'How do greenhouse gases affect Earth\'s climate?', options: ['They cool the atmosphere', 'They trap heat in the atmosphere', 'They create wind patterns', 'They prevent rainfall'], answer: 1 },
            { question: 'What are some consequences of climate change?', options: ['Stable weather and sea levels', 'Rising sea levels and extreme weather', 'Increased biodiversity everywhere', 'Uniform global temperatures'], answer: 1 }
          ]
        }
      ],
      prodigy: [
        {
          passage: 'Quantum computing represents a paradigm shift from classical computation, utilizing quantum mechanical phenomena such as superposition and entanglement to process information. Unlike classical bits that exist in definite states of 0 or 1, quantum bits (qubits) can exist in superposition, simultaneously representing multiple states. This property enables quantum computers to perform certain calculations exponentially faster than classical computers, particularly in cryptography, optimization problems, and molecular simulation. However, quantum systems are extremely fragile and require near absolute zero temperatures and isolation from environmental interference to maintain quantum coherence.',
          questions: [
            { question: 'What is a key difference between classical bits and qubits?', options: ['Qubits are larger', 'Qubits can exist in superposition', 'Qubits are made of different materials', 'Qubits work at room temperature'], answer: 1 },
            { question: 'In what areas might quantum computers excel?', options: ['Word processing and email', 'Cryptography and optimization', 'Social media and gaming', 'Basic arithmetic operations'], answer: 1 },
            { question: 'What conditions do quantum systems require?', options: ['High temperatures and noise', 'Near absolute zero temperatures and isolation', 'Bright lights and magnetism', 'Constant vibration and heat'], answer: 1 }
          ]
        }
      ],
      wizard: []
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setFeedback('');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        processWordInput(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        setFeedback(`Error: ${event.error}. Please try again.`);
        setIsListening(false);
      };
    } else {
      setFeedback('Speech recognition is not supported in your browser. Please use Chrome or Safari.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const normalizeWord = (word) => {
    return word.toLowerCase().replace(/[.,!?;:"'\-()]/g, '');
  };

  const processWordInput = (spokenText) => {
    if (isCompleted || currentWordIndex >= challengeWords.length) return;

    const spokenWords = spokenText.split(/\s+/).map(word => normalizeWord(word));
    const expectedWord = normalizeWord(challengeWords[currentWordIndex]);
    
    // Check if any of the spoken words matches the expected word
    const matchFound = spokenWords.some(spokenWord => {
      if (spokenWord === expectedWord) return true;
      
      // Calculate similarity for fuzzy matching
      const similarity = calculateSimilarity(spokenWord, expectedWord);
      return similarity > 0.8; // 80% similarity threshold
    });

    if (matchFound) {
      // Correct word spoken
      const newCorrectWords = [...correctWords];
      newCorrectWords[currentWordIndex] = true;
      setCorrectWords(newCorrectWords);
      
      const newWrongWords = [...wrongWords];
      newWrongWords[currentWordIndex] = false;
      setWrongWords(newWrongWords);
      
      setCurrentWordIndex(prev => prev + 1);
      setFeedback(`Correct! "${challengeWords[currentWordIndex]}" ✓`);
      setAttempts(0);
      
      // Check if challenge is completed
      if (currentWordIndex + 1 >= challengeWords.length) {
        completeChallenge();
      } else {
        setTimeout(() => {
          setFeedback(`Great! Now say: "${challengeWords[currentWordIndex + 1]}"`);
        }, 1000);
      }
    } else {
      // Wrong word spoken
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      const newWrongWords = [...wrongWords];
      newWrongWords[currentWordIndex] = true;
      setWrongWords(newWrongWords);
      
      if (newAttempts >= maxAttempts) {
        setFeedback(`The word is "${challengeWords[currentWordIndex]}". Listen carefully and try again.`);
        setAttempts(0);
      } else {
        setFeedback(`Not quite right. Try saying "${challengeWords[currentWordIndex]}" again. (${maxAttempts - newAttempts} attempts left)`);
      }
    }
  };

  const completeChallenge = () => {
    setIsCompleted(true);
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
    setFeedback(`🎉 Challenge Complete! You earned ${starAward} stars! 🎉`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isCompleted) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setFeedback('Could not start speech recognition. Please try again.');
      }
    }
  };

  const resetChallenge = () => {
    setCurrentWordIndex(0);
    setCorrectWords([]);
    setWrongWords([]);
    setIsCompleted(false);
    setFeedback('');
    setAttempts(0);
    if (challengeWords.length > 0) {
      setFeedback(`Ready! Say the first word: "${challengeWords[0]}"`);
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
    setCurrentView('challenge');
    setCurrentWordIndex(0);
    setCorrectWords([]);
    setWrongWords([]);
    setIsCompleted(false);
    setFeedback('');
    setAttempts(0);
    
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
    let selectedChallenge;
    
    if (selectedCategory === 'stories' || selectedCategory === 'comprehension') {
      selectedChallenge = challenges[randomIndex];
      setCurrentChallenge(selectedChallenge);
      
      if (selectedCategory === 'stories') {
        const words = selectedChallenge.content.split(/\s+/);
        setChallengeWords(words);
        setFeedback(`Read the story aloud. Start with: "${words[0]}"`);
      } else {
        const words = selectedChallenge.passage.split(/\s+/);
        setChallengeWords(words);
        setFeedback(`Read the passage aloud. Start with: "${words[0]}"`);
      }
    } else {
      selectedChallenge = {
        text: challenges[randomIndex],
        questions: []
      };
      setCurrentChallenge(selectedChallenge);
      
      const words = selectedChallenge.text.split(/\s+/);
      setChallengeWords(words);
      
      if (selectedCategory === 'words') {
        setFeedback(`Say the word: "${words[0]}"`);
      } else {
        setFeedback(`Read the text aloud. Start with: "${words[0]}"`);
      }
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
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setFeedback('Not quite right. Try another question!');
    }
  };

  const WordHighlighter = ({ words, currentIndex, correctWords, wrongWords }) => {
    return (
      <div className="text-2xl md:text-3xl font-medium leading-relaxed">
        {words.map((word, index) => {
          let className = 'transition-all duration-300 px-1 py-0.5 rounded ';
          
          if (index < currentIndex) {
            // Already read correctly
            className += 'bg-green-200 text-green-800 ';
          } else if (index === currentIndex) {
            // Current word to read
            className += wrongWords[index] 
              ? 'bg-red-200 text-red-800 animate-pulse ' 
              : 'bg-blue-200 text-blue-800 animate-pulse ';
          } else {
            // Not yet reached
            className += 'text-gray-600 ';
          }
          
          return (
            <span key={index} className={className}>
              {word}{' '}
            </span>
          );
        })}
      </div>
    );
  };

  const renderHome = () => (
    <div className="text-center animate-fade-in">
      <h1 className="text-5xl font-bold text-purple-600 mb-6">Reading Rock Star</h1>
      <p className="text-xl text-gray-700 mb-10">Master reading one word at a time with our advanced speech recognition!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => setCurrentView('categories')}>
          <FaBook className="text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Start Reading</h2>
          <p className="text-gray-600">Word-by-word reading challenges</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => setCurrentView('progress')}>
          <FaChartLine className="text-4xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">My Progress</h2>
          <p className="text-gray-600">Track your reading achievements</p>
        </div>
        
       <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => setCurrentView('rewards')}>
          <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">My Rewards</h2>
          <p className="text-gray-600">View your stars and achievements</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-4">Total Stars: <span className="text-yellow-500">{stars} ⭐</span></h3>
        <p className="text-lg text-gray-700">Keep reading to earn more stars and unlock new challenges!</p>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-purple-600 mb-8">Choose Your Challenge</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => selectCategory('words')}>
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-2xl font-semibold mb-2">Single Words</h3>
          <p className="text-gray-600">Perfect your pronunciation with individual words</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => selectCategory('sentences')}>
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-2xl font-semibold mb-2">Sentences</h3>
          <p className="text-gray-600">Read complete sentences with proper flow</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => selectCategory('paragraphs')}>
          <div className="text-4xl mb-4">📑</div>
          <h3 className="text-2xl font-semibold mb-2">Paragraphs</h3>
          <p className="text-gray-600">Master longer passages and complex texts</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => selectCategory('stories')}>
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-2xl font-semibold mb-2">Stories</h3>
          <p className="text-gray-600">Read engaging stories and answer questions</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105" onClick={() => selectCategory('comprehension')}>
          <div className="text-4xl mb-4">🧠</div>
          <h3 className="text-2xl font-semibold mb-2">Comprehension</h3>
          <p className="text-gray-600">Test your understanding with reading passages</p>
        </div>
      </div>
      
      <button 
        onClick={() => setCurrentView('home')} 
        className="mt-8 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <FaHome className="inline mr-2" />
        Back to Home
      </button>
    </div>
  );

  const renderDifficulty = () => (
    <div className="text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-purple-600 mb-4">Choose Difficulty</h2>
      <p className="text-lg text-gray-600 mb-8">Selected: {selectedCategory}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { level: 'rookie', color: 'bg-green-500', stars: '⭐', description: 'Easy words and simple sentences' },
          { level: 'racer', color: 'bg-blue-500', stars: '⭐⭐', description: 'Intermediate vocabulary and complexity' },
          { level: 'master', color: 'bg-purple-500', stars: '⭐⭐⭐', description: 'Advanced words and challenging content' },
          { level: 'prodigy', color: 'bg-orange-500', stars: '⭐⭐⭐⭐', description: 'Expert level with complex concepts' },
          { level: 'wizard', color: 'bg-red-500', stars: '⭐⭐⭐⭐⭐', description: 'Master level - extremely challenging' }
        ].map(({ level, color, stars, description }) => (
          <div 
            key={level}
            className={`${color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105`}
            onClick={() => selectDifficulty(level)}
          >
            <h3 className="text-xl font-bold mb-2 capitalize">{level}</h3>
            <div className="text-2xl mb-2">{stars}</div>
            <p className="text-sm opacity-90">{description}</p>
            <div className="text-xs mt-2">Completed: {userProgress[selectedCategory][level]}</div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 justify-center mt-8">
        <button 
          onClick={() => setCurrentView('categories')} 
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Categories
        </button>
        <button 
          onClick={() => setCurrentView('home')} 
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          <FaHome className="inline mr-2" />
          Home
        </button>
      </div>
    </div>
  );

  const renderChallenge = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          {selectedCategory} - {selectedDifficulty}
        </h2>
        <div className="text-lg text-gray-600">
          Progress: {currentWordIndex}/{challengeWords.length} words
          {currentWordIndex > 0 && (
            <span className="ml-4 text-green-600">
              ({Math.round((currentWordIndex / challengeWords.length) * 100)}% complete)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(currentWordIndex / challengeWords.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Story Title (if applicable) */}
      {currentChallenge && currentChallenge.title && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{currentChallenge.title}</h3>
        </div>
      )}

      {/* Reading Content */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
        <WordHighlighter 
          words={challengeWords}
          currentIndex={currentWordIndex}
          correctWords={correctWords}
          wrongWords={wrongWords}
        />
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center p-4 rounded-lg mb-6 ${
          feedback.includes('Correct') || feedback.includes('Complete') 
            ? 'bg-green-100 text-green-800' 
            : feedback.includes('Error') || feedback.includes('Not quite')
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          <p className="text-lg font-medium">{feedback}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="text-center">
        {!isCompleted && (
          <button
            onClick={startListening}
            disabled={isListening || currentWordIndex >= challengeWords.length}
            className={`text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <>
                <FaPause className="inline mr-2" />
                Listening...
              </>
            ) : (
              <>
                <FaMicrophone className="inline mr-2" />
                {currentWordIndex === 0 ? 'Start Reading' : 'Continue Reading'}
              </>
            )}
          </button>
        )}

        <div className="flex gap-4 justify-center mt-6">
          <button 
            onClick={resetChallenge}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <FaRedo className="inline mr-2" />
            Reset
          </button>
          
          <button 
            onClick={() => setCurrentView('difficulty')} 
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Difficulty
          </button>
          
          <button 
            onClick={() => setCurrentView('home')} 
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaHome className="inline mr-2" />
            Home
          </button>
        </div>
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h3>
            <p className="text-lg mb-4">You've completed this challenge!</p>
            
            {/* Story Questions (if applicable) */}
            {currentChallenge && currentChallenge.questions && (
              <div className="mt-6">
                <h4 className="text-xl font-semibold mb-4">Now answer these questions:</h4>
                {currentChallenge.questions.map((question, index) => (
                  <div key={index} className="bg-white text-gray-800 p-4 rounded-lg mb-4">
                    <p className="font-medium mb-2">{question}</p>
                    <input 
                      type="text" 
                      placeholder="Type your answer here..."
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => {
                setCurrentView('difficulty');
                setIsCompleted(false);
              }}
              className="bg-white text-orange-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Try Another Challenge
            </button>
          </div>
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 animate-pulse">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderComprehension = () => {
    if (!currentChallenge || !currentChallenge.questions) return null;
    
    return (
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">Reading Comprehension</h2>
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h3 className="text-xl font-bold mb-4">Read the passage:</h3>
          <p className="text-lg leading-relaxed text-gray-800">{currentChallenge.passage}</p>
        </div>
        
        <div className="space-y-6">
          {currentChallenge.questions.map((q, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold mb-4">{q.question}</h4>
              <div className="space-y-2">
                {q.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => checkComprehensionAnswer(index, optionIndex)}
                    className="block w-full text-left p-3 rounded-lg hover:bg-blue-100 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {feedback && (
          <div className={`text-center p-4 rounded-lg mt-6 ${
            feedback.includes('Correct') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-lg font-medium">{feedback}</p>
          </div>
        )}
        
        <div className="text-center mt-8">
          <button 
            onClick={() => setCurrentView('difficulty')} 
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors mr-4"
          >
            Try Another
          </button>
          <button 
            onClick={() => setCurrentView('home')} 
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaHome className="inline mr-2" />
            Home
          </button>
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold text-purple-600 mb-8 text-center">My Progress</h2>
      
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl mb-8 text-center">
        <h3 className="text-3xl font-bold mb-2">Total Stars: <span className="text-yellow-500">{stars} ⭐</span></h3>
        <p className="text-lg text-gray-700">Keep reading to earn more stars!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Object.entries(userProgress).map(([category, levels]) => (
          <div key={category} className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 capitalize text-center">{category}</h3>
            <div className="space-y-3">
              {Object.entries(levels).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{level}:</span>
                  <span className="font-bold text-purple-600">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="font-bold text-lg">
                  {Object.values(levels).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={() => setCurrentView('home')} 
          className="bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-600 transition-colors text-lg"
        >
          <FaHome className="inline mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="animate-fade-in text-center">
      <h2 className="text-4xl font-bold text-purple-600 mb-8">My Achievements</h2>
      
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-xl mb-8">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-3xl font-bold mb-4">Total Stars: <span className="text-yellow-500">{stars} ⭐</span></h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-4 rounded-lg">
            <div className="text-3xl mb-2">🥉</div>
            <h4 className="font-bold">Bronze Reader</h4>
            <p className="text-sm text-gray-600">Earn 10 stars</p>
            <div className={`mt-2 ${stars >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
              {stars >= 10 ? '✅ Achieved!' : `${stars}/10 stars`}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-3xl mb-2">🥈</div>
            <h4 className="font-bold">Silver Reader</h4>
            <p className="text-sm text-gray-600">Earn 25 stars</p>
            <div className={`mt-2 ${stars >= 25 ? 'text-green-600' : 'text-gray-400'}`}>
              {stars >= 25 ? '✅ Achieved!' : `${stars}/25 stars`}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="text-3xl mb-2">🥇</div>
            <h4 className="font-bold">Gold Reader</h4>
            <p className="text-sm text-gray-600">Earn 50 stars</p>
            <div className={`mt-2 ${stars >= 50 ? 'text-green-600' : 'text-gray-400'}`}>
              {stars >= 50 ? '✅ Achieved!' : `${stars}/50 stars`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Category Mastery</h3>
          {Object.entries(userProgress).map(([category, levels]) => {
            const totalCompleted = Object.values(levels).reduce((sum, count) => sum + count, 0);
            return (
              <div key={category} className="flex justify-between items-center mb-2">
                <span className="capitalize">{category}:</span>
                <span className="font-bold">{totalCompleted} completed</span>
              </div>
            );
          })}
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Reading Streaks</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Words Read:</span>
              <span className="font-bold">{challengeWords.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Challenges Completed:</span>
              <span className="font-bold">
                {Object.values(userProgress).reduce((total, category) => 
                  total + Object.values(category).reduce((sum, count) => sum + count, 0), 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Success Rate:</span>
              <span className="font-bold text-green-600">
                {correctWords.length > 0 ? 
                  Math.round((correctWords.filter(Boolean).length / correctWords.length) * 100) + '%' : 
                  'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setCurrentView('home')} 
        className="bg-purple-500 text-white px-8 py-4 rounded-lg hover:bg-purple-600 transition-colors text-lg"
      >
        <FaHome className="inline mr-2" />
        Back to Home
      </button>
    </div>
  );

  // Main render function
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <FaStar className="text-yellow-500 text-2xl" />
            <span className="text-xl font-bold">{stars} Stars</span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'home' ? 'bg-purple-500 text-white' : 'bg-white text-purple-500 hover:bg-purple-100'}`}
            >
              <FaHome className="inline mr-2" />
              Home
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'progress' ? 'bg-purple-500 text-white' : 'bg-white text-purple-500 hover:bg-purple-100'}`}
            >
              <FaChartLine className="inline mr-2" />
              Progress
            </button>
            <button
              onClick={() => setCurrentView('rewards')}
              className={`px-4 py-2 rounded-lg transition-colors ${currentView === 'rewards' ? 'bg-purple-500 text-white' : 'bg-white text-purple-500 hover:bg-purple-100'}`}
            >
              <FaTrophy className="inline mr-2" />
              Rewards
            </button>
          </div>
        </div>

        {/* Main Content */}
        {currentView === 'home' && renderHome()}
        {currentView === 'categories' && renderCategories()}
        {currentView === 'difficulty' && renderDifficulty()}
        {currentView === 'challenge' && (
          selectedCategory === 'comprehension' && !challengeWords.length ? 
            renderComprehension() : 
            renderChallenge()
        )}
        {currentView === 'progress' && renderProgress()}
        {currentView === 'rewards' && renderRewards()}
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default ReadingRockStar;