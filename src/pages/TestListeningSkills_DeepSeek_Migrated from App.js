import React, { useState } from "react";
import { FaFeather, FaParagraph, FaBook } from "react-icons/fa";
import { IoText } from "react-icons/io5";

// Mock data for comprehension titles
const comprehensionTitles = [
  { id: 1, title: "The Cat and the Mouse", level: "Beginner" },
  { id: 2, title: "The Solar System", level: "Intermediate" },
  { id: 3, title: "Climate Change", level: "Advanced" },
];

// Mock data for listening passages
const listeningPassages = [
  {
    id: 1,
    title: "The Cat and the Mouse",
    passage:
      "Once upon a time, a cat and a mouse lived in the same house. The cat was lazy, but the mouse was very hardworking. One day, the mouse found a piece of cheese and decided to save it for the winter. The cat, however, wanted to eat the cheese right away.",
    questions: [
      {
        question: "What did the mouse find?",
        options: ["A piece of bread", "A piece of cheese", "A piece of cake"],
        correctAnswer: 1,
        explanation:
          "The mouse found a piece of cheese, as mentioned in the passage.",
      },
      {
        question: "What did the cat want to do with the cheese?",
        options: [
          "Save it for winter",
          "Eat it right away",
          "Share it with the mouse",
        ],
        correctAnswer: 1,
        explanation:
          "The cat wanted to eat the cheese right away, as stated in the passage.",
      },
    ],
  },
  {
    id: 2,
    title: "The Solar System",
    passage:
      "The solar system consists of the Sun and the objects that orbit around it, including planets, moons, asteroids, and comets. The Sun is the largest object in the solar system and provides light and heat to all the planets.",
    questions: [
      {
        question: "What is the largest object in the solar system?",
        options: ["Earth", "The Sun", "Jupiter"],
        correctAnswer: 1,
        explanation:
          "The Sun is the largest object in the solar system, as mentioned in the passage.",
      },
      {
        question: "What does the Sun provide to the planets?",
        options: ["Light and heat", "Water and air", "Food and shelter"],
        correctAnswer: 0,
        explanation:
          "The Sun provides light and heat to the planets, as stated in the passage.",
      },
    ],
  },
  {
    id: 3,
    title: "Climate Change",
    passage:
      "Climate change refers to long-term changes in temperature and weather patterns, primarily caused by human activities such as burning fossil fuels and deforestation. These activities increase the concentration of greenhouse gases in the atmosphere, leading to global warming.",
    questions: [
      {
        question: "What is the primary cause of climate change?",
        options: ["Natural disasters", "Human activities", "Volcanic eruptions"],
        correctAnswer: 1,
        explanation:
          "Human activities, such as burning fossil fuels and deforestation, are the primary cause of climate change.",
      },
      {
        question: "What do greenhouse gases cause?",
        options: ["Global cooling", "Global warming", "No effect"],
        correctAnswer: 1,
        explanation:
          "Greenhouse gases cause global warming, as mentioned in the passage.",
      },
    ],
  },
];

// Mock data for sentences
const sentences = {
  "Very Short": "The sun shines.",
  Short: "Birds fly in the sky.",
  Long: "The quick brown fox jumps over the lazy dog.",
  "Very Long": "Despite the heavy rain, the children continued to play in the park.",
  "Extremely Long":
    "The majestic mountain stood tall, covered in a blanket of snow, as the sun slowly rose over the horizon.",
};

// Mock data for paragraphs
const paragraphs = [
  "The early bird catches the worm. This is a well-known saying that emphasizes the importance of starting your day early.",
  "A journey of a thousand miles begins with a single step. This proverb reminds us that every big achievement starts with a small action.",
  "Practice makes perfect. The more you practice, the better you become at any skill.",
  "Honesty is the best policy. Being truthful and honest always leads to better outcomes in life.",
  "Where there's a will, there's a way. If you are determined to achieve something, you will find a way to do it.",
];

// Mock data for words
const words = ["apple", "banana", "cherry", "date", "elderberry"];

// 4 categories in a 2x2 grid, each with a color
const categories = [
  {
    key: "Words",
    label: "Words",
    icon: <FaFeather size={40} />,
    color: "bg-green-500",
    borderColor: "border-green-500",
    textColor: "text-green-500",
  },
  {
    key: "Sentences",
    label: "Sentences",
    icon: <IoText size={40} />,
    color: "bg-orange-500",
    borderColor: "border-orange-500",
    textColor: "text-orange-500",
  },
  {
    key: "Paragraphs",
    label: "Paragraphs",
    icon: <FaParagraph size={40} />,
    color: "bg-purple-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-500",
  },
  {
    key: "Comprehension",
    label: "Comprehension",
    icon: <FaBook size={40} />,
    color: "bg-blue-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-500",
  },
];

const TestListeningSkills = () => {
  // Default category = "Words"
  const [selectedCategory, setSelectedCategory] = useState("Words");
  const [selectedClass, setSelectedClass] = useState("Class I & II");
  const [selectedLevel, setSelectedLevel] = useState("Rookie");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedLines, setSelectedLines] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [selectedWords, setSelectedWords] = useState("");
  const [currentPassage, setCurrentPassage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPassageRead, setIsPassageRead] = useState(false);

  // Find the current category for styling
  const currentCategory = categories.find((c) => c.key === selectedCategory);

  // Category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTitle("");
    setSelectedLines("");
    setSelectedSentence("");
    setSelectedWords("");
    setCurrentPassage(null);
    setIsPassageRead(false);
    setShowResults(false);
    setFeedback("");
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  // Class & Level
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  // Title
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setSelectedTitle(value);
    const passage = listeningPassages.find((p) => p.title === value);
    setCurrentPassage(passage);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setFeedback("");
    setIsPassageRead(false);
  };

  // Lines (Paragraphs)
  const handleLinesChange = (e) => {
    setSelectedLines(e.target.value);
  };

  // Sentence
  const handleSentenceChange = (e) => {
    setSelectedSentence(e.target.value);
  };

  // Words
  const handleWordsChange = (e) => {
    setSelectedWords(e.target.value);
  };

  // Answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    const currentQuestion = currentPassage.questions[questionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setFeedback(`Correct! ${currentQuestion.explanation}`);
    } else {
      setFeedback(
        `Incorrect. The correct answer is: "${
          currentQuestion.options[currentQuestion.correctAnswer]
        }". ${currentQuestion.explanation}`
      );
    }
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setFeedback("");
    } else {
      setShowResults(true);
    }
  };

  // Score
  const calculateScore = () => {
    if (!currentPassage) {
      return { score: "0/0", feedbackMessage: "" };
    }
    const correctCount = Object.values(selectedAnswers).filter(
      (answer, idx) => answer === currentPassage.questions[idx].correctAnswer
    ).length;
    const total = currentPassage.questions.length;
    const scorePercent = (correctCount / total) * 100;

    let feedbackMessage = "";
    if (scorePercent === 100) {
      feedbackMessage = "Amazing job! You got all answers right.";
    } else if (scorePercent >= 70) {
      feedbackMessage =
        "Good work! You did well, but there's room for improvement.";
    } else {
      feedbackMessage = "Keep practicing to improve your listening skills!";
    }
    return { score: `${correctCount}/${total}`, feedbackMessage };
  };

  // Start listening - using Web Speech API
  const startListeningComprehension = () => {
    if (currentPassage && 'speechSynthesis' in window) {
      const utteranceTitle = new SpeechSynthesisUtterance(currentPassage.title);
      const utterancePassage = new SpeechSynthesisUtterance(currentPassage.passage);
      
      utteranceTitle.onend = () => {
        speechSynthesis.speak(utterancePassage);
      };
      
      utterancePassage.onend = () => {
        setIsPassageRead(true);
      };
      
      speechSynthesis.speak(utteranceTitle);
    } else {
      alert("Text-to-speech is not supported in your browser or no passage is selected.");
    }
  };

  const startReadingParagraphs = () => {
    if ('speechSynthesis' in window) {
      const lines = parseInt(selectedLines, 10);
      const paragraph = paragraphs[lines - 1] || paragraphs[0];
      const utterance = new SpeechSynthesisUtterance(paragraph);
      
      utterance.onend = () => {
        alert("Repeat: Please repeat the paragraph.");
      };
      
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const startReadingSentences = () => {
    if ('speechSynthesis' in window) {
      const sentence = sentences[selectedSentence];
      const utterance = new SpeechSynthesisUtterance(sentence);
      
      utterance.onend = () => {
        alert("Repeat: Please repeat the sentence.");
      };
      
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const startReadingWords = () => {
    if ('speechSynthesis' in window) {
      const wordCount = parseInt(selectedWords, 10);
      const selectedWordsList = words.slice(0, wordCount).join(", ");
      const utterance = new SpeechSynthesisUtterance(selectedWordsList);
      
      utterance.onend = () => {
        alert("Repeat: Please repeat the words.");
      };
      
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <div className={`min-h-screen p-5 ${currentCategory.color.replace('bg', 'bg-opacity-10')}`}>
      <h1 className="text-2xl font-bold text-center text-purple-800 mb-5">Listening Skills</h1>

      {/* 2x2 Grid for Categories */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`${cat.color} text-white p-6 rounded-lg flex flex-col items-center justify-center transition-all ${
              cat.key === selectedCategory ? "ring-4 ring-white" : ""
            }`}
            onClick={() => handleCategorySelect(cat.key)}
          >
            <div className="text-white">{cat.icon}</div>
            <span className="mt-2 text-lg font-semibold">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* The body container for selected category */}
      <div className={`p-5 rounded-lg border-2 ${currentCategory.borderColor} bg-white`}>
        {/* Class and Level */}
        <label className="block text-sm font-bold mb-1 text-purple-800">Class Group:</label>
        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="w-full p-2 mb-3 border rounded-md"
        >
          <option value="Class I & II">Class I & II</option>
          <option value="Class III to V">Class III to V</option>
          <option value="Class VI to X">Class VI to X</option>
        </select>

        <label className="block text-sm font-bold mb-1 text-purple-800">Level:</label>
        <select
          value={selectedLevel}
          onChange={handleLevelChange}
          className="w-full p-2 mb-3 border rounded-md"
        >
          <option value="Rookie">Rookie</option>
          <option value="Racer">Racer</option>
          <option value="Master">Master</option>
          <option value="Prodigy">Prodigy</option>
          <option value="Wizard">Wizard</option>
        </select>

        {/* Category-specific UI */}
        {selectedCategory === "Comprehension" && (
          <>
            <label className="block text-sm font-bold mb-1 text-purple-800">Select a Title:</label>
            <select
              value={selectedTitle}
              onChange={handleTitleChange}
              className="w-full p-2 mb-3 border rounded-md"
            >
              <option value="">-- Select a Title --</option>
              {comprehensionTitles.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>

            {currentPassage && !isPassageRead && (
              <button
                className={`w-full py-3 px-4 rounded-lg ${currentCategory.color} text-white font-bold mb-3`}
                onClick={startListeningComprehension}
              >
                Start Listening Comprehension
              </button>
            )}

            {currentPassage && isPassageRead && !showResults && (
              <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold mb-3">
                  {currentPassage.questions[currentQuestionIndex].question}
                </h3>
                {currentPassage.questions[currentQuestionIndex].options.map(
                  (option, idx) => (
                    <button
                      key={idx}
                      className={`w-full text-left p-3 mb-2 border rounded-md ${
                        selectedAnswers[currentQuestionIndex] === idx
                          ? "bg-blue-100 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, idx)}
                      disabled={feedback !== ""}
                    >
                      {option}
                    </button>
                  )
                )}
                {feedback !== "" && (
                  <p className="mt-3 italic text-gray-700">{feedback}</p>
                )}
                {feedback !== "" && (
                  <button
                    className={`w-full py-2 px-4 rounded-lg mt-3 ${currentCategory.color} text-white font-bold`}
                    onClick={nextQuestion}
                  >
                    {currentQuestionIndex < currentPassage.questions.length - 1
                      ? "Next Question"
                      : "Finish"}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {selectedCategory === "Paragraphs" && (
          <>
            <label className="block text-sm font-bold mb-1 text-purple-800">Select # of Lines:</label>
            <select
              value={selectedLines}
              onChange={handleLinesChange}
              className="w-full p-2 mb-3 border rounded-md"
            >
              <option value="">-- Select Lines --</option>
              <option value="1">1 Line</option>
              <option value="2">2 Lines</option>
              <option value="3">3 Lines</option>
              <option value="4">4 Lines</option>
              <option value="5">5 Lines</option>
            </select>

            {selectedLines !== "" && (
              <button
                className={`w-full py-3 px-4 rounded-lg ${currentCategory.color} text-white font-bold mb-3`}
                onClick={startReadingParagraphs}
              >
                Read Paragraph
              </button>
            )}
          </>
        )}

        {selectedCategory === "Sentences" && (
          <>
            <label className="block text-sm font-bold mb-1 text-purple-800">Select Sentence Length:</label>
            <select
              value={selectedSentence}
              onChange={handleSentenceChange}
              className="w-full p-2 mb-3 border rounded-md"
            >
              <option value="">-- Select Sentence --</option>
              <option value="Very Short">Very Short</option>
              <option value="Short">Short</option>
              <option value="Long">Long</option>
              <option value="Very Long">Very Long</option>
              <option value="Extremely Long">Extremely Long</option>
            </select>

            {selectedSentence !== "" && (
              <button
                className={`w-full py-3 px-4 rounded-lg ${currentCategory.color} text-white font-bold mb-3`}
                onClick={startReadingSentences}
              >
                Read Sentence
              </button>
            )}
          </>
        )}

        {selectedCategory === "Words" && (
          <>
            <label className="block text-sm font-bold mb-1 text-purple-800">Select # of Words:</label>
            <select
              value={selectedWords}
              onChange={handleWordsChange}
              className="w-full p-2 mb-3 border rounded-md"
            >
              <option value="">-- Select Words --</option>
              <option value="1">1 Word</option>
              <option value="2">2 Words</option>
              <option value="3">3 Words</option>
              <option value="4">4 Words</option>
              <option value="5">5 Words</option>
            </select>

            {selectedWords !== "" && (
              <button
                className={`w-full py-3 px-4 rounded-lg ${currentCategory.color} text-white font-bold mb-3`}
                onClick={startReadingWords}
              >
                Read Words
              </button>
            )}
          </>
        )}

        {showResults && (
          <div className="mt-5 p-5 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold text-center text-purple-800 mb-3">
              You scored {calculateScore().score}!
            </h3>
            <p className="text-center mb-4">
              {calculateScore().feedbackMessage}
            </p>
            <h4 className="font-bold text-center text-purple-800 mb-2">
              Tips to Improve:
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Listen carefully to the passage.</li>
              <li>Take notes while listening.</li>
              <li>Review explanations for incorrect answers.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestListeningSkills;