import React from "react";

export default function CookiePolicyPage() {
  return (
    <div className="bg-white text-gray-800 px-4 md:px-12 py-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        🍪 Cookie Policy
      </h1>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. What Are Cookies?</h2>
          <p>
            Cookies are small data files stored on your device when you visit or use our app.
            They help enhance your experience by remembering preferences and enabling core features.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Types of Cookies We Use</h2>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Essential Cookies:</strong> Required for the app to function properly (e.g., login, security).
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand user behavior to improve performance.
            </li>
            <li>
              <strong>Functionality Cookies:</strong> Remember your preferences like class or avatar.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> (If used) Show you relevant offers and promotions.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Cookies</h2>
          <p>
            We use cookies to:
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>Keep you signed in</li>
              <li>Remember your preferences (e.g., class group)</li>
              <li>Show your progress, achievements, or unlocked badges</li>
              <li>Track usage and crash reports</li>
            </ul>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Managing Cookies</h2>
          <p>
            You can manage or delete cookies anytime via your browser settings:
          </p>
          <ul className="list-disc list-inside mt-2 ml-4">
            <li><strong>Chrome:</strong> Settings → Privacy → Site Settings → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy</li>
            <li><strong>Firefox:</strong> Preferences → Privacy & Security</li>
            <li><strong>Edge:</strong> Settings → Site permissions → Cookies</li>
          </ul>
          <p className="mt-2">
            Disabling cookies may affect the functionality of the app.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Cookies for Children</h2>
          <p>
            Master of Alphabet is for students. We do not collect personal cookie data from children directly. Any data stored is anonymized and used to enhance their learning experience securely.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">6. Updates to this Policy</h2>
          <p>
            This policy may be updated. If significant changes are made, users will be notified in-app.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            If you have questions or concerns:
            <br />
            <strong>Email:</strong> support@masterofalphabet.in
            <br />
            <strong>Phone:</strong> +91-XXXXXXXXXX
          </p>
        </div>
      </section>

      <div className="text-sm text-gray-500 mt-10 text-center">
        Last updated: June 21, 2025
      </div>
    </div>
  );
}
