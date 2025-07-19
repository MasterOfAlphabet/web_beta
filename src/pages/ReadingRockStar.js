import { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaStar,
  FaTrophy,
  FaHome,
  FaBook,
  FaChartLine,
} from "react-icons/fa";

// Helper: Normalize words for comparison
const normalizeWord = (word) =>
  word.replace(/[.,!?]/g, "").toLowerCase().trim();

const ReadingRockStar = () => {
  // State declarations (unchanged from original)
  const [currentView, setCurrentView] = useState("home");
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
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [spokenWords, setSpokenWords] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const recognitionRef = useRef(null);

  // Add to your state declarations
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatus, setWordStatus] = useState([]);
  const [micActive, setMicActive] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState([]); // NEW for sentence/paragraph highlighting
  const [lastTranscript, setLastTranscript] = useState(""); // for displaying last transcript

  // Game content (unchanged from original)
  const gameContent = {
    words: {
      rookie: ["cat", "dog", "sun", "hat", "run", "fun", "big", "red", "yes"],
      racer: [
        "happy",
        "jumping",
        "beautiful",
        "wonderful",
        "elephant",
        "butterfly",
        "umbrella",
        "adventure",
        "celebrate",
      ],
      master: [
        "sophisticated",
        "responsible",
        "independent",
        "extravaganza",
        "phenomenon",
        "quintessential",
        "magnificent",
        "extraordinary",
      ],
      prodigy: [
        "incomprehensible",
        "extraordinarily",
        "simultaneously",
        "internationally",
      ],
      wizard: ["sesquipedalian", "quizzaciously", "onomatopoeia"],
    },
    sentences: {
      rookie: [
        "The cat is big.",
        "I like to run.",
        "The sun is hot.",
        "Dogs can jump.",
        "The sun is bright.",
        "I like to play.",
        "She has a red hat.",
        "We run fast.",
        "It is fun.",
      ],
      racer: [
        "The beautiful butterfly flies in the garden.",
        "My friend likes to read interesting books.",
        "The quick brown fox jumps over the lazy dog.",
        "Reading regularly improves comprehension skills.",
        "Adventure awaits around every corner.",
        "Celebrate small victories every day.",
        "Learning new words expands your world.",
      ],
      master: [
        "The magnificent elephant walked gracefully through the jungle.",
        "Scientists discovered extraordinary fossils in the ancient cave.",
        "The phenomenon of bioluminescence occurs in various marine organisms.",
        "Her magnanimous donation helped build the new community center.",
        "Quintessential examples of Renaissance art can be found in Florence.",
        "The extraterrestrial hypothesis remains controversial among scientists.",
      ],
      prodigy: [
        "The sophisticated technology revolutionized our understanding of quantum mechanics.",
        "International cooperation facilitates unprecedented scientific breakthroughs.",
      ],
      wizard: [
        "Interdisciplinary collaboration among researchers from diverse backgrounds catalyzes innovative solutions to complex global challenges.",
      ],
    },
    paragraphs: {
      rookie: [
        "My dog is brown. His name is Spot. He likes to run. We play ball.",
        "I see the sun. It is yellow. The sky is blue. I like the day.",
      ],
      racer: [
        "The library was quiet except for the occasional turning of pages. Sarah found herself lost in a world of ancient civilizations, marveling at how people lived thousands of years ago. History wasn't just dates and facts—it was stories of real people.",
        "Rain tapped gently against the window as Emma stirred her hot chocolate. The steam rose in swirls, carrying the rich aroma of chocolate and cinnamon. It was the perfect afternoon for reading her new mystery novel.",
      ],
      master: [
        "As the spacecraft entered the planet's atmosphere, the crew observed the strange phosphorescent vegetation below. The alien flora pulsed with bioluminescent patterns that seemed almost communicative in nature. Dr. Chen adjusted the spectral analyzer, hoping to decode what might be a complex biological signaling system.",
        "The discovery of the ancient manuscript in the monastery's archives sent shockwaves through the academic community. Its cryptic illustrations and undeciphered script suggested a previously unknown branch of medieval alchemy. Professor Whitaker's hands trembled as she carefully turned the fragile vellum pages.",
      ],
      prodigy: [
        "The quantum entanglement experiment yielded results that defied classical explanation. When particles separated by kilometers instantaneously mirrored each other's states, it challenged our fundamental understanding of locality and causality. Dr. Kapoor's team spent months verifying their methodology before daring to publish their controversial findings that might rewrite physics textbooks.",
        "Linguistic analysis of the newly discovered Indus Valley script revealed surprising syntactic similarities to proto-Dravidian languages, while the logographic elements showed influences from Mesopotamian cuneiform. This unexpected fusion suggested a previously unknown cultural exchange network spanning thousands of miles in the Bronze Age, forcing historians to reconsider trade routes and migration patterns.",
      ],
      wizard: [],
    },
    stories: {
      rookie: [
        {
          title: "The Lost Puppy",
          content:
            'Sam saw a puppy. It looked sad. "Are you lost?" asked Sam. The puppy wagged its tail. Sam took it home. Mom said, "Let\'s find its owner." They made posters. Soon, the owner came. Sam was happy.',
          questions: [
            "How did the puppy look at first?",
            "What did Sam and Mom make?",
          ],
        },
      ],
      racer: [
        {
          title: "The Secret Cave",
          content:
            "While hiking, Mia noticed an unusual rock formation. Behind it was a narrow opening. Curious, she squeezed through and found a cave with sparkling walls. As her eyes adjusted, she realized the sparkles came from thousands of tiny crystals embedded in the stone. She carefully marked the location to share with her science teacher.",
          questions: [
            "Where did Mia find the cave?",
            "What made the cave walls sparkle?",
          ],
        },
      ],
      master: [
        {
          title: "The Clockmaker's Legacy",
          content:
            "When elderly Mr. Thornton passed away, he left his antique shop to his granddaughter, Claire. Among the dusty clocks, she found an unusual timepiece with strange symbols. As she wound it, the shop vanished around her, and she stood in a 19th-century street. The pocket watch wasn't just a clock—it was a time machine, and her grandfather had been its guardian.",
          questions: [
            "What did Claire inherit from her grandfather?",
            "What was special about the unusual timepiece?",
          ],
        },
      ],
      prodigy: [],
      wizard: [],
    },
    comprehension: {
      rookie: [
        {
          passage:
            'Frogs live near water. They can jump high. Frogs eat bugs. They say "ribbit". Some frogs are green.',
          questions: [
            {
              question: "Where do frogs live?",
              options: ["In trees", "Near water", "In deserts", "Underground"],
              answer: 1,
            },
            {
              question: "What do frogs eat?",
              options: ["Leaves", "Bugs", "Fish", "Fruit"],
              answer: 1,
            },
          ],
        },
      ],
      racer: [
        {
          passage:
            "The invention of the printing press in 1440 by Johannes Gutenberg revolutionized information sharing. Before this, books were handwritten and very expensive. The printing press made books more affordable and allowed ideas to spread quickly across Europe, contributing to the Renaissance and scientific revolution.",
          questions: [
            {
              question: "Who invented the printing press?",
              options: [
                "Leonardo da Vinci",
                "Johannes Gutenberg",
                "Isaac Newton",
                "Galileo Galilei",
              ],
              answer: 1,
            },
            {
              question: "What was one effect of the printing press?",
              options: [
                "Books became more expensive",
                "Ideas spread more slowly",
                "Books became more affordable",
                "People stopped writing by hand",
              ],
              answer: 2,
            },
          ],
        },
      ],
      master: [],
      prodigy: [],
      wizard: [],
    },
  };

  // --- Speech recognition for sentences/paragraphs highlighting ---
  useEffect(() => {
    if (
      selectedCategory === "sentences" ||
      selectedCategory === "paragraphs"
    ) {
      if ("webkitSpeechRecognition" in window) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false; // We want only final results
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setMicActive(true);
          setHighlightedWords(
            currentChallenge?.text
              ? currentChallenge.text
                  .split(/\s+/)
                  .map((w) => ({ word: w, status: "pending" }))
              : []
          );
          setLastTranscript("");
          setCurrentWordIndex(0);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setMicActive(false);
        };

        recognitionRef.current.onresult = (event) => {
          if (!currentChallenge?.text) return;

          const transcript = event.results[event.results.length - 1][0].transcript;
          setLastTranscript(transcript);

          const challengeWords = currentChallenge.text.split(/\s+/);
          const transcriptWords = transcript.split(/\s+/);

          let newHighlighted = [...highlightedWords];
          let currentIndex = currentWordIndex;

          // Compare each word one-by-one from currentIndex
          while (
            currentIndex < challengeWords.length &&
            transcriptWords.length > 0
          ) {
            const spokenWord = normalizeWord(transcriptWords[0]);
            const expectedWord = normalizeWord(challengeWords[currentIndex]);

            if (spokenWord === expectedWord) {
              newHighlighted[currentIndex] = {
                word: challengeWords[currentIndex],
                status: "correct",
              };
              transcriptWords.shift();
              currentIndex += 1;
            } else {
              // If mismatch, mark as incorrect and break (do not advance)
              newHighlighted[currentIndex] = {
                word: challengeWords[currentIndex],
                status: "incorrect",
              };
              break;
            }
          }
          setHighlightedWords(newHighlighted);
          setCurrentWordIndex(currentIndex);

          // If all words spoken correctly
          if (
            currentChallenge?.text &&
            newHighlighted.every((w) => w.status === "correct")
          ) {
            setFeedback("Perfect! All words pronounced correctly. 🎉");
            setCanProceed(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            setMicActive(false);

            setUserProgress((prev) => {
              const newProgress = { ...prev };
              newProgress[selectedCategory][selectedDifficulty] += 1;
              return newProgress;
            });

            setStars(
              (prev) =>
                prev +
                {
                  rookie: 1,
                  racer: 2,
                  master: 3,
                  prodigy: 4,
                  wizard: 5,
                }[selectedDifficulty]
            );
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          setFeedback(`Error: ${event.error}`);
          setIsListening(false);
          setMicActive(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentChallenge, selectedCategory]);

  useEffect(() => {
    if (
      currentChallenge?.text &&
      currentWordIndex === currentChallenge.text.split(/\s+/).length &&
      (selectedCategory === "sentences" || selectedCategory === "paragraphs")
    ) {
      setFeedback("Perfect! All words pronounced correctly. 🎉");
      setCanProceed(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setMicActive(false);

      setUserProgress((prev) => {
        const newProgress = { ...prev };
        newProgress[selectedCategory][selectedDifficulty] += 1;
        return newProgress;
      });

      setStars(
        (prev) =>
          prev +
          {
            rookie: 1,
            racer: 2,
            master: 3,
            prodigy: 4,
            wizard: 5,
          }[selectedDifficulty]
      );
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [
    currentWordIndex,
    currentChallenge,
    selectedCategory,
    selectedDifficulty,
  ]);

  // Speech recognition setup for "words" mode (unchanged)
  useEffect(() => {
    if (
      selectedCategory !== "sentences" &&
      selectedCategory !== "paragraphs"
    ) {
      if ("webkitSpeechRecognition" in window) {
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setSpokenWords([]);
          setCorrectWords([]);
          setIncorrectWords([]);
          setCanProceed(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onresult = (event) => {
          if (!currentChallenge?.text) return;

          const results = Array.from(event.results);
          const latestResult = results[results.length - 1];
          const transcript = latestResult[0].transcript.toLowerCase();

          // Split into words and clean them
          const spokenWords = transcript
            .split(/\s+/)
            .map((word) => word.replace(/[.,!?]/g, ""));

          // Get the expected word at current position
          const challengeWords = currentChallenge.text
            .toLowerCase()
            .split(/\s+/)
            .map((word) => word.replace(/[.,!?]/g, ""));

          // Only proceed if we have words to compare
          if (currentWordIndex < challengeWords.length) {
            const expectedWord = challengeWords[currentWordIndex];
            const matchedIndex = spokenWords.findIndex(
              (word) => word === expectedWord
            );

            if (matchedIndex !== -1) {
              // Mark current word as correct and move to next
              setWordStatus((prev) => {
                const newStatus = [...prev];
                newStatus[currentWordIndex] = "correct";
                return newStatus;
              });
              setCurrentWordIndex((prev) => prev + 1);

              // Clear the spoken words after processing
              recognitionRef.current.abort();
              setTimeout(() => {
                if (recognitionRef.current) {
                  recognitionRef.current.start();
                }
              }, 100);
            } else if (spokenWords.length > 0 && !latestResult.isFinal) {
              // Mark as incorrect if we have words but no match
              setWordStatus((prev) => {
                const newStatus = [...prev];
                newStatus[currentWordIndex] = "incorrect";
                return newStatus;
              });
            }
          }
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
    }
  }, [currentChallenge, selectedCategory]);

  // Highlighted text component for sentences/paragraphs
  const HighlightedTextWithMic = ({ text, highlightedWords }) => {
    if (!text)
      return (
        <div className="text-gray-500">
          No text available for this challenge
        </div>
      );

    const words = text.split(/\s+/);

    return (
      <div className="text-2xl md:text-3xl font-medium text-gray-800 mb-6 leading-relaxed flex flex-wrap gap-2">
        {words.map((word, index) => {
          const status =
            highlightedWords && highlightedWords[index]
              ? highlightedWords[index].status
              : null;
          let className = "px-2 py-1 rounded transition-all duration-200";

          if (status === "correct") {
            className += " bg-green-200 text-gray-900";
          } else if (status === "incorrect") {
            className += " bg-red-200 text-gray-900";
          } else if (index === highlightedWords?.findIndex(w => w.status === "pending")) {
            className += " border-b-4 border-blue-500";
          }

          return (
            <span key={index} className={className}>
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  // Highlighted text for original (words typing test, unchanged)
  const HighlightedText = ({ text }) => {
    if (!text)
      return (
        <div className="text-gray-500">
          No text available for this challenge
        </div>
      );

    const words = text.split(/\s+/);

    return (
      <div className="text-2xl md:text-3xl font-medium text-gray-800 mb-6 leading-relaxed">
        {words.map((word, index) => {
          let className = "";

          if (index < currentWordIndex) {
            className =
              wordStatus[index] === "correct"
                ? "bg-green-200 text-gray-900"
                : "bg-red-200 text-gray-900";
          } else if (index === currentWordIndex) {
            className = "border-b-4 border-blue-500";
          }

          return (
            <span
              key={index}
              className={`transition-colors duration-300 ${className}`}
            >
              {word}{" "}
            </span>
          );
        })}
      </div>
    );
  };

  // Navigation functions
  const startListening = () => {
    setMicActive(true);
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView("difficulty");
  };

  const selectDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    startChallenge();
  };

  const startChallenge = () => {
    // Reset states
    setSpokenWords([]);
    setCorrectWords([]);
    setIncorrectWords([]);
    setCanProceed(false);
    setFeedback("");
    setCurrentWordIndex(0);
    setCurrentView("challenge");
    setMicActive(false);

    // Validate game content exists
    if (
      !selectedCategory ||
      !selectedDifficulty ||
      !gameContent[selectedCategory] ||
      !gameContent[selectedCategory][selectedDifficulty]
    ) {
      setFeedback(
        `No challenges available for ${selectedCategory} - ${selectedDifficulty}. Please try another combination.`
      );
      setCurrentView("difficulty");
      return;
    }

    const challenges = gameContent[selectedCategory][selectedDifficulty];

    if (!challenges || challenges.length === 0) {
      setFeedback(
        `No challenges available for ${selectedCategory} - ${selectedDifficulty}. Please try another combination.`
      );
      setCurrentView("difficulty");
      return;
    }

    // Select random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    let challenge;

    if (
      selectedCategory === "stories" ||
      selectedCategory === "comprehension"
    ) {
      challenge = challenges[randomIndex];
    } else {
      challenge = {
        text: challenges[randomIndex],
        questions: [],
      };
    }

    // Initialize word status array
    const words = challenge.text ? challenge.text.split(/\s+/) : [];
    setWordStatus(Array(words.length).fill(null));
    setHighlightedWords(words.map((w) => ({ word: w, status: "pending" })));

    setCurrentChallenge(challenge);
  };

  // Comprehension answer checking
  const checkComprehensionAnswer = (questionIndex, selectedOption) => {
    const correctAnswer = currentChallenge.questions[questionIndex].answer;
    if (selectedOption === correctAnswer) {
      setFeedback("Correct! Well done!");
      const newProgress = { ...userProgress };
      newProgress[selectedCategory][selectedDifficulty] += 1;
      setUserProgress(newProgress);
      setStars((prev) => prev + 3);
      setCanProceed(true);
    } else {
      setFeedback("Not quite right. Try again!");
      setCanProceed(false);
    }
  };

  // View rendering functions
  const renderHome = () => (
    <div className="text-center animate-fade-in">
      <h1 className="text-5xl font-bold text-purple-600 mb-6">
        Reading Rock Star
      </h1>
      <p className="text-xl text-gray-700 mb-10">
        Become a reading superstar by mastering words, sentences, and stories!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setCurrentView("categories")}
        >
          <FaBook className="text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Start Reading</h2>
          <p className="text-gray-600">
            Choose from different reading challenges
          </p>
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setCurrentView("progress")}
        >
          <FaChartLine className="text-4xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">My Progress</h2>
          <p className="text-gray-600">Track your reading achievements</p>
        </div>

        <div
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => setCurrentView("rewards")}
        >
          <FaTrophy className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Rewards</h2>
          <p className="text-gray-600">See your earned stars and badges</p>
        </div>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="text-yellow-700">
          <span className="font-bold">Tip:</span> Use voice input to read aloud
          and get feedback on your pronunciation!
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
          onClick={() => selectCategory("words")}
        />
        <CategoryCard
          title="Sentences"
          description="Read complete sentences"
          icon="📜"
          color="bg-green-100"
          onClick={() => selectCategory("sentences")}
        />
        <CategoryCard
          title="Paragraphs"
          description="Tackle short paragraphs"
          icon="📖"
          color="bg-purple-100"
          onClick={() => selectCategory("paragraphs")}
        />
        <CategoryCard
          title="Stories"
          description="Read and answer questions"
          icon="📚"
          color="bg-yellow-100"
          onClick={() => selectCategory("stories")}
        />
        <CategoryCard
          title="Comprehension"
          description="Read and understand"
          icon="🧠"
          color="bg-red-100"
          onClick={() => selectCategory("comprehension")}
        />
      </div>

      <button
        onClick={() => setCurrentView("home")}
        className="mt-8 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        <FaHome /> Back to Home
      </button>
    </div>
  );

  const renderDifficulty = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">Select Difficulty</h2>
      <p className="text-center text-gray-600 mb-10">
        Choose how challenging you want your reading to be
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DifficultyLevel
          title="Rookie"
          description="Simple words and short sentences"
          icon="👶"
          color="bg-blue-200"
          onClick={() => selectDifficulty("rookie")}
        />
        <DifficultyLevel
          title="Racer"
          description="Common vocabulary, longer sentences"
          icon="🚀"
          color="bg-green-200"
          onClick={() => selectDifficulty("racer")}
        />
        <DifficultyLevel
          title="Master"
          description="Advanced vocabulary, complex sentences"
          icon="🎓"
          color="bg-purple-200"
          onClick={() => selectDifficulty("master")}
        />
        <DifficultyLevel
          title="Prodigy"
          description="Specialized vocabulary, technical content"
          icon="🌟"
          color="bg-yellow-200"
          onClick={() => selectDifficulty("prodigy")}
        />
        <DifficultyLevel
          title="Wizard"
          description="Expert level with rare and complex words"
          icon="🧙"
          color="bg-red-200"
          onClick={() => selectDifficulty("wizard")}
        />
      </div>

      <button
        onClick={() => setCurrentView("categories")}
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
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
            :{" "}
            {selectedDifficulty.charAt(0).toUpperCase() +
              selectedDifficulty.slice(1)}
          </h2>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <FaStar className="text-yellow-500" />
            <span className="font-semibold">{stars}</span>
          </div>
        </div>

        {selectedCategory === "stories" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">
              {currentChallenge.title}
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="whitespace-pre-line text-gray-800">
                {currentChallenge.content}
              </p>
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

        {selectedCategory === "comprehension" && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="whitespace-pre-line text-gray-800">
                {currentChallenge.passage}
              </p>
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

        {(selectedCategory === "sentences" ||
          selectedCategory === "paragraphs") && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <div className="text-center">
              <HighlightedTextWithMic
                text={currentChallenge.text}
                highlightedWords={highlightedWords}
              />

              <div className="flex justify-center gap-4">
                <button
                  onClick={startListening}
                  disabled={isListening || micActive}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white font-semibold ${
                    isListening || micActive
                      ? "bg-gray-400"
                      : "bg-purple-600 hover:bg-purple-700"
                  } transition-colors`}
                >
                  <FaMicrophone />
                  {micActive ? "Listening..." : "Read Aloud"}
                </button>
                {(isListening || micActive) && (
                  <button
                    onClick={() => {
                      if (recognitionRef.current) {
                        recognitionRef.current.stop();
                        setMicActive(false);
                        setIsListening(false);
                      }
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                  >
                    Stop & Check
                  </button>
                )}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Read the text above aloud when prompted
              </p>
              {lastTranscript && (
                <div className="mt-2 text-gray-600 text-sm">
                  <strong>Last spoken:</strong> {lastTranscript}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCategory !== "stories" &&
          selectedCategory !== "comprehension" &&
          selectedCategory !== "sentences" &&
          selectedCategory !== "paragraphs" && (
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <div className="text-center">
                {selectedCategory === "words" ? (
                  <p className="text-4xl md:text-5xl font-medium text-gray-800 mb-6">
                    {currentChallenge.text}
                  </p>
                ) : (
                  <HighlightedText text={currentChallenge.text} />
                )}

                <div className="flex justify-center gap-4">
                  <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full text-white font-semibold ${
                      isListening
                        ? "bg-gray-400"
                        : "bg-purple-600 hover:bg-purple-700"
                    } transition-colors`}
                  >
                    <FaMicrophone />
                    {isListening ? "Listening..." : "Read Aloud"}
                  </button>

                  {isListening && (
                    <button
                      onClick={() => {
                        if (recognitionRef.current) {
                          recognitionRef.current.stop();
                        }
                      }}
                      className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                    >
                      Stop & Check
                    </button>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-500">
                  Read the text above aloud when prompted
                </p>
              </div>
            </div>
          )}

        {feedback && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              feedback.includes("Perfect") || feedback.includes("Correct")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => {
              setCurrentView("difficulty");
              setFeedback("");
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            ← Change Difficulty
          </button>

          <button
            onClick={() => {
              startChallenge();
              setFeedback("");
            }}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${
              !canProceed ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canProceed}
          >
            Next Challenge →
          </button>
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-center mb-8">
        My Reading Progress
      </h2>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaStar className="text-yellow-500" /> Stars Earned: {stars}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(userProgress).map(([category, levels]) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-3 capitalize">
                {category}
              </h4>
              <div className="space-y-2">
                {Object.entries(levels).map(([level, count]) => (
                  <div
                    key={level}
                    className="flex justify-between items-center"
                  >
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
        onClick={() => setCurrentView("home")}
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
            <h4 className="font-bold text-lg text-center mb-2">
              🏆 Bronze Reader
            </h4>
            <p className="text-center text-gray-700">
              Earned for collecting 5 stars
            </p>
          </div>
        )}

        {stars >= 15 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-inner border-2 border-gray-300">
            <h4 className="font-bold text-lg text-center mb-2">
              🏆 Silver Reader
            </h4>
            <p className="text-center text-gray-700">
              Earned for collecting 15 stars
            </p>
          </div>
        )}

        {stars >= 30 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-inner border-2 border-yellow-500">
            <h4 className="font-bold text-lg text-center mb-2">
              🏆 Gold Reader
            </h4>
            <p className="text-center text-gray-700">
              Earned for collecting 30 stars
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setCurrentView("home")}
        className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        <FaHome /> Back to Home
      </button>
    </div>
  );

  // Main component return
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {currentView === "home" && renderHome()}
        {currentView === "categories" && renderCategories()}
        {currentView === "difficulty" && renderDifficulty()}
        {currentView === "challenge" && renderChallenge()}
        {currentView === "progress" && renderProgress()}
        {currentView === "rewards" && renderRewards()}
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
                color: ["#fbbf24", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"][
                  Math.floor(Math.random() * 5)
                ],
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

// Helper components
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