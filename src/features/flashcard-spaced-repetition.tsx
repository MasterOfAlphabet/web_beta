import React, { useState, useMemo } from 'react';

// Demo words
const sampleWords = [
  {
    id: 1,
    word: "ephemeral",
    partOfSpeech: "adjective",
    pronunciation: "ih-FEM-er-uhl",
    meaning: "lasting for a very short time",
    sentence: "The beauty of cherry blossoms is ephemeral.",
    synonyms: "temporary, fleeting, brief",
    difficulty: 1,
    easeFactor: 2.5,
    interval: 1,
    correctCount: 0,
    incorrectCount: 0,
    lastReviewed: null,
    nextReview: null,
  },
  {
    id: 2,
    word: "serendipity",
    partOfSpeech: "noun",
    pronunciation: "ser-uhn-DIP-i-tee",
    meaning: "events by chance in a happy way",
    sentence: "It was pure serendipity that she found it.",
    synonyms: "chance, fortune, luck",
    difficulty: 2,
    easeFactor: 2.5,
    interval: 1,
    correctCount: 0,
    incorrectCount: 0,
    lastReviewed: null,
    nextReview: null,
  },
];

const FlashcardSpacedRepetition = () => {
  const [words, setWords] = useState(sampleWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, total: 0 });

  // Filter due words
  const dueWords = useMemo(() => {
    const now = new Date();
    return words.filter(w => !w.nextReview || new Date(w.nextReview) <= now);
  }, [words]);

  const current = dueWords[currentIndex];

  // SM-2 Algorithm
  const updateWordWithSM2 = (word, quality) => {
    let ef = word.easeFactor;
    let interval = word.interval;
    const now = new Date();

    if (quality >= 3) {
      interval = word.correctCount === 0 ? 1 : word.correctCount === 1 ? 6 : Math.round(interval * ef);
      ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    } else {
      interval = 1;
      ef = Math.max(1.3, ef - 0.2);
    }

    const nextReview = new Date(now.getTime() + interval * 86400000);

    return {
      ...word,
      easeFactor: ef,
      interval,
      nextReview,
      lastReviewed: now,
      correctCount: quality >= 3 ? word.correctCount + 1 : word.correctCount,
      incorrectCount: quality < 3 ? word.incorrectCount + 1 : word.incorrectCount
    };
  };

  const handleAnswer = (quality) => {
    if (!current) return;

    const updatedWord = updateWordWithSM2(current, quality);
    const updated
  if (dueWords.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-3">🎉 No words due for review</h2>
        <p className="text-gray-600 mb-6">Come back later when more are due!</p>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowStats(true)}
        >
          📊 View Stats
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Session Complete!</h2>
        <p className="text-gray-700 mb-4">Correct: {stats.correct} | Incorrect: {stats.incorrect}</p>
        <p className="text-xl font-semibold text-blue-600 mb-6">
          Accuracy: {Math.round((stats.correct / stats.total) * 100)}%
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={resetSession}>🔁 Restart</button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setShowStats(true)}>📊 View Stats</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">📚 Spaced Repetition</h1>
        <p className="text-gray-600">Click the card to flip</p>
        <p className="text-sm mt-2 text-gray-500">Word {currentIndex + 1} of {dueWords.length}</p>
      </div>

      {/* Card */}
      <div
        className={`w-full min-h-72 rounded-xl shadow-xl transition-transform duration-500 transform ${
          isFlipped ? 'rotate-y-180' : ''
        } bg-gradient-to-br ${isFlipped ? 'from-purple-600 to-blue-600' : 'from-pink-500 to-red-500'}`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px', cursor: 'pointer' }}
      >
        <div className="p-6 text-white h-full flex flex-col justify-center">
          {/* Difficulty Label */}
          <div className={`inline-block px-3 py-1 text-xs rounded-full mb-4 ${difficultyColor(current.difficulty)} text-white`}>
            {difficultyLabel(current.difficulty)}
          </div>

          {!isFlipped ? (
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold">{current.word}</h2>
              <p className="text-lg italic">{current.partOfSpeech}</p>
              <p className="text-md">/{current.pronunciation}/</p>
              <p className="text-sm mt-4">🔄 Tap to see meaning</p>
            </div>
          ) : (
            <div className="text-left space-y-2">
              <h3 className="text-xl font-semibold">Meaning:</h3>
              <p>{current.meaning}</p>
              <h3 className="text-xl font-semibold mt-4">Example:</h3>
              <p className="italic">“{current.sentence}”</p>
              <h3 className="text-xl font-semibold mt-4">Synonyms:</h3>
              <p>{current.synonyms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Answer Buttons */}
      {isFlipped && (
        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={() => handleAnswer(1)} // Again
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
          >
            ❌ Again
          </button>
          <button
            onClick={() => handleAnswer(3)} // Good
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full"
          >
            🤔 Good
          </button>
          <button
            onClick={() => handleAnswer(5)} // Easy
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            ✅ Easy
          </button>
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📊 Study Stats</h2>
                <button onClick={() => setShowStats(false)} className="text-2xl font-bold text-gray-500 hover:text-gray-800">
                  &times;
                </button>
              </div>
              <div className="space-y-3">
                {words.map((word) => (
                  <div key={word.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                    <div>
                      <h3 className="text-lg font-bold">{word.word}</h3>
                      <p className="text-sm text-gray-500">
                        ✓ {word.correctCount} | ✗ {word.incorrectCount}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>Interval: {word.interval}d</div>
                      <div>
                        Next: {word.nextReview ? new Date(word.nextReview).toLocaleDateString() : "Now"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-4">
                <button
                  onClick={() => setShowStats(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardSpacedRepetition;
