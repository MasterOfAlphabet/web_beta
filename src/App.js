
import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ChallengesPage from "./pages/ChallengesPage";
import HubPage from "./pages/HubPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/ContactPage";
import WinnersPage from "./pages/WinnersPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import SkillAssessmentPage from "./pages/SkillAssessmentPage";
import SkillAssessmentSpelling from './pages/SkillAssessmentSpelling';
import TestSpellingSkills from './pages/TestSpellingSkills';

import ChallengeAttemptPage from "./pages/ChallengeAttemptPage";
import ChallengeSubmissionPage from "./pages/ChallengeSubmissionPage";

// Import other page components as you create them

// 1. Create and export the AuthContext
export const AuthContext = createContext();

function App() {

  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
<AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/hub" element={<HubPage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

         <Route path="/winners" element={<WinnersPage />} />

         <Route path="/contact" element={<ContactPage />} />
         <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/leaderboards" element={<LeaderboardsPage />} />

        <Route path="/skill-assessment" element={<SkillAssessmentPage />} />

        <Route path="/skill-assessment/spelling" element={<SkillAssessmentSpelling />} />

 <Route path="/test-spelling-skills" element={<TestSpellingSkills />} />

 <Route path="/challenge/:groupId" element={<ChallengeAttemptPage />} />
 <Route path="/challenge/:groupId/submit" element={<ChallengeSubmissionPage />} />

        {/* Add other routes here as you add the pages */}
      </Routes>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;