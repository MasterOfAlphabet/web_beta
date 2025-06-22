// components/CookieSettingsModal.js
import React, { useState } from "react";

export default function CookieSettingsModal({ onClose, onConsentSaved }) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    }));
    onConsentSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">🍪 Manage Cookie Preferences</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="bg-gray-100 p-3 rounded">
            <strong>Essential Cookies</strong> (Always Active)
            <p className="text-xs text-gray-500">
              Required for the app to function (e.g., login, security, navigation).
            </p>
          </div>

          <label className="flex justify-between items-center">
            <span>
              <strong>Analytics Cookies</strong>
              <p className="text-xs text-gray-500">Improve app performance with usage stats.</p>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={() => setAnalytics(!analytics)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </label>

          <label className="flex justify-between items-center">
            <span>
              <strong>Marketing Cookies</strong>
              <p className="text-xs text-gray-500">Personalized offers and promotions.</p>
            </span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={() => setMarketing(!marketing)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
