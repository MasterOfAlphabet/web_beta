import React, { useState, useEffect } from 'react';
import {
  ChatBubbleOvalLeftIcon,
  FaceSmileIcon,
  StarIcon as StarIconOutline,
  PencilSquareIcon,
  PaperAirplaneIcon,
  CheckCircleIcon as CheckCircleIconSolid,
  CircleStackIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ReviewRatingFeedbackSection = ({
  onSubmit,
  isSubmitting = false,
  isSpeaking = false,
  reviewOptions = ["Easy", "Just Right", "Challenging", "Fun", "Loved it!"],
  className = '',
  title = "Share Your Experience",
  subtitle = "Help us make learning better for everyone",
  ratingLabel = "Rate this content:",
  commentPlaceholder = "Share your thoughts, suggestions, or experiences..."
}) => {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!review) newErrors.review = 'Please select a review option';
    if (!rating) newErrors.rating = 'Please provide a rating';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ rating, review, comment });
      setShowSuccessModal(true);
    }
  };

  const resetForm = () => {
    setRating(null);
    setReview('');
    setComment('');
    setErrors({});
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeInUp">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircleIconSolid className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Feedback Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for helping us improve your learning experience.
              </p>
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {title}
          </h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Review Options */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaceSmileIcon className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-800">How did you find this content?</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {reviewOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setReview(option)}
                  disabled={isSpeaking}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    review === option
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${errors.review ? 'ring-2 ring-red-500' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.review && (
              <p className="mt-2 text-sm text-red-600 text-center">{errors.review}</p>
            )}
          </div>

          {/* Rating Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <StarIconSolid className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{ratingLabel}</h3>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isSpeaking}
                    className={`transition-all ${errors.rating ? 'ring-2 ring-red-500 rounded-md' : ''}`}
                  >
                    <StarIconSolid
                      className={`w-10 h-10 ${
                        rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      } hover:scale-110`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
              )}
              {rating && (
                <p className="mt-3 text-sm font-medium text-gray-600">
                  {rating === 5 ? 'Perfect! 🌟' : 
                   rating >= 4 ? 'Great! 😊' : 
                   rating >= 3 ? 'Good 👍' : 
                   rating >= 2 ? 'Okay 👌' : 
                   'Thanks for the feedback'}
                </p>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <PencilSquareIcon className="w-5 h-5 text-blue-500" />
              <label className="text-lg font-semibold text-gray-800">Your feedback (optional)</label>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={commentPlaceholder}
              rows={4}
              disabled={isSpeaking}
              className="w-full p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || isSpeaking}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed w-full max-w-xs"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Submit Feedback
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReviewRatingFeedbackSection;