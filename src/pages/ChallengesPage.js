import React, { useEffect, useState } from "react";
import { firestore, auth } from "../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Modal,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import StudentWelcomeSection from "../components/StudentWelcomeSection";

import SignInRequiredHeroOverlay from "../components/SignInRequiredHero";

import {
  BookOpen,
  Mic,
  Eye,
  PenTool,
  Headphones,
  Users,
  Zap,
  Target,
  Trophy,
  Award,
  Medal,
  BadgeCheck,
  Clock,
  Star,
  Play,
  Share2,
  Calendar,
  TrendingUp,
  Gift,
} from "lucide-react";

const CATEGORY_COLORS = {
  Dictation: "#FF7043",
  "Find the correct spelling": "#42A5F5",
  "Find the missing letter": "#66BB6A",
  Unscramble: "#FFA726",
  "Spell the pic": "#AB47BC",
  "Correct Spelling": "#EC407A",
  Spelling: "#EC407A",
  Reading: "#4CAF50",
  Writing: "#FF9800",
  Grammar: "#E91E63",
  Vocabulary: "#9C27B0",
  Pronunciation: "#673AB7",
  Listening: "#3F51B5",
};

export const SKILL_COLORS = {
  Rookie: "#4CAF50", // Green
  Racer: "#2196F3", // Blue
  Prodigy: "#FF9800", // Orange
  Master: "#9C27B0", // Purple
  Wizard: "#F44336", // Red
};

export const SKILL_ICONS = {
  Rookie: "🌟",
  Racer: "🏎️",
  Prodigy: "🧠",
  Master: "👑",
  Wizard: "🧙‍♂️",
};

function LanguageChallengesHero() {
  const modules = [
    {
      name: "Spelling",
      icon: <PenTool className="w-5 h-5" />,
      color: "bg-blue-500",
    },
    {
      name: "Reading",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      name: "Pronunciation",
      icon: <Mic className="w-5 h-5" />,
      color: "bg-purple-500",
    },
    {
      name: "Grammar",
      icon: <Target className="w-5 h-5" />,
      color: "bg-red-500",
    },
    {
      name: "Writing",
      icon: <PenTool className="w-5 h-5" />,
      color: "bg-yellow-500",
    },
    {
      name: "Listening",
      icon: <Headphones className="w-5 h-5" />,
      color: "bg-indigo-500",
    },
    {
      name: "Vocabulary",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-pink-500",
    },
    {
      name: "S.H.A.R.P",
      icon: <Zap className="w-5 h-5" />,
      color: "bg-orange-500",
    },
    {
      name: "All-in-One",
      icon: <Trophy className="w-5 h-5" />,
      color: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
  ];

  const rewards = [
    {
      name: "Awards",
      icon: <Award className="w-6 h-6" />,
      color: "text-yellow-400",
    },
    {
      name: "Prizes",
      icon: <Trophy className="w-6 h-6" />,
      color: "text-green-400",
    },
    {
      name: "Certificates",
      icon: <BadgeCheck className="w-6 h-6" />,
      color: "text-blue-400",
    },
    {
      name: "Medals",
      icon: <Medal className="w-6 h-6" />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-purple-700 py-16 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Master of <span className="text-yellow-400">Alphabet</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8">
          Challenges
        </h2>
        <p className="text-xl md:text-2xl text-white mb-4 font-medium">
          Test Your Language Skills and Win Exciting Rewards!
        </p>
        <p className="text-lg text-blue-100 mb-12 max-w-4xl mx-auto">
          Top performers receive special rewards. Weekly challenges with new
          opportunities to win!
        </p>
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-6">
            Challenge Modules
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {modules.map((module, index) => (
              <div
                key={module.name}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-xl ${module.color} flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {module.icon}
                </div>
                <span className="text-sm text-white font-medium group-hover:text-yellow-300 transition-colors">
                  {module.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            Earn Amazing Rewards
          </h3>
          <div className="flex justify-center gap-8 flex-wrap">
            {rewards.map((reward, index) => (
              <div
                key={reward.name}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:bg-white/20 transition-all duration-300 ${reward.color}`}
                >
                  {reward.icon}
                </div>
                <span className="text-sm text-white font-medium">
                  {reward.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Start Challenge Now
        </button>
      </div>
    </div>
  );
}

const isChallengeUpcoming = (challenge) => {
  const startTime = challenge.schedule?.start?.toDate
    ? challenge.schedule.start.toDate()
    : new Date(challenge.startTime?.seconds * 1000 || 0);
  return startTime > new Date();
};

const getTimeUntilStart = (challenge) => {
  const startTime = challenge.schedule?.start?.toDate
    ? challenge.schedule.start.toDate()
    : new Date(challenge.startTime?.seconds * 1000 || 0);
  const now = new Date();
  const diff = startTime - now;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

function ChallengeCard({ challenge, handleTakeChallenge, onShare, user }) {
  const categoryColor = CATEGORY_COLORS[challenge.category] || "#EC407A";
  const skillColor = SKILL_COLORS[challenge.skillLevel] || "#4CAF50";
  const skillIcon = SKILL_ICONS[challenge.skillLevel] || "🌟";

  const isUpcoming = isChallengeUpcoming(challenge);
  const timeUntilStart = isUpcoming ? getTimeUntilStart(challenge) : null;

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Hover state for epic interactions
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const endTime = challenge.schedule?.end?.toDate
        ? challenge.schedule.end.toDate()
        : new Date(challenge.endTime?.seconds * 1000 || 0);

      const now = new Date();
      const diff = endTime - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [challenge.schedule?.end, challenge.endTime]);

  return (
    <div
      className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)] transition-all duration-700 overflow-hidden border border-gray-100 transform hover:scale-[1.02] hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* EPIC HEADER - The Crown Jewel */}
      <div className="relative h-[320px] bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 overflow-hidden">
        {/* Dynamic Background Magic */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.4),transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.4),transparent_70%)] animate-pulse delay-1000"></div>

        {/* Floating Orbs - Pure Eye Candy */}
        <div
          className={`absolute top-6 right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-40 transition-all duration-1000 ${
            isHovered ? "scale-150 opacity-60" : ""
          }`}
        ></div>
        <div
          className={`absolute bottom-8 left-6 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-xl opacity-30 transition-all duration-1000 delay-300 ${
            isHovered ? "scale-125 opacity-50" : ""
          }`}
        ></div>
        <div
          className={`absolute top-20 left-1/2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-lg opacity-25 transition-all duration-1000 delay-500 ${
            isHovered ? "scale-110 opacity-40" : ""
          }`}
        ></div>

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/20"></div>

        {/* Header Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 pb-8 text-white">
          {/* Top Section - Challenge Meta */}
          <div className="flex items-start justify-between">
            {/* Left: Class Group with Glow */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-4 h-4 bg-blue-400 rounded-full"></div>
              </div>
              <div className="bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-lg">
                <span className="text-sm font-semibold text-white">
                  {challenge.classGroup || "All Classes"}
                </span>
              </div>
            </div>

            {/* Right: Challenge Type Badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-60"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                <span className="flex items-center space-x-1">
                  <span className="animate-bounce">⚡</span>
                  <span>{challenge.type || "Daily"} Challenge</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center Section - The Hero Area */}
          <div className="flex items-center justify-between">
            {/* Left: Module Icon - 3D Masterpiece */}
            <div className="relative group/icon">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl blur-2xl scale-110 opacity-0 group-hover/icon:opacity-100 transition-all duration-500"></div>
              <div
                className="relative w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl transform group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                  boxShadow: `0 20px 40px ${categoryColor}40, inset 0 2px 4px rgba(255,255,255,0.2)`,
                }}
              >
                <div className="absolute inset-2 bg-white/20 rounded-2xl"></div>
                <span className="relative z-10 drop-shadow-lg">
                  {challenge.moduleName?.charAt(0) || "S"}
                </span>
              </div>
            </div>

            {/* Right: Module Info */}
            <div className="flex-1 ml-6 text-right">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-2 transform group-hover:scale-105 transition-transform duration-300">
                {challenge.moduleName || "Language Challenge"}
              </h1>

              <div className="flex items-center justify-end space-x-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full shadow-lg"
                  style={{ backgroundColor: categoryColor }}
                ></div>
                <span className="text-lg text-purple-200 font-medium">
                  {challenge.moduleCategory || challenge.category || "General"}
                </span>
              </div>

              {/* Skill Level - Premium Badge */}
              <div className="flex items-center justify-end space-x-2">
                <span className="text-2xl animate-pulse">{skillIcon}</span>
                <div
                  className="px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg border-2"
                  style={{
                    backgroundColor: `${skillColor}20`,
                    color: skillColor,
                    borderColor: `${skillColor}60`,
                  }}
                >
                  {challenge.skillLevel}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Timer Spectacle */}
          <div className="mt-auto pt-4">
            <div className="bg-black/50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-300 text-sm font-semibold">
                    {isUpcoming ? "CHALLENGE STARTS IN" : "TIME REMAINING"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isUpcoming ? "bg-blue-400" : "bg-green-400"
                    }`}
                  ></div>
                  <span
                    className={`text-xs ${
                      isUpcoming ? "text-blue-300" : "text-green-300"
                    }`}
                  >
                    {isUpcoming ? "UPCOMING" : "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    value: isUpcoming ? timeUntilStart.days : timeLeft.days,
                    label: "Days",
                  },
                  {
                    value: isUpcoming ? timeUntilStart.hours : timeLeft.hours,
                    label: "Hours",
                  },
                  {
                    value: isUpcoming
                      ? timeUntilStart.minutes
                      : timeLeft.minutes,
                    label: "Min",
                  },
                  {
                    value: isUpcoming
                      ? timeUntilStart.seconds
                      : timeLeft.seconds,
                    label: "Sec",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white/10 rounded-lg p-2 text-center"
                  >
                    <div className="text-xl font-bold text-white">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-white/80 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Elegant Simplicity */}
      <div className="p-6 bg-gradient-to-b from-white to-gray-50">
        {/* Challenge Question */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">?</span>
            </div>
            Challenge Question
          </h4>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-l-4 border-gradient-to-b from-blue-500 to-purple-500 shadow-inner">
            <p className="text-gray-700 italic font-medium">
              "
              {challenge.questionText ||
                "Challenge question will be revealed when you start."}
              "
            </p>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200 shadow-sm">
            <div className="text-green-600 font-black text-2xl mb-1">
              {challenge.correctAnswers?.length || 1}
            </div>
            <div className="text-green-700 text-sm font-semibold">
              Correct Answers
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center border border-orange-200 shadow-sm">
            <div className="text-orange-600 font-black text-2xl mb-1">
              {challenge.totalOptions || 4}
            </div>
            <div className="text-orange-700 text-sm font-semibold">
              Total Options
            </div>
          </div>
        </div>
        {/* Rewards Section */}
        <div className="mb-6">
          <h5 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
            <Gift className="w-6 h-6 mr-2 text-purple-600" />
            Epic Rewards
          </h5>
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                icon: Trophy,
                label: "1st Prize",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Medal,
                label: "2nd Prize",
                color: "from-gray-400 to-gray-600",
              },
              {
                icon: Award,
                label: "3rd Prize",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: BadgeCheck,
                label: "Certificate",
                color: "from-blue-400 to-purple-500",
              },
            ].map((reward, index) => (
              <div key={reward.label} className="group/reward relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${reward.color} rounded-xl blur-lg opacity-30 group-hover/reward:opacity-50 transition-opacity duration-300`}
                ></div>
                <div className="relative bg-white rounded-xl p-3 text-center border border-gray-200 shadow-sm transform group-hover/reward:scale-105 transition-all duration-300">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${reward.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <reward.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-gray-700 font-semibold">
                    {reward.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => !isUpcoming && handleTakeChallenge(challenge)}
            className={`flex-1 relative group/btn overflow-hidden rounded-xl font-bold transition-all duration-500 ${
              isUpcoming
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:shadow-2xl transform hover:scale-105"
            } text-white shadow-lg`}
            disabled={isUpcoming}
          >
            <div className="relative flex items-center justify-center space-x-2 py-4 px-6">
              <Play className="w-5 h-5" />
              <span className="text-lg">
                {isUpcoming ? "Coming Soon - Stay Tuned!" : "Take Challenge"}
              </span>
            </div>
          </button>

          {/* Keep share button as is */}
          <button
            onClick={() => onShare(challenge)}
            className="relative group/share overflow-hidden flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/share:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer - Subtle Elegance */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                Created:{" "}
                {new Date(
                  challenge.createdAt?.seconds * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isUpcoming ? "bg-blue-400 animate-pulse" : "bg-green-400"
              }`}
            ></div>
            <span className="font-semibold">
              {isUpcoming ? "Upcoming Challenge" : "Active Challenge"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch challenges from /MoAChallenges/DWMSChallenges/Challenges
        const challengesRef = collection(
          firestore,
          "MoAChallenges",
          "DWMSChallenges",
          "Challenges"
        );
        const challengesSnapshot = await getDocs(challengesRef);

        const challengesData = [];
        challengesSnapshot.forEach((doc) => {
          const challengeData = {
            id: doc.id,
            ...doc.data(),
          };
          challengesData.push(challengeData);
        });

        // Fetch stats if available
        const statsRef = collection(firestore, "ChallengeStats");
        const statsQuery = query(statsRef, where("active", "==", true));
        const statsSnapshot = await getDocs(statsQuery);

        const statsData = {};
        statsSnapshot.forEach((doc) => {
          statsData[doc.id] = doc.data();
        });

        setChallenges(challengesData);
        setStats(statsData);
        console.log("Fetched challenges:", challengesData);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        setError("Failed to load challenges. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Add this utility function at the top of your ChallengesPage.js file
  const isChallengeExpired = (challenge) => {
    const endTime = challenge.schedule?.end?.toDate
      ? challenge.schedule.end.toDate()
      : new Date(challenge.endTime?.seconds * 1000 || 0);
    return endTime < new Date();
  };

  const handleTakeChallenge = async (challenge) => {
    try {
      // 1. Enhanced Authentication Check
      await auth.currentUser?.reload();
      const currentUser = auth.currentUser;

      if (!currentUser || currentUser.isAnonymous) {
        setShowOverlay(true);
        return;
      }

      // 2. Validate challenge object
      if (!challenge?.id) {
        throw new Error("Invalid challenge data");
      }

      // 3. Safely generate URL segments with fallbacks
      // Strict validation - throw error if any required field is missing
      if (!challenge.type) throw new Error("Challenge type is required");
      if (!challenge.moduleName) throw new Error("Module name is required");
      if (!challenge.moduleCategory)
        throw new Error("Module Category is required");

      // Generate URL segments - now guaranteed to have values
      const type = challenge.type.toLowerCase().replace(/\s+/g, "-");
      const module = challenge.moduleName.toLowerCase().replace(/\s+/g, "-");
      const category = challenge.moduleCategory
        .toLowerCase()
        .replace(/\s+/g, "-");

      // 4. Get challenge document
      const challengeDoc = await getDoc(
        doc(firestore, "MoAChallenges/DWMSChallenges/Challenges", challenge.id)
      );

      if (!challengeDoc.exists()) {
        throw new Error("Challenge not found");
      }

      // 5. Get question IDs with validation
      const questionIds = challengeDoc.data().questions || [];
      if (questionIds.length === 0) {
        throw new Error("This challenge has no questions yet");
      }

      // 6. Fetch questions with error handling
      const questionPromises = questionIds.map(async (questionId) => {
        if (!questionId) return null;

        try {
          const questionDoc = await getDoc(
            doc(firestore, "MoAChallenges/DWMSChallenges/Questions", questionId)
          );
          return questionDoc.exists() ? questionDoc.data() : null;
        } catch (error) {
          console.error(`Error fetching question ${questionId}:`, error);
          return null;
        }
      });

      const questionDocs = await Promise.all(questionPromises);
      const validQuestions = questionDocs.filter((q) => q !== null);

      if (validQuestions.length === 0) {
        throw new Error("No valid questions found for this challenge");
      }

      // 7. Transform questions to expected format
      const questions = validQuestions.map((doc, index) => ({
        id: questionIds[index],
        answerType: doc.answerType,
        questionType: doc.questionType,
        question: doc.questionText,
        options: doc.options || [],
        mediaUrl: doc.mediaUrl || null,
        shuffleOptions: doc.shuffleOptions !== false, // default true
      }));

      console.log(questions);

      // 8. Navigate with all required data
      navigate(`/challenge-participation/${type}/${module}-${category}`, {
        state: {
          challengeData: {
            studentId: currentUser.uid,
            challengeId: challenge.id,
            questions,
            title: challenge.title,
            type: challenge.type,
            category: challenge.moduleCategory,
            difficulty: challenge.difficultyLevel,
            moduleName: challenge.moduleName,
          },
        },
      });
    } catch (error) {
      console.error("Challenge Error:", {
        error: error.message,
        challengeId: challenge?.id,
        user: auth.currentUser?.uid,
      });

      // User-friendly error message
      const errorMessage = error.message.includes("not found")
        ? "This challenge is no longer available"
        : `Unable to start challenge: ${error.message}`;

      alert(errorMessage);
      navigate("/challenges", { replace: true });
    }
  };

  const handleShareChallenge = (challenge) => {
    const text = encodeURIComponent(
      `Check out this ${challenge.category} challenge for ${challenge.classGroup}! "${challenge.questionText}" - Try it on Master of Alphabet!`
    );
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank");
  };

  // Then modify the groupedChallenges calculation to filter out expired challenges
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    if (isChallengeExpired(challenge)) return acc; // Skip expired challenges

    const group = challenge.classGroup || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(challenge);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CircularProgress size={60} className="text-purple-600" />
          <p className="mt-4 text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Challenges
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-blue-50 py-4">
        <StudentWelcomeSection />
      </div>

      {/* Hero Section */}
      <LanguageChallengesHero />

      {/* Challenges Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {Object.keys(groupedChallenges).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              {challenges.length > 0
                ? "No Active Challenges Available"
                : "No Challenges Available"}
            </h3>
            <p className="text-gray-500">
              {challenges.length > 0
                ? "All current challenges have expired. Check back soon for new challenges!"
                : "Check back later for new challenges!"}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Available Challenges
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our collection of exciting challenges designed to
                test and improve your language skills
              </p>
            </div>
            {Object.entries(groupedChallenges).map(
              ([classGroup, classGroupChallenges]) => (
                <div key={classGroup}>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {classGroup}
                    </h3>
                    <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-24"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classGroupChallenges.map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        handleTakeChallenge={handleTakeChallenge}
                        onShare={handleShareChallenge}
                        user={user}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {console.log("Overlay state:", showOverlay)} {/* Debug log */}
        {showOverlay && (
          <SignInRequiredHeroOverlay
            message="Please sign in to take this challenge!"
            onClose={() => setShowOverlay(false)}
          />
        )}
        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Start Your Challenge Journey?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of students competing in daily, weekly, and monthly
            challenges!
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Get Premium Access
          </button>
        </div>
      </div>
    </div>
  );
}
