import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Grid,
  Chip,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  EmojiEvents,
  Login,
  Logout,
  PersonAdd,
  Fireplace,
  StarBorder,
  RocketLaunch,
  Announcement,
  FormatQuote,
  Book,
  MenuBook,
  Mic,
  Edit,
  Headphones,
  LibraryBooks,
  FlashOn,
  Spellcheck,
  Shuffle,
  CalendarMonth,
  Feedback,
  BarChart,
  Lightbulb,
  Science,
  NavigateNext,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Mock Data
const modules = [
  { name: "Spelling", icon: <Book />, color: "#f44336", path: "/spelling" },
  { name: "Reading", icon: <MenuBook />, color: "#e91e63", path: "/reading" },
  { name: "Pronunciation", icon: <Mic />, color: "#9c27b0", path: "/pronunciation" },
  { name: "Grammar", icon: <Edit />, color: "#673ab7", path: "/grammar" },
  { name: "Writing", icon: <Edit />, color: "#3f51b5", path: "/writing" },
  { name: "Listening", icon: <Headphones />, color: "#2196f3", path: "/listening" },
  { name: "Vocabulary", icon: <LibraryBooks />, color: "#4caf50", path: "/vocabulary" },
  { name: "S.H.A.R.P", icon: <FlashOn />, color: "#ff9800", path: "/sharp" },
];

const dailyChallenges = [
  {
    module: "Spelling",
    challengeTitle: "Spell 'Synchronization'",
    timeLeft: "2h 15m",
    submissions: 32,
    myStatus: "Not submitted",
  },
  {
    module: "Reading",
    challengeTitle: "Read & Summarize Short Story",
    timeLeft: "1d 3h",
    submissions: 15,
    myStatus: "Submitted",
  },
  {
    module: "Pronunciation",
    challengeTitle: "Pronounce 'Onomatopoeia'",
    timeLeft: "5h 0m",
    submissions: 27,
    myStatus: "Not submitted",
  },
  {
    module: "Grammar",
    challengeTitle: "Identify 10 Nouns",
    timeLeft: "12h 0m",
    submissions: 41,
    myStatus: "Not submitted",
  },
];

const leaderboard = [
  {
    name: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    score: 1200,
    rank: 1,
  },
  {
    name: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    score: 1100,
    rank: 2,
  },
  {
    name: "Charlie",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg",
    score: 900,
    rank: 3,
  },
];

const announcements = [
  {
    title: "Mega English Contest on June 30!",
    desc: "Register now and stand a chance to win exciting prizes.",
  },
  {
    title: "New Module: Vocabulary Builder",
    desc: "Expand your word power with our latest interactive module.",
  },
];

const motivationalQuotes = [
  "The limits of my language mean the limits of my world. – Ludwig Wittgenstein",
  "You can never understand one language until you understand at least two. – Geoffrey Willans",
  "Practice makes perfect. Keep challenging yourself every day!",
];

const streaks = {
  current: 5,
  max: 10,
};

const achievements = [
  { icon: <EmojiEvents color="warning" />, label: "First Challenge" },
  { icon: <StarBorder color="primary" />, label: "Weekly Winner" },
  { icon: <RocketLaunch color="secondary" />, label: "Streak 5 Days" },
];

// Simulated authentication state
const loggedInUser = { email: "alex@email.com", name: "Alex" };

function HomePage() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const [quoteIndex, setQuoteIndex] = React.useState(0);

  // Rotating quote
  React.useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh", pb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: 6,
          px: 2,
          background: "linear-gradient(90deg, #7f39fb 0%, #6200ea 100%)",
          color: "#fff",
          position: "relative",
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={1}>
          Master of Alphabet
        </Typography>
        <Typography variant="h6" mb={2}>
          8-in-1 English Skills Competition
        </Typography>
        <Typography variant="subtitle1" fontStyle="italic" mb={3}>
          {loggedInUser
            ? `Welcome back, ${loggedInUser.name || loggedInUser.email}!`
            : "Welcome! Ready to challenge yourself today?"}
        </Typography>
        {!loggedInUser ? (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Login />}
              component={RouterLink}
              to="/login"
              sx={{ bgcolor: "#fff", color: "#6200ea", fontWeight: 700 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              component={RouterLink}
              to="/signup"
              sx={{ bgcolor: "#ff9800", color: "#fff", fontWeight: 700 }}
            >
              Sign Up
            </Button>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Logout />}
            sx={{ color: "#fff", borderColor: "#fff", fontWeight: 700 }}
            // Add logout logic here
          >
            Logout
          </Button>
        )}
        {/* Announcements */}
        <Stack direction="row" spacing={2} sx={{ mt: 4, overflowX: "auto" }}>
          {announcements.map((item, idx) => (
            <Card key={idx} sx={{ minWidth: 260, bgcolor: "#fffde7" }}>
              <CardHeader
                avatar={<Announcement color="warning" />}
                title={<Typography variant="subtitle2">{item.title}</Typography>}
                sx={{ py: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2">{item.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Quote, Streak, Achievements */}
      <Box
        maxWidth="lg"
        mx="auto"
        px={isMd ? 3 : 1}
        mb={3}
        display="flex"
        flexDirection={isMd ? "row" : "column"}
        gap={3}
        alignItems="center"
        justifyContent="space-between"
      >
        {/* Quote */}
        <Paper elevation={2} sx={{ flex: 2, py: 2, px: 3, bgcolor: "#e3f2fd" }}>
          <Typography color="primary" fontStyle="italic">
            <FormatQuote fontSize="small" /> {motivationalQuotes[quoteIndex]}
          </Typography>
        </Paper>
        {/* Streak */}
        <Paper elevation={2} sx={{ flex: 1, py: 2, px: 3, bgcolor: "#fff" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Fireplace color="warning" />
            <Typography fontWeight={700}>
              Streak: {streaks.current} days
            </Typography>
          </Stack>
        </Paper>
        {/* Achievements */}
        <Paper elevation={2} sx={{ flex: 2, py: 2, px: 3, bgcolor: "#fff" }}>
          <Stack direction="row" spacing={2}>
            {achievements.map((ach, idx) => (
              <Tooltip title={ach.label} key={idx}>
                <span>{ach.icon}</span>
              </Tooltip>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Leaderboard Preview */}
      <Box maxWidth="lg" mx="auto" px={isMd ? 3 : 1} mb={4}>
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            avatar={<EmojiEvents color="warning" />}
            title="Top Performers"
            action={
              <Button
                size="small"
                component={RouterLink}
                to="/leaderboards"
                endIcon={<NavigateNext />}
              >
                See All
              </Button>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            <Grid container spacing={2}>
              {leaderboard.map((user, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      p: 1.5,
                      bgcolor: idx === 0 ? "#fffde7" : "#f1f8e9",
                      borderRadius: 2,
                    }}
                  >
                    <Avatar src={user.avatar} alt={user.name} />
                    <Box>
                      <Typography fontWeight={700}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.score} pts
                      </Typography>
                    </Box>
                    <Chip
                      label={`#${user.rank}`}
                      color={idx === 0 ? "warning" : "default"}
                      sx={{ ml: "auto" }}
                    />
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Modules */}
      <Box maxWidth="lg" mx="auto" px={isMd ? 3 : 1} mb={4}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Explore Modules
        </Typography>
        <Grid container spacing={2}>
          {modules.map((mod, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Card
                component={RouterLink}
                to={mod.path}
                sx={{
                  bgcolor: mod.color,
                  color: "#fff",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.04)", boxShadow: 6 },
                  textDecoration: "none",
                }}
                elevation={3}
              >
                <Box>{mod.icon}</Box>
                <Typography fontWeight={700} mt={1}>
                  {mod.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Daily Challenges */}
      <Box maxWidth="lg" mx="auto" px={isMd ? 3 : 1} mb={4}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Daily Challenges
        </Typography>
        <Grid container spacing={2}>
          {dailyChallenges.map((ch, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card
                sx={{
                  bgcolor: modules.find((m) => m.name === ch.module)?.color || "#9c27b0",
                  color: "#fff",
                  borderRadius: 3,
                  p: 2,
                  position: "relative",
                }}
                elevation={2}
              >
                <Typography fontWeight={700}>
                  {ch.module}
                </Typography>
                <Typography variant="body2" mt={1} mb={1}>
                  {ch.challengeTitle}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip label={ch.timeLeft} icon={<CalendarMonth />} size="small" />
                  <Chip label={`Subs: ${ch.submissions}`} size="small" />
                  <Chip
                    label={ch.myStatus}
                    color={ch.myStatus === "Submitted" ? "success" : "error"}
                    size="small"
                  />
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Access Links & Diagnostic */}
      <Box maxWidth="lg" mx="auto" px={isMd ? 3 : 1} mb={4}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Quick Access
        </Typography>
        <Stack direction={isMd ? "row" : "column"} spacing={2} mb={2}>
          <Button
            variant="contained"
            startIcon={<Book />}
            component={RouterLink}
            to="/learn"
            color="secondary"
            sx={{ fontWeight: 700 }}
            fullWidth={!isMd}
          >
            Learn
          </Button>
          <Button
            variant="contained"
            startIcon={<Lightbulb />}
            component={RouterLink}
            to="/prepare"
            color="warning"
            sx={{ fontWeight: 700 }}
            fullWidth={!isMd}
          >
            Prepare
          </Button>
          <Button
            variant="contained"
            startIcon={<Science />}
            component={RouterLink}
            to="/test"
            color="primary"
            sx={{ fontWeight: 700 }}
            fullWidth={!isMd}
          >
            Test
          </Button>
        </Stack>
        <Stack direction={isMd ? "row" : "column"} spacing={2} mb={2}>
          <Button
            variant="outlined"
            startIcon={<Spellcheck />}
            component={RouterLink}
            to="/find-correctly-spelled-word"
            fullWidth={!isMd}
          >
            Find the Correctly Spelled Word
          </Button>
          <Button
            variant="outlined"
            startIcon={<Shuffle />}
            component={RouterLink}
            to="/unscramble"
            fullWidth={!isMd}
          >
            Unscrambled
          </Button>
          <Button
            variant="outlined"
            startIcon={<CalendarMonth />}
            component={RouterLink}
            to="/daily-challenges"
            fullWidth={!isMd}
          >
            Daily Challenges
          </Button>
        </Stack>
        <Button
          variant="contained"
          startIcon={<BarChart />}
          component={RouterLink}
          to="/skill-assessment"
          color="success"
          sx={{ fontWeight: 700, borderRadius: 2, py: 1.5, fontSize: 18 }}
          fullWidth
        >
          Start Skills Assessment
        </Button>
      </Box>

      {/* Feedback Button */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          startIcon={<Feedback />}
          component={RouterLink}
          to="/feedback"
          color="secondary"
          sx={{ fontWeight: 700 }}
        >
          Feedback & Help
        </Button>
      </Box>
    </Box>
  );
}

export default HomePage;