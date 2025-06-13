import React, { useState, useEffect } from "react";

const FloatingParticle = ({ delay = 0, x = 0, y = 0 }) => {
  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-bounce opacity-70"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: '3s'
      }}
    />
  );
};

const CelebrationOverlay = ({ show, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
      {particles.map(particle => (
        <FloatingParticle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          delay={particle.delay}
        />
      ))}
      
      <div className="text-center animate-pulse">
        <div className="text-8xl mb-4 animate-spin">🎉</div>
        <h2 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Thank You!
        </h2>
        <p className="text-xl text-gray-600">Your feedback helps us grow! ✨</p>
      </div>
    </div>
  );
};

const ReviewRatingFeedbackSection = ({
  review: initialReview = "",
  handleReviewSelect: externalHandleReviewSelect,
  rating: initialRating = 0,
  setRating: externalSetRating,
  comment: initialComment = "",
  setComment: externalSetComment,
  handleSave: externalHandleSave,
  saving: externalSaving = false,
  isSpeaking = false
}) => {
  const [internalReview, setInternalReview] = useState(initialReview);
  const [internalRating, setInternalRating] = useState(initialRating);
  const [internalComment, setInternalComment] = useState(initialComment);
  const [internalSaving, setInternalSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Use external props if provided, otherwise use internal state
  const review = externalHandleReviewSelect ? initialReview : internalReview;
  const rating = externalSetRating ? initialRating : internalRating;
  const comment = externalSetComment ? initialComment : internalComment;
  const saving = externalHandleSave ? externalSaving : internalSaving;

  const reviewOptions = [
    { label: "Easy", color: "bg-green-500", borderColor: "border-green-500", textColor: "text-green-500", emoji: "😊" },
    { label: "Just Right", color: "bg-blue-500", borderColor: "border-blue-500", textColor: "text-blue-500", emoji: "👌" },
    { label: "Challenging", color: "bg-orange-500", borderColor: "border-orange-500", textColor: "text-orange-500", emoji: "💪" },
    { label: "Fun", color: "bg-pink-500", borderColor: "border-pink-500", textColor: "text-pink-500", emoji: "🎉" },
    { label: "Loved it!", color: "bg-purple-500", borderColor: "border-purple-500", textColor: "text-purple-500", emoji: "❤️" }
  ];

  const handleReviewSelect = (option) => {
    if (externalHandleReviewSelect) {
      externalHandleReviewSelect(option);
    } else {
      setInternalReview(option);
    }
  };

  const setRating = (newRating) => {
    if (externalSetRating) {
      externalSetRating(newRating);
    } else {
      setInternalRating(newRating);
    }
  };

  const setComment = (newComment) => {
    if (externalSetComment) {
      externalSetComment(newComment);
    } else {
      setInternalComment(newComment);
    }
  };

  const handleSave = async () => {
    if (externalHandleSave) {
      await externalHandleSave();
    } else {
      setInternalSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInternalSaving(false);
      setIsSubmitted(true);
      setShowCelebration(true);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setInternalReview("");
    setInternalRating(0);
    setInternalComment("");
  };

  if (isSubmitted && !showCelebration) {
    return (
      <div className="max-w-4xl mx-auto mt-8 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-2xl border-l-4 border-green-300">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">✨ Feedback Received Successfully!</h3>
              <p className="text-green-100 text-sm">Thank you for helping us improve your learning experience. Your feedback is valuable to us!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CelebrationOverlay show={showCelebration} onComplete={handleCelebrationComplete} />
      
      <div className="max-w-4xl mx-auto mt-8 mb-8 transform transition-all duration-800 ease-out animate-fadeInUp">
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border border-white/80 p-8 relative overflow-hidden group hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
          {/* Animated top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          
          {/* Floating background elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Share Your Experience
            </h2>
            <p className="text-gray-600 text-lg">Help us make learning better for everyone</p>
          </div>

          {/* Review Options */}
          <div className="mb-10">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">😊</span>
                <h3 className="text-2xl font-bold text-gray-800">How did you find this word?</h3>
              </div>
            </div>
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
              {reviewOptions.map((option, index) => {
                const isSelected = review === option.label;
                return (
                  <button
                    key={option.label}
                    onClick={() => handleReviewSelect(option.label)}
                    disabled={isSpeaking}
                    className={`
                      px-4 py-3 rounded-2xl border-2 font-bold text-base transition-all duration-300 
                      transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300/50
                      whitespace-nowrap flex-shrink-0
                      ${isSelected 
                        ? `${option.color} text-white shadow-xl` 
                        : `${option.borderColor} ${option.textColor} bg-white hover:bg-gray-50`
                      }
                      animate-fadeInUp
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{option.emoji}</span>
                      <span>{option.label}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-10 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-100/20 animate-pulse"></div>
            <div className="relative text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rate this word experience</h3>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    disabled={isSpeaking}
                    className="relative transition-all duration-300 hover:scale-125 focus:outline-none transform group"
                  >
                    <svg 
                      className={`w-12 h-12 transition-all duration-300 ${
                        rating >= star 
                          ? 'text-yellow-400 drop-shadow-lg filter brightness-110' 
                          : 'text-gray-300 hover:text-yellow-200'
                      } group-hover:animate-pulse`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {rating >= star && (
                      <div className="absolute inset-0 animate-ping">
                        <svg className="w-12 h-12 text-yellow-300 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-orange-600 font-semibold mt-3 animate-fadeInUp">
                  {rating === 5 ? "Amazing! 🌟" : rating >= 4 ? "Great! 😊" : rating >= 3 ? "Good! 👍" : rating >= 2 ? "Okay 👌" : "Thanks for the feedback! 💪"}
                </p>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <label className="text-lg font-semibold text-gray-800">Your feedback helps us improve!</label>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think about this word? Any suggestions for improvement?"
              rows={4}
              disabled={isSpeaking}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:-translate-y-1"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSave}
              disabled={saving || isSpeaking}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50 disabled:opacity-50 disabled:transform-none relative overflow-hidden group min-w-64"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-3">
                {saving ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Submitting Your Thoughts...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Share Your Amazing Thoughts</span>
                    <span className="text-pink-200">💝</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  );
};

export default ReviewRatingFeedbackSection;