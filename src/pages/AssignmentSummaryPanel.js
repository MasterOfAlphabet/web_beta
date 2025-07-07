import { useState, useRef } from 'react';
import { CheckCircle, XCircle, Volume2, Download, FileText, ChevronDown, ChevronUp, Waves } from 'lucide-react';
import AudioPlayerComponent from './AudioPlayerComponent';

const AssignmentSummaryPanel = ({
  questions,
  recordedAnswers,
  onDownloadAudio,
  onGeneratePDF,
  onBackToEditing,
  onGenerateCombinedAudio, // <-- new prop
  formatTime
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [audioProgress, setAudioProgress] = useState(null); // e.g. {current: 2, total: 7}
  const [audioGenerating, setAudioGenerating] = useState(false);
  const downloadRef = useRef(null);

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const handleDownloadAll = () => {
    if (onDownloadAudio) {
      onDownloadAudio(recordedAnswers);
    } else if (downloadRef.current) {
      downloadRef.current.click();
    }
  };

  // Handler for generating combined audio
  const handleGenerateCombinedAudio = async () => {
    setAudioGenerating(true);
    setAudioProgress({ current: 0, total: questions.length });
    if (onGenerateCombinedAudio) {
      await onGenerateCombinedAudio(recordedAnswers, questions, setAudioProgress);
    }
    setAudioGenerating(false);
    setAudioProgress(null);
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          *** Assignment Summary ***
        </h3>
        <div className="text-sm text-white/60">
          {recordedAnswers.filter(a => a?.audioUrl).length} of {questions.length} answered
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {questions.map((question, index) => {
          const hasAnswer = recordedAnswers[index]?.audioUrl;
          return (
            <div
              key={index}
              className={`bg-white/5 rounded-lg overflow-hidden transition-all duration-200 ${
                expandedQuestion === index ? 'border border-white/20' : ''
              }`}
            >
              <div
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  hasAnswer ? 'hover:bg-white/10' : 'opacity-70'
                }`}
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center gap-3">
                  {hasAnswer ? (
                    <CheckCircle className="text-green-400 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-400 w-5 h-5" />
                  )}
                  <div>
                    <h4 className="font-medium text-white">
                      Question {index + 1}
                    </h4>
                    <p className="text-sm text-white/60 line-clamp-1">
                      {question.text}
                    </p>
                  </div>
                </div>
                <button className="text-white/50 hover:text-white transition-colors">
                  {expandedQuestion === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedQuestion === index && (
                <div className="p-4 pt-0 border-t border-white/10 bg-white/5 animate-fade-in">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-white/80 mb-1">Question:</p>
                    <p className="text-white/90 bg-white/10 p-3 rounded-lg">
                      {question.text}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/80 mb-1">Your Answer:</p>
                    {hasAnswer ? (
                      <div className="space-y-2">
                        <AudioPlayerComponent
                          audioUrl={recordedAnswers[index].audioUrl}
                          duration={recordedAnswers[index].duration}
                          playerSize="medium"
                          className="bg-white/5 border-white/10"
                        />
                        <div className="flex justify-between text-xs text-white/60">
                          <span>Recorded: {new Date(recordedAnswers[index].timestamp).toLocaleString()}</span>
                          <span>Duration: {formatTime(recordedAnswers[index].duration)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-red-400/80 bg-white/10 p-3 rounded-lg flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        <span>No answer recorded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden download link for fallback */}
      <a ref={downloadRef} className="hidden" download="audio-recording.wav" />

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onBackToEditing}
          className="px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-400/40 text-gray-100 hover:bg-gray-500/30 transition-colors"
        >
          Back to Editing
        </button>
        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-100 hover:bg-blue-500/30 transition-colors flex items-center gap-2 justify-center"
        >
          <Download className="w-4 h-4" />
          Download All Audio
        </button>
        <button
          onClick={onGeneratePDF}
          disabled={recordedAnswers.filter(a => a?.audioUrl).length === 0}
          className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-100 hover:bg-purple-500/30 transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-4 h-4" />
          Generate PDF Report
        </button>
        <button
          onClick={handleGenerateCombinedAudio}
          disabled={audioGenerating}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30 transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Waves className="w-4 h-4" />
          {audioGenerating ? 
            (audioProgress ? `Generating Audio (${audioProgress.current} / ${audioProgress.total})...` : 'Generating...') 
            : 'Generate Combined Audio'
          }
        </button>
      </div>
    </div>
  );
};

export default AssignmentSummaryPanel;