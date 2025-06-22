// components/CookieConsentBanner.js
import React, { useEffect, useState } from "react";
import CookieSettingsModal from "./CookieSettingsModal";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleRejectAll = () => {
  // Store that all non-essential cookies are rejected
  localStorage.setItem('cookieConsent', JSON.stringify({
    analytics: false,
    marketing: false,
    functional: false,
    essential: true,
  }));
  setShowBanner(false);
};

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const handleOpenSettings = () => {
    setShowModal(true);
  };

  const handleCloseSettings = () => {
    setShowModal(false);
  };

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-300 shadow-md p-4 z-50">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-700">
              🍪 We use cookies to improve your experience. By continuing, you agree to our{" "}
              <a href="/cookie-policy" className="underline text-blue-600 font-medium">Cookie Policy</a>.
            </p>
            <div className="flex gap-2">
                <button
    onClick={handleRejectAll}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
  >
    Reject All
  </button>

              <button
                onClick={handleAcceptAll}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Accept All
              </button>
              <button
                onClick={handleOpenSettings}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                Cookie Settings
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <CookieSettingsModal onClose={handleCloseSettings} onConsentSaved={() => setShowBanner(false)} />
      )}
    </>
  );
}
