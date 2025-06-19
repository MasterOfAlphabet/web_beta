import React from "react";
import { useNavigate } from "react-router-dom";

export default function PremiumRequiredOverlay({ message, redirectTo = "/offers-promotions" }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 text-center relative">
        <h2 className="text-2xl font-bold text-red-600 mb-4">🔒 Premium Feature</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-semibold"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate(redirectTo)}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition font-semibold"
          >
            View Offers
          </button>
        </div>
      </div>
    </div>
  );
}
