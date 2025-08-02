import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { auth, firestore } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import MenuBar from "./components/MenuBar";
import SubscriptionBanner from "./components/SubscriptionBanner";
import Footer from "./components/Footer/Footer.js"; // Import the Footer component

import { ToastContainer } from "react-toastify";

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

import DailySeriesPage from "./pages/DailySeriesPage";
import CookiePolicyPage from "./pages/CookiePolicyPage.js";
import CookieConsentBanner from "./components/CookieConsentBanner";
import SkillsImprovementPage from "./pages/SkillsImprovementPage";
//import EnhancedAssessmentComponent from "./components/QuestionDisplayCard";

import TestListeningSkills from "./pages/TestListeningSkills";

import ReadingRockStarGame_DeepSeek from "./pages/ReadingRockStar";
import ReadingRockStarGame_Claude from "./pages/ReadingRockStar_ClaudeAI";

import BattlesHub from "./components/BattlesHub";
import BattlePage from "./components/BattlePage";
import BattleControlCenter from "./components/BattleControlCenter";

import BattleDashboardPage from "./pages/BattleDashboard";
import BattleJoinCard from "./components/Battles/BattleJoinCard";

// Games
import EnglishSkillsBuildingGames from "./pages/EnglishSkillsBuildingGames";

import MagicSpellingCauldron from "./games/MagicSpellingCauldron";
import BalloonPopGame from "./games/BalloonPopGame";
import ListenAndMatchGame from "./games/ListenAndMatchGame";
import PunctuationAdventure from "./games/PunctuationAdventure.js";
import SHARPWordHunt from "./games/SHARPWordHunt";
import SpellingDuel from "./games/SpellingDuel";
import SuperHeroReadingAcademy from "./games/SuperHeroReadingAcademy";
import ShadowReadingRace from "./games/ShadowReadingRace";
import TongueTwisterShowdown from "./games/TongueTwisterShowdown";

import GrammarDetective from "./games/GrammarDetective";
import GrammarGalaxy from "./games/GrammarGalaxy";
import GrammarRestaurant from "./games/GrammarRestaurant";
import MasterOfAlphabet from "./games/MasterOfAlphabet";

import ReadingRockStar from "./games/ReadingRockStarGame";
import PronunciationPowerStar from "./games/PronunciationPowerStarGame";
import SHARPStylishStarGame from "./games/SHARPStylishStarGame";
import GrammarGlobalStarGame from "./games/GrammarGlobalStarGame";
import TenseTimeTravelGame from "./games/TenseTimeTravelGame";
import VocabularyVarietyStarGame from "./games/VocabularyVarietyStar";

import SpellingGame from "./games/SpellingGame";

import Battles from "./components/Battles.js";
import BattleJoinPage from "./components/Battles/BattleJoinPage";
import SpectatorScreen from "./components/Battles/SpectatorScreen";

import GamificationLevels from "./pages/GamificationLevels";

import ModulesIntro from "./pages/ModulesIntro";

import DictationMaster from "./pages/DictationMaster";
import DictationAssignmentApp from "./pages/DictationAssignmentApp";

import ChallengesPublisher from "./pages/DWMSChallenges/ChallengesPublisher";
import ChallengeParticipation from "./pages/ChallengeParticipation";

import AudioSpellingChallenger from "./pages/AudioSpellingChallenger";
import VisualVocabularyBuilder from "./pages/VisualVocabularyBuilder";
import GrammarPatternDetective from "./pages/GrammarPatternDetective";

import ReadingPassage from "./pages/FlashCards/Reading/ReadingPassage";
import ReadingWordsEmojis from "./pages/FlashCards/Reading/ReadingWordsEmojis";
import WordReadingChallenge from "./pages/WordReadingChallenge";

import WordSpeakingChallenge from "./pages/WordSpeakingChallenge";
import WordSeriesCard from "./pages/WordSeriesCard";

import TalentHub from "./pages/TalentHub";

// 1. Create and export the AuthContext
export const AuthContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
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

        {/* ToastContainer should be here — NOT inside <Routes> */}
        <ToastContainer position="top-right" autoClose={3000} />

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

          <Route path="/help-faq" element={<HelpFAQ />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/premium-subscription-promo"
            element={<PremiumSubscriptionPromo />}
          />
          <Route path="/signinrequiredhero" element={<SignInRequiredHero />} />
          <Route path="/offers-promotions" element={<OffersAndPromotions />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="*" element={<PageNotFound />} />

          <Route
            path="/english-skills-building-games/magic-spelling"
            element={<MagicSpellingCauldron />}
          />
          <Route
            path="/english-skills-building-games/ballon-pop-spelling"
            element={<BalloonPopGame />}
          />
          <Route
            path="/english-skills-building-games/punctuation-adventure"
            element={<PunctuationAdventure />}
          />
          <Route
            path="/english-skills-building-games/listen-and-match"
            element={<ListenAndMatchGame />}
          />
          <Route
            path="/english-skills-building-games/sharpwordhunt"
            element={<SHARPWordHunt />}
          />
          <Route
            path="/english-skills-building-games/storyscramble"
            element={<StoryScrambleGame />}
          />
          <Route
            path="/english-skills-building-games/spelling-duel"
            element={<SpellingDuel />}
          />

          <Route
            path="/english-skills-building-games/super-hero-reading-academy"
            element={<SuperHeroReadingAcademy />}
          />

          <Route
            path="/english-skills-building-games"
            element={<EnglishSkillsBuildingGames />}
          />

          <Route path="/daily-series" element={<DailySeriesPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />

          <Route
            path="/improve-english-language-skills"
            element={<SkillsImprovementPage />}
          />
          <Route
            path="/test-listening-skills"
            element={<TestListeningSkills />}
          />
          <Route
            path="/test-reading-skills"
            element={<ReadingRockStarGame_DeepSeek />}
          />

          <Route
            path="/test-reading-skills2"
            element={<ReadingRockStarGame_Claude />}
          />

          <Route path="/startbattles" element={<Battles />} />

          <Route path="/battles-hub" element={<BattlesHub />} />

          <Route path="/battles" element={<BattlePage />} />

          <Route path="/battleshub/admin" element={<BattleControlCenter />} />
          <Route path="/battle/:battleId" element={<Battles />} />
          <Route path="/battle-dashboard" element={<BattleDashboardPage />} />
          <Route
            path="/battle-dashboard/:battleId"
            element={<BattleDashboardPage />}
          />

          <Route path="/battle-join" element={<BattleJoinCard />} />

          <Route
            path="/english-skills-building-games/shadow-reading-race"
            element={<ShadowReadingRace />}
          />

          <Route
            path="/english-skills-building-games/tongue-twister-showdown"
            element={<TongueTwisterShowdown />}
          />

          <Route path="/battle/:battleId/join" element={<BattleJoinPage />} />

          <Route path="/watch-live/:battleId" element={<SpectatorScreen />} />

          <Route
            path="/english-skills-building-games/grammar-detective"
            element={<GrammarDetective />}
          />
          <Route
            path="/english-skills-building-games/grammar-galaxy"
            element={<GrammarGalaxy />}
          />
          <Route
            path="/english-skills-building-games/grammar-restaurant"
            element={<GrammarRestaurant />}
          />

          <Route
            path="/english-skills-building-games/master-of-alphabet"
            element={<MasterOfAlphabet />}
          />
          <Route
            path="/english-skills-building-games/reading-rockstar"
            element={<ReadingRockStar />}
          />

          <Route
            path="/english-skills-building-games/pronunciation-powerstar"
            element={<PronunciationPowerStar />}
          />

          <Route
            path="/english-skills-building-games/sharp-stylishstar"
            element={<SHARPStylishStarGame />}
          />
          <Route
            path="/english-skills-building-games/grammar-globalstar"
            element={<GrammarGlobalStarGame />}
          />
          <Route
            path="/english-skills-building-games/tense-time-travel"
            element={<TenseTimeTravelGame />}
          />
          <Route
            path="/english-skills-building-games/vocabulary-varietystar"
            element={<VocabularyVarietyStarGame />}
          />

          <Route path="/gamification-levels" element={<GamificationLevels />} />

          <Route path="/modules-intro" element={<ModulesIntro />} />

          <Route path="/dictation-master" element={<DictationMaster />} />
          <Route
            path="/audio-assignment"
            element={<DictationAssignmentApp />}
          />

          <Route
            path="/challenge-participation/:type/:moduleCategory"
            element={<ChallengeParticipation />}
          />

          <Route
            path="/challenge-publishing-dashboard"
            element={<ChallengesPublisher />}
          />

          <Route
            path="/english-skills-building-games/spelling-game"
            element={<SpellingGame />}
          />

          <Route
            path="/vocabulary-builder"
            element={<VisualVocabularyBuilder />}
          />
          <Route path="/audio-spelling" element={<AudioSpellingChallenger />} />
          <Route
            path="/grammar-pattern-detective"
            element={<GrammarPatternDetective />}
          />

          <Route path="/reading-passage" element={<ReadingPassage />} />
          <Route
            path="/reading-words-emojis"
            element={<ReadingWordsEmojis />}
          />

          <Route path="/word-reading-challenge" element={< WordReadingChallenge />}/>


<Route path="/word-speaking-challenge" element={< WordSpeakingChallenge />}/>
<Route path="/word-series-card" element={< WordSeriesCard />}/>
<Route path="/talent-hub" element={< TalentHub />}/>

        </Routes>

        <CookieConsentBanner />
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

// Separate component for the banner logic
function ConditionalBanner() {
  const location = useLocation();
  const excludedPaths = [
    "/signin",
    "/contact",
    "/signup",
    "/offers-promotions",
  ];

  const showBanner = !excludedPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return showBanner ? <SubscriptionBanner /> : null;
}

export default App;
