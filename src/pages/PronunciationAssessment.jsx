import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PronunciationAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const studentData = location.state?.studentData || {};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🎤</div>
        <h1 className="text-4xl font-black text-gray-900 mb-3">
          Pronunciation Assessment
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Coming Soon!
        </p>
        <p className="text-gray-500 mb-8">
          This module is currently under development.
        </p>
        <button
          onClick={() => navigate("/module-selection", { state: { studentData } })}
          className="bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all"
        >
          Back to Module Selection
        </button>
      </div>
    </div>
  );
}
