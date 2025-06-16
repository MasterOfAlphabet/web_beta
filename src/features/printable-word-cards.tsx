import React, { useState, useRef } from 'react';

// Sample word data for demonstration
const sampleWords = [
  // ... (same as your sampleWords array)
  // [Copy your sampleWords array here, unchanged]
  {
    id: 1,
    word: "ephemeral",
    partOfSpeech: "adjective",
    pronunciation: "ih-FEM-er-uhl",
    meaning: "lasting for a very short time; transitory",
    sentence: "The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.",
    synonyms: "temporary, fleeting, brief",
    antonyms: "permanent, lasting, eternal",
    difficulty: "Intermediate"
  },
  // ... rest of the words
];

const CARD_SIZES = {
  small: { width: 'w-64', height: 'h-40', name: "Small (4x2.5 inches)" },
  medium: { width: 'w-80', height: 'h-52', name: "Medium (5x3.25 inches)" },
  large: { width: 'w-96', height: 'h-64', name: "Large (6x4 inches)" },
};

const getDifficultyTailwind = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'beginner';
    case 'Intermediate': return 'intermediate';
    case 'Advanced': return 'advanced';
    default: return '';
  }
};

const PrintableWordCards = () => {
  const [selectedWords, setSelectedWords] = useState(sampleWords.map(w => w.id));
  const [cardStyle, setCardStyle] = useState('standard');
  const [includeDefinitions, setIncludeDefinitions] = useState(true);
  const [includePronunciation, setIncludePronunciation] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeSynonyms, setIncludeSynonyms] = useState(true);
  const [cardSize, setCardSize] = useState('medium');
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef();

  const handleWordSelection = (wordId) => {
    setSelectedWords(prev =>
      prev.includes(wordId)
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const handleSelectAll = (e) => {
    e.preventDefault();
    setSelectedWords(sampleWords.map(w => w.id));
  };

  const handleDeselectAll = (e) => {
    e.preventDefault();
    setSelectedWords([]);
  };

  const getSelectedWords = () => {
    return sampleWords.filter(word => selectedWords.includes(word.id));
  };

  const handlePrint = (e) => {
    e.preventDefault();
    if (!selectedWords.length) return;
    const printContent = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Printable Word Cards</title>
          <style>
            @media print {
              @page { margin: 0.5in; }
              body { font-family: Arial, sans-serif; }
              .no-print { display: none !important; }
              .print-break { page-break-after: always; }
            }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
            .word-card {
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 20px;
              background: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              min-height: 200px;
            }
            .word-title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
            .pos { font-size: 14px; color: #6b7280; font-style: italic; margin-bottom: 12px; }
            .pronunciation { font-size: 16px; color: #374151; margin-bottom: 12px; }
            .meaning { font-size: 16px; color: #111827; line-height: 1.5; margin-bottom: 12px; }
            .example { font-size: 14px; color: #4b5563; font-style: italic; margin-bottom: 12px; }
            .synonyms { font-size: 14px; color: #059669; }
            .difficulty {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
              float: right;
            }
            .beginner { background: #dcfce7; color: #166534; }
            .intermediate { background: #fef3c7; color: #92400e; }
            .advanced { background: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadPDF = async (e) => {
    e.preventDefault();
    alert('PDF download would be implemented with jsPDF or html2pdf. For now, use Print.');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🖨️ Printable Word Cards</h1>
        <p className="text-lg text-gray-600">Create beautiful printable flashcards for vocabulary practice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">📝 Customize Cards</h2>
            {/* Word Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Words ({selectedWords.length} selected)
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleSelectAll}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                  tabIndex={0}
                  type="button"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                  tabIndex={0}
                  type="button"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {sampleWords.map(word => (
                  <label key={word.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWords.includes(word.id)}
                      onChange={() => handleWordSelection(word.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{word.word}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Size</label>
              <select
                value={cardSize}
                onChange={(e) => setCardSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                {Object.entries(CARD_SIZES).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Card Style */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Style</label>
              <div className="space-y-2">
                {["standard", "minimal", "colorful"].map(style => (
                  <label key={style} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cardStyle"
                      value={style}
                      checked={cardStyle === style}
                      onChange={(e) => setCardStyle(e.target.value)}
                    />
                    <span className="text-sm capitalize">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Include</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDefinitions}
                    onChange={(e) => setIncludeDefinitions(e.target.checked)}
                  />
                  <span className="text-sm">Definitions</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePronunciation}
                    onChange={(e) => setIncludePronunciation(e.target.checked)}
                  />
                  <span className="text-sm">Pronunciation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExamples}
                    onChange={(e) => setIncludeExamples(e.target.checked)}
                  />
                  <span className="text-sm">Example Sentences</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSynonyms}
                    onChange={(e) => setIncludeSynonyms(e.target.checked)}
                  />
                  <span className="text-sm">Synonyms</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={(e) => { e.preventDefault(); setShowPreview(!showPreview); }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                type="button"
              >
                {showPreview ? '🙈 Hide Preview' : '👁️ Show Preview'}
              </button>
              <button
                onClick={handlePrint}
                disabled={selectedWords.length === 0}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="button"
              >
                🖨️ Print Cards
              </button>
              <button
                onClick={downloadPDF}
                disabled={selectedWords.length === 0}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                type="button"
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3">
          {showPreview && selectedWords.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Card Preview</h2>
                <span className="text-sm text-gray-600">
                  {selectedWords.length} card{selectedWords.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div ref={printRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 card-grid">
                  {getSelectedWords().map((word, index) => (
                    <div
                      key={word.id}
                      className={[
                        "word-card",
                        CARD_SIZES[cardSize].width,
                        CARD_SIZES[cardSize].height,
                        cardStyle === 'colorful' ? getDifficultyTailwind(word.difficulty) : '',
                        cardStyle === 'minimal' ? 'border-gray-100 shadow-sm' : '',
                      ].filter(Boolean).join(' ')}
                      style={{
                        background: cardStyle === 'colorful'
                          ? (word.difficulty === 'Beginner'
                              ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
                              : word.difficulty === 'Intermediate'
                                ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                                : word.difficulty === 'Advanced'
                                  ? 'linear-gradient(135deg, #fee2e2, #fecaca)'
                                  : 'white')
                          : 'white'
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{word.word}</h3>
                          <p className="text-sm text-gray-600 italic">{word.partOfSpeech}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold difficulty ${getDifficultyBadge(word.difficulty)}`}>
                          {word.difficulty}
                        </span>
                      </div>
                      {includePronunciation && (
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Pronunciation:</span> <span>/{word.pronunciation}/</span>
                        </p>
                      )}
                      {includeDefinitions && (
                        <p className="text-gray-800 mb-2 leading-relaxed">
                          <span className="font-medium">Definition:</span> {word.meaning}
                        </p>
                      )}
                      {includeExamples && (
                        <p className="text-gray-700 italic mb-2 text-sm">
                          <span className="font-medium not-italic">Example:</span> "{word.sentence}"
                        </p>
                      )}
                      {includeSynonyms && (
                        <p className="text-green-700 text-sm">
                          <span className="font-medium">Synonyms:</span> {word.synonyms}
                        </p>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                          Word #{index + 1} • Vocabulary Builder
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {selectedWords.length === 0 ? 'No words selected' : 'Preview hidden'}
              </h3>
              <p className="text-gray-600">
                {selectedWords.length === 0
                  ? 'Select some words from the sidebar to get started'
                  : 'Click "Show Preview" to see your cards'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📖 Printing Instructions</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Use thick cardstock paper (200-300gsm) for best results</li>
          <li>• Print in color for the full experience, or black & white to save ink</li>
          <li>• Cut along the card borders after printing</li>
          <li>• For durability, consider laminating the cards</li>
          <li>• Standard cards fit 2 per page, small cards fit 4 per page</li>
        </ul>
      </div>
    </div>
  );
};

export default PrintableWordCards;