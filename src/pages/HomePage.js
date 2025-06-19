import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Button,
  Card,
  Avatar,
} from "@mui/material";
import {
  Award,
  Trophy,
  Users,
  PenTool,
  BookOpen,
  Mic,
  Eye,
  Lightbulb,
  MessageCircle,
  Volume2,
  FileText,
} from "lucide-react";
import {
  EmojiEvents as EmojiEventsIcon,
  Campaign as CampaignIcon,
  Checklist as ChecklistIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  Bolt as BoltIcon,
  EmojiObjects as EmojiObjectsIcon,
  School as SchoolIcon,
  Today as TodayIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Book as BookIcon,
  EditNote as EditNoteIcon,
  Quiz as QuizIcon,
  SportsKabaddi as SportsKabaddiIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  FiberManualRecord as FiberManualRecordIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import trophyImage from '../assets/StudentHoldingTrophy.png';

// If you have an AuthContext, use it for personalization
// import { AuthContext } from "../App";

const skillTips = [
  {
    module: "Spelling",
    tip: "Break long words into smaller parts to spell them easily.",
    icon: <EmojiObjectsIcon color="primary" />,
  },
  {
    module: "Reading",
    tip: "Underline unfamiliar words and look them up after reading.",
    icon: <TodayIcon color="success" />,
  },
  {
    module: "Pronunciation",
    tip: "Practice tongue twisters to improve your pronunciation.",
    icon: <BoltIcon color="secondary" />,
  },
  {
    module: "Grammar",
    tip: "Remember: 'a' before consonant sounds, 'an' before vowel sounds.",
    icon: <EmojiObjectsIcon color="secondary" />,
  },
  {
    module: "Writing",
    tip: "Start your essay with a strong opening sentence.",
    icon: <SchoolIcon color="primary" />,
  },
  {
    module: "Listening",
    tip: "Listen for key words to understand the main idea.",
    icon: <BoltIcon color="warning" />,
  },
  {
    module: "Vocabulary",
    tip: "Use new words in sentences to remember them better.",
    icon: <EmojiObjectsIcon color="success" />,
  },
  {
    module: "S.H.A.R.P",
    tip: "Homonyms are words that sound alike but have different meanings.",
    icon: <BoltIcon color="info" />,
  },
];

const tasks = [
  { text: "Take a Spelling Test", done: false, path: "/spelling" },
  { text: "Practice Reading Skills", done: false, path: "/reading" },
  { text: "Complete today's Word of the Day", done: true, path: "/word-of-the-day" },
];

const announcements = [
  {
    title: "June Challenge Winners!",
    text: "Congratulations to Aanya, Veer, and Riya for topping our June Spelling Challenge!",
    icon: <EmojiEventsIcon color="warning" />,
    date: "2025-06-05",
  },
  {
    title: "S.H.A.R.P. Challenge Announced!",
    text: "Participate now to win exciting prizes!",
    icon: <CampaignIcon color="primary" />,
    date: "2025-06-07",
  },
];

const updates = [
  {
    text: "10 new Grammar Test questions added for Class VI-X.",
    date: "2025-06-06",
  },
  {
    text: "Word of the Day: 'Serendipity' - the occurrence of happy events by chance.",
    date: "2025-06-07",
  },
  {
    text: "New Listening Practice set for Class III-V.",
    date: "2025-06-04",
  },
];

const modules = [
  { label: "Spelling", icon: <EmojiObjectsIcon color="primary" />, path: "/spelling" },
  { label: "Reading", icon: <BookIcon color="success" />, path: "/reading" },
  { label: "Grammar", icon: <EditNoteIcon color="secondary" />, path: "/grammar" },
  { label: "Writing", icon: <SchoolIcon color="primary" />, path: "/writing" },
  { label: "Listening", icon: <BoltIcon color="warning" />, path: "/listening" },
  { label: "Pronunciation", icon: <RecordVoiceOverIcon color="info" />, path: "/pronunciation" },
  { label: "Vocabulary", icon: <QuizIcon color="error" />, path: "/vocabulary" },
  { label: "S.H.A.R.P", icon: <WorkspacePremiumIcon color="secondary" />, path: "/sharp" },
  { label: "8-In-1", icon: <WorkspacePremiumIcon color="secondary" />, path: "/all-modules" },
];

const improveSkills = [
  { label: "Learn", icon: <BookIcon />, color: "primary", path: "/learn" },
  { label: "Practice", icon: <EditNoteIcon />, color: "success", path: "/practice" },
  { label: "Test", icon: <QuizIcon />, color: "warning", path: "/test" },
  { label: "Battles", icon: <SportsKabaddiIcon />, color: "secondary", path: "/battles" },
  { label: "Challenges", icon: <EmojiEventsIcon />, color: "error", path: "/challenges" },
];

// --- Reusable Section ---
function SectionPaper({ title, icon, children, sx, ...props }) {
  return (
    <Paper
      component="section"
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        mb: 4,
        ...sx,
      }}
      {...props}
      aria-label={title}
    >
      {(title || icon) && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          {icon}
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ ml: icon ? 1 : 0, color: "#2d3748", textAlign: "center" }}
          >
            {title}
          </Typography>
        </Box>
      )}
      {children}
    </Paper>
  );
}

function TaskList({ tasks, navigate }) {
  if (!tasks || tasks.length === 0)
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Nothing to do! Explore modules to get started.
      </Typography>
    );
  return (
    <Stack spacing={1.5}>
      {tasks.map((task, idx) => (
        <Box
          key={idx}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: !task.done ? "pointer" : "default",
            opacity: task.done ? 0.6 : 1,
            "&:hover": !task.done ? { background: "#f5f5f5" } : {},
            borderRadius: 1,
            px: !task.done ? 1 : 0,
          }}
          tabIndex={!task.done ? 0 : -1}
          role="button"
          aria-label={task.text}
          onClick={() => (!task.done && task.path ? navigate(task.path) : null)}
          onKeyDown={e => {
            if (!task.done && (e.key === "Enter" || e.key === " ")) {
              navigate(task.path);
            }
          }}
        >
          {task.done ? (
            <CheckCircleIcon sx={{ color: "success.main", mr: 1.5, flexShrink: 0 }} />
          ) : (
            <Box
              sx={{
                width: 24,
                height: 24,
                border: "1px solid",
                borderColor: "grey.400",
                borderRadius: "4px",
                mr: 1.5,
                flexShrink: 0,
                background: "#fff",
              }}
            />
          )}
          <Typography
            fontWeight={task.done ? 400 : 600}
            sx={
              task.done
                ? { color: "grey.600", textDecoration: "line-through" }
                : undefined
            }
          >
            {task.text}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function AnnouncementList({ announcements }) {
  if (!announcements || announcements.length === 0)
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        No announcements at this time.
      </Typography>
    );
  return (
    <Stack spacing={2}>
      {announcements.map((a, idx) => (
        <Box
          key={idx}
          sx={{
            borderLeft: "3px solid",
            borderColor: "warning.main",
            pl: 1.5,
            py: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {a.icon}
            <Typography fontWeight={700} fontSize={14}>
              {a.title}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {a.date}
          </Typography>
          <Typography fontSize={13} sx={{ mt: 0.5, wordBreak: "break-word", whiteSpace: "normal" }}>
            {a.text}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

function UpdateList({ updates }) {
  if (!updates || updates.length === 0)
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        No recent updates.
      </Typography>
    );
  return (
    <Stack spacing={2}>
      {updates.map((u, idx) => (
        <Box key={idx} sx={{ display: "flex" }}>
          <FiberManualRecordIcon
            sx={{
              fontSize: 8,
              color: "success.main",
              mt: 0.8,
              mr: 1.5,
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography fontSize={14} sx={{ wordBreak: "break-word" }}>
              {u.text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {u.date}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function SkillTipCard({ tip }) {
  return (
    <Paper sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {tip.icon}
        <Typography fontWeight={700}>{tip.module}</Typography>
      </Box>
      <Typography fontSize={14} color="text.secondary">
        {tip.tip}
      </Typography>
    </Paper>
  );
}

// --- Hero Section ---

function HeroSection({ user }) {
  const skills = [
    { icon: <PenTool size={16} className="text-purple-600" />, label: "Spelling" },
    { icon: <Eye size={16} className="text-orange-600" />, label: "Reading" },
    { icon: <Mic size={16} className="text-pink-600" />, label: "Pronunciation" },
    { icon: <BookOpen size={16} className="text-green-600" />, label: "Grammar" },
    { icon: <FileText size={16} className="text-red-600" />, label: "Writing" },
    { icon: <Volume2 size={16} className="text-blue-600" />, label: "Listening" },
    { icon: <Lightbulb size={16} className="text-yellow-600" />, label: "Vocabulary" },
    { icon: <MessageCircle size={16} className="text-pink-700" />, label: "S.H.A.R.P" },
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 lg:py-16 px-4 sm:px-6 lg:px-8 mb-6 rounded-none md:rounded-2xl shadow-none md:shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
<div className="text-center">
  {/* Line 1 - Welcome title (one line) */}
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800 whitespace-nowrap">
    {user?.name ? `Welcome, ${user.name}!` : "Welcome to"}{" "}
    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
      Master Of Alphabet
    </span>
  </h1>

  {/* Line 2 - Competition title (one line) - REDUCED SIZE */}
  <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-bold text-orange-500 whitespace-nowrap">
    National English Language Skills 8-in-1 Mega Competition
  </h2>

  {/* Line break */}
  <div className="my-4"></div>

  {/* Line 3 - Description (one line) */}
  <p className="text-base sm:text-lg text-gray-600 whitespace-nowrap">
    Master all 8 English language skills, compete, and win! Start your journey
  </p>
</div>
            {/* Skills Grid - 2 rows of 4 each */}
            <div className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {skills.slice(0, 4).map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    {skill.icon}
                    <span className="ml-2 text-sm font-medium text-gray-700">{skill.label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {skills.slice(4).map((skill, index) => (
                  <div
                    key={index + 4}
                    className="flex items-center bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    {skill.icon}
                    <span className="ml-2 text-sm font-medium text-gray-700">{skill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => window.open("https://masterofalphabet.com/competition/register", "_blank")}
              >
                <Award size={20} />
                Register for Competition
              </button>
              <button
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => window.open("https://masterofalphabet.com/subscription", "_blank")}
              >
                <Users size={20} />
                Start Learning with Subscription
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={trophyImage}
                  alt="Student celebrating academic success"
                  className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[400px] lg:h-[400px] object-cover rounded-3xl border-4 border-white shadow-2xl"
                />
                
                {/* Floating Trophy */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 rounded-full shadow-lg animate-bounce">
                  <Trophy size={32} className="text-yellow-800" />
                </div>
                
                {/* Champion Badge */}
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-full shadow-lg">
                  <span className="font-bold text-lg">#1 Champion</span>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-6 w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-6 w-6 h-6 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-1/4 -left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---
export default function HomePage() {
  const [tipIndex, setTipIndex] = useState(0);
  const navigate = useNavigate();
  // const { loggedInUser } = useContext(AuthContext);
  const loggedInUser = null; // Replace with context or prop if available

  useEffect(() => {
    setTipIndex(new Date().getDate() % skillTips.length);
  }, []);

  return (
    <Box>
      <HeroSection user={loggedInUser} />

      {/* Dashboard Quick Access */}
      <SectionPaper
        title="Quick Access Dashboard"
        sx={{ mt: 4 }}
      >
        <Grid container spacing={3}>
          {/* Skill Spotlight */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                height: "100%",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                p: 2,
                bgcolor: "#f2f7ff",
                borderRadius: 3,
              }}
              tabIndex={0}
              aria-label="Skill Spotlight"
              onClick={() => navigate("/skill-spotlight")}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate("/skill-spotlight");
              }}
              role="button"
              style={{ cursor: "pointer" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, minHeight: 32 }}>
                <TipsAndUpdatesIcon sx={{ fontSize: 28, color: "#ffb300" }} />
                <Typography variant="h6" fontWeight={700} ml={1} color="primary">
                  Skill Spotlight
                </Typography>
              </Box>
              <Typography
                sx={{
                  flexGrow: 1,
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: "#333"
                }}
              >
                <b>{skillTips[tipIndex].module}</b>: {skillTips[tipIndex].tip}
              </Typography>
              <Button
                size="small"
                sx={{
                  mt: "auto",
                  alignSelf: "center",
                  px: 0,
                  textTransform: "none",
                  fontSize: 14,
                  color: "#7b1fa2",
                  fontWeight: 600,
                }}
                onClick={e => {
                  e.stopPropagation();
                  navigate("/skill-spotlight");
                }}
                tabIndex={-1}
              >
                Explore Tips
              </Button>
            </Paper>
          </Grid>
          {/* Word of The Day */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                height: "100%",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                p: 2,
                bgcolor: "#fffde7",
                borderRadius: 3,
              }}
              tabIndex={0}
              aria-label="Word of the Day"
              onClick={() => navigate("/word-of-the-day")}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate("/word-of-the-day");
              }}
              role="button"
              style={{ cursor: "pointer" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, minHeight: 32 }}>
                <WorkspacePremiumIcon sx={{ fontSize: 28, color: "#ab47bc" }} />
                <Typography variant="h6" fontWeight={700} ml={1} color="secondary">
                  Word of The Day
                </Typography>
              </Box>
              <Typography
                sx={{
                  flexGrow: 1,
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: "#333"
                }}
              >
                Discover, learn, and use a new word every day!
              </Typography>
              <Button
                size="small"
                sx={{
                  mt: "auto",
                  alignSelf: "center",
                  px: 0,
                  textTransform: "none",
                  fontSize: 14,
                  color: "#7b1fa2",
                  fontWeight: 600,
                }}
                onClick={e => {
                  e.stopPropagation();
                  navigate("/word-of-the-day");
                }}
                tabIndex={-1}
              >
                Explore Series
              </Button>
            </Paper>
          </Grid>
          {/* Daily Learning */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                height: "100%",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                p: 2,
                bgcolor: "#e0f2f1",
                borderRadius: 3,
              }}
              tabIndex={0}
              aria-label="Daily Learning"
              onClick={() => navigate("/learn")}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate("/learn");
              }}
              role="button"
              style={{ cursor: "pointer" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, minHeight: 32 }}>
                <BookIcon sx={{ fontSize: 28, color: "#00bfae" }} />
                <Typography variant="h6" fontWeight={700} ml={1} color="primary">
                  Daily Learning
                </Typography>
              </Box>
              <Typography sx={{
                flexGrow: 1,
                fontSize: 14,
                lineHeight: 1.4,
                color: "#333"
              }}>
                Bite-sized lessons, every single day!
              </Typography>
              <Button
                size="small"
                sx={{
                  mt: "auto",
                  alignSelf: "center",
                  px: 0,
                  textTransform: "none",
                  fontSize: 14,
                  color: "#00bfae",
                  fontWeight: 600,
                }}
                onClick={e => {
                  e.stopPropagation();
                  navigate("/learn");
                }}
                tabIndex={-1}
              >
                Start Learning
              </Button>
            </Paper>
          </Grid>
          {/* Daily Challenges */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                height: "100%",
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                p: 2,
                bgcolor: "#e3f2fd",
                borderRadius: 3,
              }}
              tabIndex={0}
              aria-label="Daily Challenges"
              onClick={() => navigate("/challenges")}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") navigate("/challenges");
              }}
              role="button"
              style={{ cursor: "pointer" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, minHeight: 32 }}>
                <EmojiEventsIcon sx={{ fontSize: 28, color: "#f57c00" }} />
                <Typography variant="h6" fontWeight={700} ml={1} color="warning.dark">
                  Daily Challenges
                </Typography>
              </Box>
              <Typography sx={{
                flexGrow: 1,
                fontSize: 14,
                lineHeight: 1.4,
                color: "#333"
              }}>
                Compete, have fun, and win rewards!
              </Typography>
              <Button
                size="small"
                sx={{
                  mt: "auto",
                  alignSelf: "center",
                  px: 0,
                  textTransform: "none",
                  fontSize: 14,
                  color: "#f57c00",
                  fontWeight: 600,
                }}
                onClick={e => {
                  e.stopPropagation();
                  navigate("/challenges");
                }}
                tabIndex={-1}
              >
                View Challenges
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </SectionPaper>

      {/* Skills Assessment */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          bgcolor: "#e3f2fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
        component="section"
        aria-label="Skills Assessment"
      >
        <Box>
          <Typography variant="h5" fontWeight={900} color="primary">
            Skills Assessment
          </Typography>
          <Typography color="text.secondary" fontSize={17}>
            Track your progress and unlock new levels—start your assessment now!
          </Typography>
        </Box>
        <Button
          size="large"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 3, fontWeight: 700, px: 5 }}
          onClick={() => navigate("/skill-assessment")}
        >
          Start Assessment
        </Button>
      </Paper>

      {/* Explore Modules */}
      <Box
        sx={{
          mb: 4,
          py: 3,
          px: { xs: 1, md: 4 },
          bgcolor: "#f7f6fd",
          borderRadius: 4,
          boxShadow: 2,
        }}
        component="section"
        aria-label="Explore Modules"
      >
        <Typography variant="h5" fontWeight={800} color="primary" mb={3} textAlign="center">
          Explore Modules
        </Typography>
        <Grid container spacing={3}>
          {modules.map((mod, i) => (
            <Grid item xs={6} sm={4} md={3} key={mod.label}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "#fff",
                  borderRadius: 3,
                  px: 2,
                  py: 3,
                  boxShadow: 1,
                  cursor: "pointer",
                  transition: "transform 0.15s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 4 },
                  outline: "none"
                }}
                onClick={() => navigate(mod.path)}
                tabIndex={0}
                aria-label={`Go to ${mod.label} module`}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(mod.path);
                  }
                }}
              >
                <Avatar sx={{ bgcolor: "#e3f2fd", width: 54, height: 54, mb: 1.5 }}>
                  {mod.icon}
                </Avatar>
                <Typography fontWeight={700}>{mod.label}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Skills Improvement */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: "#f3e5f5",
          borderRadius: 4,
          boxShadow: 2,
        }}
        component="section"
        aria-label="Skills Improvement"
      >
        <Typography variant="h6" fontWeight={800} color="secondary.dark" mb={2}>
          Skills Improvement
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" flexWrap="wrap">
          {improveSkills.map((btn, i) => (
            <Button
              key={btn.label}
              variant="contained"
              color={btn.color}
              startIcon={btn.icon}
              sx={{
                flex: 1,
                minWidth: 120,
                fontWeight: 700,
                px: 2,
                py: 1.4,
                borderRadius: 3,
                fontSize: 17,
                boxShadow: 2,
                textTransform: "none",
                mb: { xs: 1, sm: 0 },
              }}
              onClick={() => navigate(btn.path)}
              aria-label={`Go to ${btn.label}`}
            >
              {btn.label}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Bottom 3 Boxes */}
      <Grid container spacing={3}>
        {/* Things to Do */}
        <Grid item xs={12} md={4}>
          <SectionPaper
            title="Things to Do"
            icon={<ChecklistIcon color="warning" sx={{ flexShrink: 0 }} />}
            sx={{
              height: "100%",
              minHeight: 240,
              bgcolor: "#fffde7",
              borderRadius: 3,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <TaskList tasks={tasks} navigate={navigate} />
          </SectionPaper>
        </Grid>
        {/* Announcements */}
        <Grid item xs={12} md={4}>
          <SectionPaper
            title="Announcements"
            icon={<CampaignIcon color="primary" sx={{ flexShrink: 0 }} />}
            sx={{
              height: "100%",
              minHeight: 240,
              bgcolor: "#e3f2fd",
              borderRadius: 3,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <AnnouncementList announcements={announcements} />
          </SectionPaper>
        </Grid>
        {/* Updates */}
        <Grid item xs={12} md={4}>
          <SectionPaper
            title="Updates"
            icon={<BoltIcon color="success" sx={{ flexShrink: 0 }} />}
            sx={{
              height: "100%",
              minHeight: 240,
              bgcolor: "#f1f8e9",
              borderRadius: 3,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <UpdateList updates={updates} />
          </SectionPaper>
        </Grid>
      </Grid>
    </Box>
  );
}