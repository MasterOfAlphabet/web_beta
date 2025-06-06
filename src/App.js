import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ChallengesPage from "./pages/ChallengesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;