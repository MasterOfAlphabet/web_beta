import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { auth, firestore } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import MenuBar from "./components/MenuBar";
import SubscriptionBanner from "./components/SubscriptionBanner";
import Footer from "./components/Footer/Footer.js"; // Import the Footer component

import HomePage from "./pages/HomePage";
import ChallengesPage from "./pages/ChallengesPage";
import SkillsHubPage from "./pages/SkillsHubPage";
import SignInPage from "./pages/SignInPage.js";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/ContactPage";
import WinnersPage from "./pages/WinnersPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import SkillAssessmentPage from "./pages/SkillAssessmentPage";
import SkillAssessmentSpelling from "./pages/SkillAssessmentSpelling";
import TestSpellingSkills from "./pages/TestSpellingSkills";
import ChallengeSubmissionPage from "./pages/ChallengeSubmissionPage";
import ChallengeThankYouPage from "./pages/ChallengeThankYouPage";
import WordOfTheDayCard from "./pages/WordOfTheDayCard";
import SpellingPage from "./pages/SpellingPage";
import ReadingPage from "./pages/ReadingPage";
import PronunciationPage from "./pages/PronunciationPage";
import GrammarPage from "./pages/GrammarPage";
import WritingPage from "./pages/WritingPage";
import ListeningPage from "./pages/ListeningPage";
import VocabularyPage from "./pages/VocabularyPage";
import SharpPage from "./pages/SharpPage";
import EightInOnePage from "./pages/EightInOnePage";
import SkillSpotlightPage from "./pages/SkillSpotlightPage.tsx";
import PronunciationTool from "./components/PronunciationTool";
import StoryScrambleGame from "./games/StoryScrambleGame";
import SHARPWordHunt from "./games/SHARPWordHunt";
import HelpFAQ from "./pages/HelpFAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PageNotFound from "./pages/PageNotFound";
import PremiumSubscriptionPromo from "./components/PremiumSubscriptionPromo";
import SignInRequiredHero from "./components/SignInRequiredHero";
import ResultShareDemo from "./pages/ResultShareDemo";
import ResultShareCardWithControls from "./components/ResultShareCardWithControls";
import OffersAndPromotions from "./pages/OffersAndPromotions";

import ProfilePage from "./pages/ProfilePage";

import CARESTestSpellingSkills from './components/CARES/pages/TestAssessment.js';

import MagicSpellingCauldron from './games/MagicSpellingCauldron';

import BalloonPopGame from './games/BalloonPopGame';

             import ListenAndMatchGame from './games/ListenAndMatchGame';

// 1. Create and export the AuthContext
export const AuthContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Step 1: Check localStorage
    const storedUser = localStorage.getItem("studentUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setLoggedInUser(parsed);
        setAuthLoading(false);
      } catch (e) {
        localStorage.removeItem("studentUser");
      }
    }

    // Step 2: Firebase session check (login/logout)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        localStorage.removeItem("studentUser");
        setLoggedInUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const studentRef = doc(firestore, "students", user.uid);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          setLoggedInUser(null);
          setAuthLoading(false);
          return;
        }

        const studentData = studentSnap.data();
        const {
          name,
          class: classLevel,
          gender,
          email,
          city,
          district,
          state,
          school,
          subscriptionStatus = "inactive",
          subscriptionType = "trial",
          daysRemaining = null,
          ...rest
        } = studentData;

        const userInfo = {
          uid: user.uid,
          email: user.email,
          role: "student",
          name,
          class: classLevel,
          gender,
          city,
          district,
          state,
          school,
          subscriptionStatus,
          subscriptionType,
          daysRemaining,
          ...rest,
        };

        setLoggedInUser(userInfo);
        localStorage.setItem("studentUser", JSON.stringify(userInfo));
      } catch (err) {
        console.error("Failed to fetch student profile", err);
        setLoggedInUser(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div className="text-xl font-semibold text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <Router>
        <MenuBar />
        <ConditionalBanner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills-hub" element={<SkillsHubPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/winners" element={<WinnersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/skill-assessment" element={<SkillAssessmentPage />} />
          <Route path="/skill-assessment/spelling" element={<SkillAssessmentSpelling />} />
          <Route path="/test-spelling-skills" element={<TestSpellingSkills />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenge/:type" element={<ChallengeSubmissionPage />} />
          <Route path="/challenge/thank-you" element={<ChallengeThankYouPage />} />
          <Route path="/word-of-the-day" element={<WordOfTheDayCard />} />
          <Route path="/spelling" element={<SpellingPage />} />
          <Route path="/Reading" element={<ReadingPage />} />
          <Route path="/pronunciation" element={<PronunciationPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/listening" element={<ListeningPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/sharp" element={<SharpPage />} />
          <Route path="/all-modules" element={<EightInOnePage />} />
          <Route path="/skill-spotlight" element={<SkillSpotlightPage />} />
          <Route path="/pronunciation-practice" element={<PronunciationTool />} />
          <Route path="/games/storyscramble" element={<StoryScrambleGame />} />
          <Route path="/games/sharpwordhunt" element={<SHARPWordHunt />} />
          <Route path="/help-faq" element={<HelpFAQ />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/premium-subscription-promo" element={<PremiumSubscriptionPromo />} />
          <Route path="/signinrequiredhero" element={<SignInRequiredHero />} />
          <Route path="/offers-promotions" element={<OffersAndPromotions />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/CARES/TestSpellingSkills" element={<CARESTestSpellingSkills />} />
          <Route path="*" element={<PageNotFound />} />
             <Route path="/games/magic-spelling" element={<MagicSpellingCauldron />} />
             <Route path="/games/ballon-pop-spelling" element={<BalloonPopGame />} />

<Route path="/games/listen-and-match" element={<ListenAndMatchGame />} />




                   
        </Routes>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

// Separate component for the banner logic
function ConditionalBanner() {
  const location = useLocation();
  const excludedPaths = ["/signin", "/contact", "/signup", "/offers-promotions"];

  const showBanner = !excludedPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return showBanner ? <SubscriptionBanner /> : null;
}

export default App;