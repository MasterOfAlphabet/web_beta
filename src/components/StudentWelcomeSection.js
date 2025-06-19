import React, { useEffect, useState } from "react";
import { Crown, Star, Gift, Clock, Zap } from "lucide-react";

import SignInRequiredHero from "./SignInRequiredHero";

const StudentWelcomeSection = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const cachedUser = localStorage.getItem("studentUser");
    if (cachedUser) {
      try {
        setUserInfo(JSON.parse(cachedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
      }
    }
  }, []);

if (!userInfo) {
  return (
    <div className="w-full bg-gradient-to-r from-rose-50 to-pink-100 py-8 px-4 sm:px-8 text-center border-b border-pink-200 shadow">
      <h2 className="text-xl sm:text-2xl font-semibold text-rose-600 mb-3">
        🚫 You must log in to access challenges and track your progress!
      </h2>
      <p className="text-gray-700 mb-5">
        Sign in or create a new account to unlock your personalized dashboard, assessments, and rewards.
      </p>

      <div className="flex justify-center gap-4">
        <a
          href="/signin"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
        >
          🔑 Sign In
        </a>
        <a
          href="/signup"
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
        >
          🚀 Create Account
        </a>
      </div>

      {/* Optional: Overlay animation */}
      <div className="mt-6">
        <div className="max-w-2xl mx-auto">
          {/* Import and render your existing component */}
           {/* <SignInRequiredHero redirectTo="/challenges" /> */}
        </div>
      </div>
    </div>
  );
}

  const isPremium = userInfo.subscriptionType === "premium";
  const isTrial = userInfo.subscriptionType === "trial";

  const getStatusBadge = () => {
    if (isPremium) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium bg-yellow-500 text-white rounded-full">
          <Crown className="w-4 h-4" />
          Premium
        </span>
      );
    }
    if (isTrial) {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1 text-sm font-medium bg-blue-600 text-white rounded-full">
          <Star className="w-4 h-4" />
          Trial
        </span>
      );
    }
    return null;
  };

  const getPremiumMessage = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
      <div className="flex gap-3">
        <Clock className="w-6 h-6 text-yellow-600 mt-1" />
        <div>
          <p className="text-yellow-800 font-semibold">
            Your premium access expires in <strong>{userInfo.daysRemaining}</strong> days.
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Renew now to retain your achievements, progress, badges and learning streaks.
          </p>
        </div>
      </div>
    </div>
  );

  const getTrialMessage = () => (
    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-lg mb-4">
      <div className="flex gap-3">
        <Zap className="w-6 h-6 text-indigo-500 mt-1" />
        <div>
          <p className="text-indigo-800 font-semibold">
            You're using a trial account!
          </p>
          <p className="text-indigo-700 text-sm mt-1">
            Upgrade to unlock all 9 modules, participate in challenges, track your performance,
            and access full-featured assessments.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-sky-50 via-white to-sky-100 border-b shadow-sm py-6 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 w-full">
      {/* Welcome Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Welcome, {userInfo.name || "Student"}!
        </h1>

        {/* Subscription info inline */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-700 font-medium">
          <span>Subscription Type:</span> {getStatusBadge()}
          {isPremium && (
            <>
              <span>Days Remaining:</span>
              <span className="font-semibold text-green-700">
                {userInfo.daysRemaining}
              </span>
            </>
          )}
          {isTrial && (
            <>
              <span>Status:</span>
              <span className="font-semibold text-blue-600 capitalize">
                Active
              </span>
            </>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="mb-6">
        {isPremium ? getPremiumMessage() : getTrialMessage()}
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-md hover:shadow-xl transition duration-300"
          onClick={() => window.location.href = "/offers-promotions"}
        >
          <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          Current Offers & Promotions
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            !
          </span>
        </button>
      </div>
    </div>
  );
};

export default StudentWelcomeSection;
