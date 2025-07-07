import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Volume2, Download, FileText } from 'lucide-react';

const AnswerSubmissionManager = ({ 
  questions, 
  currentQuestion, 
  recordedAnswers, 
  onSubmitAssignment,
  onSaveAnswer,
  onResetAnswer,
  isRecording,
  recordingTime,
  formatTime
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if all questions have answers
  const allQuestionsAnswered = questions.every(
    (_, index) => recordedAnswers[index]?.audioUrl
  );

  const handleSubmitAssignment = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitAssignment(recordedAnswers);
      setShowSummary(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Question Answer Section */}
      {!showSummary && (
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            Question {currentQuestion + 1} Response
          </h3>

          {recordedAnswers[currentQuestion]?.audioUrl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Volume2 className="text-blue-400" />
                  <span className="text-white">
                    Recorded answer ({formatTime(recordedAnswers[currentQuestion].duration)})
                  </span>
                </div>
                <audio
                  controls
                  src={recordedAnswers[currentQuestion].audioUrl}
                  className="w-full max-w-xs"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => onResetAnswer(currentQuestion)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-400/40 text-red-100 hover:bg-red-500/30 transition-colors"
                >
                  Re-record
                </button>
                <button
                  onClick={() => onSaveAnswer(currentQuestion)}
                  disabled={!recordedAnswers[currentQuestion]}
                  className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/40 text-green-100 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  Confirm Answer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/5 p-6 rounded-xl text-center">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-red-500/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">●</span>
                      </div>
                    </div>
                    <p className="text-white/80">Recording: {formatTime(recordingTime)}</p>
                  </div>
                ) : (
                  <p className="text-white/60">No answer recorded yet</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => onResetAnswer(currentQuestion)}
              className="px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-400/40 text-gray-100 hover:bg-gray-500/30 transition-colors"
            >
              Reset
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => onSaveAnswer(currentQuestion)}
                disabled={!recordedAnswers[currentQuestion]?.audioUrl}
                className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-100 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitAssignment}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-100 hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Assignment Summary */}
      {showSummary && (
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Assignment *** Summary
          </h3>

          <div className="space-y-4 mb-6">
            {questions.map((question, index) => (
              <div key={index} className="bg-white/5 p-4 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">
                      Question {index + 1}: {question.text}
                    </h4>
                    {recordedAnswers[index] ? (
                      <div className="flex items-center gap-3 mt-2">
                        <Volume2 className="text-blue-400 w-4 h-4" />
                        <audio
                          controls
                          src={recordedAnswers[index].audioUrl}
                          className="flex-1 max-w-md"
                        />
                        <span className="text-white/60 text-sm">
                          {formatTime(recordedAnswers[index].duration)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-red-400/80 flex items-center gap-2 mt-2">
                        <XCircle className="w-4 h-4" />
                        <span>No answer submitted</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-1">
                    {recordedAnswers[index] ? (
                      <CheckCircle className="text-green-400 w-5 h-5" />
                    ) : (
                      <XCircle className="text-red-400 w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-400/40 text-gray-100 hover:bg-gray-500/30 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Audio Files
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-100 hover:bg-blue-500/30 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerSubmissionManager;