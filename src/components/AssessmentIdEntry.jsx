// ============================================================================
// Assessment ID Entry & Verification Component
// ============================================================================
// Add this to your ParentRegistrationPage.jsx or create a new component

import React, { useState } from "react";
import { 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Lock, 
  Phone,
  ArrowRight,
  Info
} from "lucide-react";
import { 
  fetchAssessment, 
  verifyPhoneNumber, 
  maskPhoneNumber,
  validateAssessmentIdFormat,
  getCompletedModules 
} from '../services/assessmentService';

export default function AssessmentIdEntry({ onContinue, onSkip }) {
  const [assessmentId, setAssessmentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  
  // Verification state
  const [assessmentData, setAssessmentData] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  const handleLookup = async () => {
    setError('');
    
    if (!assessmentId.trim()) {
      setError('Please enter an Assessment ID');
      return;
    }
    
    // Validate format
    if (!validateAssessmentIdFormat(assessmentId.trim())) {
      setError('Invalid ID format. Expected: AS-5-43210XK');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await fetchAssessment(assessmentId.trim().toUpperCase());
      
      if (result.success) {
        setAssessmentData(result.data);
        setShowVerification(true);
        setError('');
      } else {
        setError('Assessment ID not found. Please check and try again.');
        setAssessmentData(null);
      }
    } catch (err) {
      setError('Error looking up assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = () => {
    setVerifyError('');
    
    if (!phoneNumber.trim()) {
      setVerifyError('Please enter the mobile number');
      return;
    }
    
    const isValid = verifyPhoneNumber(assessmentData, phoneNumber);
    
    if (isValid) {
      // Success! Pass data back to parent
      onContinue({
        assessmentId: assessmentData.assessmentId,
        studentData: assessmentData.studentData,
        rankingData: assessmentData.rankingData,
        completedModules: getCompletedModules(assessmentData),
        isReturningUser: true
      });
    } else {
      setVerifyAttempts(prev => prev + 1);
      
      if (verifyAttempts >= 2) {
        setVerifyError('Too many incorrect attempts. Please contact support or start fresh.');
      } else {
        setVerifyError('Mobile number does not match. Please try again.');
      }
    }
  };

  const handleSkipClick = () => {
    setShowSkipWarning(true);
  };

  const handleConfirmSkip = () => {
    onSkip();
  };

  // If showing verification screen
  if (showVerification && assessmentData) {
    const completedModules = getCompletedModules(assessmentData);
    
    return (
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-green-200 p-6 sm:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Assessment Found! ✅
          </h2>
          <p className="text-gray-600">
            Verify your identity to continue
          </p>
        </div>

        {/* Student Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 mb-6">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Student Name</p>
              <p className="text-xl font-black text-gray-900">{assessmentData.studentData.fullName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Grade</p>
                <p className="text-lg font-bold text-gray-900">Grade {assessmentData.studentData.grade}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Phone</p>
                <p className="text-lg font-bold text-gray-900">{maskPhoneNumber(assessmentData.studentData.mobile)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Completed Modules</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {completedModules.map(module => (
                  <span key={module} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    ✓ {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5 mb-6">
          <div className="flex gap-3 mb-4">
            <Lock size={24} className="text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 mb-1">Security Verification</p>
              <p className="text-sm text-gray-700">
                To protect your data, please re-enter the parent's mobile number used during registration.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Phone size={20} />
            </div>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
              maxLength={15}
            />
          </div>

          {verifyError && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{verifyError}</span>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Attempts remaining: {3 - verifyAttempts}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setShowVerification(false);
              setAssessmentData(null);
              setPhoneNumber('');
              setVerifyError('');
              setVerifyAttempts(0);
            }}
            className="flex-1 bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={handleVerifyPhone}
            disabled={verifyAttempts >= 3}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Verify & Continue
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Main ID entry screen
  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-6 sm:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Search size={32} className="text-purple-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Continue Your Learning Journey?
          </h2>
          <p className="text-gray-600">
            Have you completed an assessment before?
          </p>
        </div>

        {/* ID Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Assessment ID (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g., AS-5-43210XK"
            value={assessmentId}
            onChange={(e) => setAssessmentId(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all font-mono"
            maxLength={20}
          />
          
          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Hint Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">💡 Where to find your Assessment ID:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Check your PDF report from the previous assessment</li>
                <li>Look at the detailed image you downloaded</li>
                <li>It's written on the results page after completing an assessment</li>
              </ul>
              <p className="mt-2 text-xs text-blue-700">
                Format: <span className="font-mono font-bold">AS-5-43210XK</span> (Initials-Grade-Phone digits-Random letters)
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSkipClick}
            className="flex-1 bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
          >
            Skip (Start Fresh)
          </button>
          <button
            onClick={handleLookup}
            disabled={loading || !assessmentId.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Looking up...
              </>
            ) : (
              <>
                <Search size={20} />
                Find Assessment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Skip Warning Modal */}
      {showSkipWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Are You Sure?
              </h3>
              <div className="text-left bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <p className="text-gray-800 mb-3 font-semibold">
                  If you skip entering your Assessment ID:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>This will be a <strong>NEW</strong> assessment record</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Your previous module results <strong>won't be linked</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>You'll get a <strong>different Assessment ID</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Your progress <strong>won't be combined</strong></span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-blue-600 mb-6">
                💡 <strong>Tip:</strong> Check your PDF or detailed image from last time!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSkipWarning(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all"
                >
                  Go Back & Enter ID
                </button>
                <button
                  onClick={handleConfirmSkip}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Yes, Start Fresh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
