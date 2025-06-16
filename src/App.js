import React, { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { Button, Box } from "@mui/material";

// import Navbar from "./components/Navbar";
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

// Import other page components as you create them

// 1. Create and export the AuthContext
export const AuthContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

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
          <Route
            path="/skill-assessment/spelling"
            element={<SkillAssessmentSpelling />}
          />
          <Route
            path="/test-spelling-skills"
            element={<TestSpellingSkills />}
          />

          <Route path="/challenges" element={<ChallengesPage />} />
          <Route
            path="/challenge/:type"
            element={<ChallengeSubmissionPage />}
          />
          <Route
            path="/challenge/thank-you"
            element={<ChallengeThankYouPage />}
          />

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

          <Route
            path="/pronunciation-practice"
            element={<PronunciationTool />}
          />

          <Route path="/games/storyscramble" element={<StoryScrambleGame />} />

          <Route path="/games/sharpwordhunt" element={<SHARPWordHunt />} />

          <Route path="/help-faq" element={<HelpFAQ />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="*" element={<PageNotFound />} />

          <Route
            path="/premium-subscription-promo"
            element={<PremiumSubscriptionPromo />}
          />

          <Route path="/signinrequiredhero" element={<SignInRequiredHero />} />

          <Route
            path="/offers-promotions"
            element={<OffersAndPromotions />}
          />
        </Routes>
        <Footer /> {/* Add Footer here */}
        <ResultShareCardWithControls
          name="Aanya Sharma"
          classLevel="IV"
          school="MPS"
          city="Bangalore"
          score={22}
          total={24}
          avatar="🧑‍🎓"
          badge="Spelling Star 🏆"
          level="Master"
          module="Spelling Assessment"
          resultText="Outstanding!"
          summary={[
            { label: "Dictation", value: "4/4" },
            { label: "MCQ", value: "4/4" },
            { label: "Missing Letter", value: "4/4" },
            { label: "Unscramble", value: "4/4" },
            { label: "Pic", value: "3/4" },
          ]}
          showControls={true}
        />
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
