import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FullDiagnosticAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const studentData = location.state?.studentData || {};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl mb-6">👑</div>
        <h1 className="text-4xl font-black text-gray-900 mb-3">
          Full Diagnostic Assessment
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Coming Soon!
        </p>
        <p className="text-gray-500 mb-8">
          This comprehensive assessment covering all 8 modules is currently under development.
        </p>
        <button
          onClick={() => navigate("/module-selection", { state: { studentData } })}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:scale-105 transition-all"
        >
          Back to Module Selection
        </button>
      </div>
    </div>
  );
}
