import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  Building2,
  Users,
  Hash,
  Edit,
  ArrowRight,
  CheckCircle,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { 
  generateUniqueAssessmentId,
  saveRegistrationData 
} from "../services/assessmentService";

export default function RegistrationSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get registration data from navigation state
  const registrationData = location.state?.registrationData || {};
  const userType = location.state?.userType || "parent"; // 'parent' or 'school'

  const [saving, setSaving] = useState(false);

  // If no data, redirect to registration
  if (!registrationData.fullName) {
    navigate(userType === "school" ? "/schools/register" : "/register");
    return null;
  }

  const handleEdit = () => {
    navigate(userType === "school" ? "/schools/register" : "/register", {
      state: { editData: registrationData }
    });
  };

  const handleModuleSelection = async () => {
    setSaving(true);
    
    try {
      // TOUCH POINT 1: Generate Assessment ID and save registration data
      const assessmentId = await generateUniqueAssessmentId(
        registrationData.fullName,
        registrationData.grade,
        registrationData.mobile
      );
      
      console.log('Generated Assessment ID:', assessmentId);
      
      // Save to Firebase
      const result = await saveRegistrationData(assessmentId, {
        studentData: registrationData,
        userType
      });
      
      if (!result.success) {
        console.error('Failed to save registration:', result.error);
        // Continue anyway - don't block user
      }
      
      // Navigate to module selection with Assessment ID
      navigate("/module-selection", {
        state: { 
          studentData: {
            ...registrationData,
            assessmentId // Add Assessment ID to student data
          },
          userType 
        }
      });
      
    } catch (error) {
      console.error('Error in handleModuleSelection:', error);
      // Continue anyway - don't block user
      navigate("/module-selection", {
        state: { 
          studentData: registrationData,
          userType 
        }
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl shadow-green-500/50 mb-4 animate-bounce">
            <CheckCircle size={48} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Registration Complete! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Review your details before starting the assessment
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-purple-100 p-6 sm:p-10 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Registration Summary
            </h2>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold transition-colors"
            >
              <Edit size={20} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Student Name */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-600 rounded-lg p-2">
                  <User size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Student Name</span>
              </div>
              <p className="text-xl font-black text-gray-900 ml-11">
                {registrationData.fullName}
              </p>
            </div>

            {/* Grade */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 rounded-lg p-2">
                  <GraduationCap size={20} className="text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Grade</span>
              </div>
              <p className="text-xl font-black text-gray-900 ml-11">
                Grade {registrationData.grade}
              </p>
            </div>

            {/* Conditional Fields based on userType */}
            {userType === "parent" ? (
              <>
                {/* Parent Mobile */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-600 rounded-lg p-2">
                      <Phone size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Parent's Mobile</span>
                  </div>
                  <div className="flex items-center gap-2 ml-11">
                    <p className="text-xl font-black text-gray-900">
                      {registrationData.mobile}
                    </p>
                    {registrationData.whatsapp && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        <MessageCircle size={12} className="inline mr-1" />
                        WhatsApp
                      </span>
                    )}
                  </div>
                </div>

                {/* Parent Email (if provided) */}
                {registrationData.email && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-orange-600 rounded-lg p-2">
                        <Mail size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Parent's Email</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 ml-11 break-all">
                      {registrationData.email}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* School Name */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-4 border-2 border-indigo-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-600 rounded-lg p-2">
                      <Building2 size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">School Name</span>
                  </div>
                  <p className="text-xl font-black text-gray-900 ml-11">
                    {registrationData.schoolName}
                  </p>
                </div>

                {/* Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-4 border-2 border-teal-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-teal-600 rounded-lg p-2">
                        <Users size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Section</span>
                    </div>
                    <p className="text-xl font-black text-gray-900 ml-11">
                      {registrationData.section}
                    </p>
                  </div>

                  {/* Roll Number (if provided) */}
                  {registrationData.rollNumber && (
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border-2 border-pink-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-pink-600 rounded-lg p-2">
                          <Hash size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Roll #</span>
                      </div>
                      <p className="text-xl font-black text-gray-900 ml-11">
                        {registrationData.rollNumber}
                      </p>
                    </div>
                  )}
                </div>

                {/* Email (if provided) */}
                {registrationData.email && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-orange-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-orange-600 rounded-lg p-2">
                        <Mail size={20} className="text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Email</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 ml-11 break-all">
                      {registrationData.email}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5">
            <div className="flex gap-4">
              <BarChart3 size={24} className="text-blue-600 flex-shrink-0 mt-1" strokeWidth={2.5} />
              <div className="text-sm text-gray-800 leading-relaxed">
                <p className="font-black text-blue-900 mb-3">📋 What Happens Next:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>Choose a <strong>module to practice</strong> (Spelling, Reading, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>Complete <strong>module assessment</strong> (30 questions, 60-90 min)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    <span>Receive <strong>instant skill level</strong> and detailed report</span>
                  </li>
                  {userType === "parent" && (
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" strokeWidth={3} />
                      <span>Optional: <strong>Add ranking details</strong> to see leaderboard position</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleEdit}
              className="flex-1 bg-gray-100 text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 border-2 border-gray-200 flex items-center justify-center gap-2"
            >
              <Edit size={24} strokeWidth={2.5} />
              Edit Details
            </button>

            <button
              onClick={handleModuleSelection}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg px-8 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <BarChart3 size={24} strokeWidth={2.5} />
                  Select Module for Assessment
                  <ArrowRight size={24} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            ⏱️ Assessments take 60-90 minutes • Can be paused and resumed
          </p>
        </div>
      </div>
    </div>
  );
}
