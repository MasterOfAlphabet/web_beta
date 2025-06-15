
import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// import Navbar from "./components/Navbar";
import MenuBar from "./components/MenuBar";

import HomePage from "./pages/HomePage";
import ChallengesPage from "./pages/ChallengesPage";
import HubPage from "./pages/HubPage";
import SignInPage from "./pages/SignInPage.js";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/ContactPage";
import WinnersPage from "./pages/WinnersPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import SkillAssessmentPage from "./pages/SkillAssessmentPage";
import SkillAssessmentSpelling from './pages/SkillAssessmentSpelling';
import TestSpellingSkills from './pages/TestSpellingSkills';
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
import  SubscriptionBanner from "./components/SubscriptionBanner";

import StoryScrambleGame from "./games/StoryScrambleGame";

import SHARPWordHunt from "./games/SHARPWordHunt";

// Import other page components as you create them

// 1. Create and export the AuthContext
export const AuthContext = createContext();

function App() {

  const [loggedInUser, setLoggedInUser] = useState(null);

  return (

<AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
    <Router>
      <MenuBar />
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/hub" element={<HubPage />} />
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

        <Route path="/word-of-the-day" element={<WordOfTheDayCard/>} />

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

        {/* Add other routes here as you add the pages */}
      </Routes>
    </Router>
    </AuthContext.Provider>

  );
}

export default App;