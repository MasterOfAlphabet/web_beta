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
  return (
    <Box
      component="section"
      sx={{
        background: "linear-gradient(120deg, #e3f0ff 0%, #fbe8ef 100%)",
        py: { xs: 7, md: 10 },
        px: { xs: 2, md: 0 },
        mb: 3,
        borderRadius: { xs: 0, md: 4 },
        boxShadow: { xs: 0, md: 2 },
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={7}>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              mb: 1,
              color: "#333",
              lineHeight: 1.1,
              fontSize: { xs: 30, md: 40, lg: 50 },
            }}
          >
            {user?.name ? `Welcome, ${user.name}!` : "Welcome to"}{" "}
            <span style={{
              background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Master Of Alphabet</span>
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "#f59e42",
              mb: 2,
            }}
          >
            National English Language Skills 8-in-1 Mega Competition
          </Typography>
          <Typography sx={{ mb: 2, color: "#444" }}>
            Master all 8 English language skills, compete, and win rewards! Start your journey now.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 2,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: 4,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              startIcon={<Award />}
              onClick={() => window.open("https://masterofalphabet.com/competition/register", "_blank")}
            >
              Register for Competition
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 2,
                borderRadius: 2,
                fontWeight: "bold",
                boxShadow: 4,
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              startIcon={<Users />}
              onClick={() => window.open("https://masterofalphabet.com/subscription", "_blank")}
            >
              Start Learning with Subscription
            </Button>
          </Stack>
          {/* Skill summary badges */}
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {[
              { icon: <PenTool size={16} color="#7c3aed" />, label: "Spelling" },
              { icon: <Eye size={16} color="#ea580c" />, label: "Reading" },
              { icon: <Mic size={16} color="#a21caf" />, label: "Pronunciation" },
              { icon: <BookOpen size={16} color="#059669" />, label: "Grammar" },
              { icon: <FileText size={16} color="#dc2626" />, label: "Writing" },
              { icon: <Volume2 size={16} color="#2563eb" />, label: "Listening" },
              { icon: <Lightbulb size={16} color="#eab308" />, label: "Vocabulary" },
              { icon: <MessageCircle size={16} color="#db2777" />, label: "S.H.A.R.P" },
            ].map(skill => (
              <Grid item key={skill.label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#fff",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    boxShadow: 1,
                    gap: 1,
                    fontWeight: 500,
                  }}
                >
                  {skill.icon}
                  <span>{skill.label}</span>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <img
              src="https://cdn.pixabay.com/photo/2017/01/31/19/17/avatar-2026510_1280.png"
              alt="Student Celebrating with Trophy"
              style={{
                width: "80%",
                maxWidth: 320,
                borderRadius: 24,
                border: "4px solid #fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 10,
                bgcolor: "#fde047",
                p: 1.5,
                borderRadius: "50%",
                boxShadow: 3,
                animation: "bounce 1.2s infinite alternate",
              }}
              aria-label="Trophy"
            >
              <Trophy size={34} color="#a16207" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                bgcolor: "#9333ea",
                color: "#fff",
                px: 2,
                py: 0.5,
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: 2,
              }}
            >
              #1 Champion
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
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