import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Link as MUILink,
  LinearProgress,
  Badge,
  Divider,
  IconButton,
} from "@mui/material";

import {
  CheckCircle as CheckCircleIcon,
  FiberManualRecord as FiberManualRecordIcon,
  PlayArrow as PlayArrowIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChecklistIcon from "@mui/icons-material/Checklist";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import BoltIcon from "@mui/icons-material/Bolt";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SchoolIcon from "@mui/icons-material/School";
import TodayIcon from "@mui/icons-material/Today";
import StarIcon from "@mui/icons-material/Star";
import DiscountIcon from "@mui/icons-material/Discount";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import BookIcon from "@mui/icons-material/Book";
import EditNoteIcon from "@mui/icons-material/EditNote";
import QuizIcon from "@mui/icons-material/Quiz";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate } from "react-router-dom";

const offerImage =
  "https://img.freepik.com/free-vector/special-offer-discount-sale-banner-design_1017-31299.jpg?w=826&t=st=1718150000~exp=1718150600~hmac=8f6c8c1a2e9b6f6c6c1c0e6fbf2f1d379c8a1b1e1e8b6c8e3a3e9b8c2a5a4c7e";

const skillTips = [
  {
    module: "Spelling",
    tip: "Break long words into smaller parts to spell them easily.",
    icon: <EmojiObjectsIcon color="primary" />,
    difficulty: "Beginner",
    time: "5 min"
  },
  {
    module: "Reading",
    tip: "Underline unfamiliar words and look them up after reading.",
    icon: <TodayIcon color="success" />,
    difficulty: "Intermediate",
    time: "10 min"
  },
  {
    module: "Pronunciation",
    tip: "Practice tongue twisters to improve your pronunciation.",
    icon: <BoltIcon color="secondary" />,
    difficulty: "Advanced",
    time: "15 min"
  },
  {
    module: "Grammar",
    tip: "Remember: 'a' before consonant sounds, 'an' before vowel sounds.",
    icon: <EmojiObjectsIcon color="secondary" />,
    difficulty: "Beginner",
    time: "8 min"
  },
  {
    module: "Writing",
    tip: "Start your essay with a strong opening sentence.",
    icon: <SchoolIcon color="primary" />,
    difficulty: "Intermediate",
    time: "12 min"
  },
  {
    module: "Listening",
    tip: "Listen for key words to understand the main idea.",
    icon: <BoltIcon color="warning" />,
    difficulty: "Beginner",
    time: "7 min"
  },
  {
    module: "Vocabulary",
    tip: "Use new words in sentences to remember them better.",
    icon: <EmojiObjectsIcon color="success" />,
    difficulty: "All Levels",
    time: "6 min"
  },
  {
    module: "S.H.A.R.P",
    tip: "Homonyms are words that sound alike but have different meanings.",
    icon: <BoltIcon color="info" />,
    difficulty: "Advanced",
    time: "20 min"
  },
];

const tasks = [
  { text: "Take a Spelling Test", done: false, points: 50, streak: 0 },
  { text: "Practice Reading Skills", done: false, points: 30, streak: 2 },
  { text: "Complete today's Word of the Day", done: true, points: 20, streak: 5 },
  { text: "Grammar Challenge", done: false, points: 40, streak: 0 },
  { text: "Pronunciation Practice", done: false, points: 35, streak: 1 },
];

const announcements = [
  {
    title: "🏆 June Challenge Winners!",
    text: "Congratulations to Aanya, Veer, and Riya for topping our June Spelling Challenge! 🎉",
    icon: <EmojiEventsIcon color="warning" />,
    date: "2025-06-05",
    priority: "high",
    category: "Winners"
  },
  {
    title: "🚀 S.H.A.R.P. Challenge Announced!",
    text: "New monthly challenge with exciting prizes! Participate now to win amazing rewards! 🎁",
    icon: <CampaignIcon color="primary" />,
    date: "2025-06-07",
    priority: "medium",
    category: "Challenge"
  },
  {
    title: "📚 New Learning Path Available",
    text: "Advanced Grammar course for Class VIII-X students is now live!",
    icon: <BookIcon color="success" />,
    date: "2025-06-08",
    priority: "low",
    category: "Course"
  },
];

const updates = [
  {
    text: "✨ 10 new Grammar Test questions added for Class VI-X with detailed explanations.",
    date: "2025-06-06",
    type: "content",
    icon: <EditNoteIcon color="primary" />
  },
  {
    text: "📖 Word of the Day: 'Serendipity' - the occurrence of happy events by chance.",
    date: "2025-06-07",
    type: "daily",
    icon: <WorkspacePremiumIcon color="secondary" />
  },
  {
    text: "🎧 New Interactive Listening Practice set for Class III-V with audio feedback.",
    date: "2025-06-04",
    type: "feature",
    icon: <RecordVoiceOverIcon color="info" />
  },
  {
    text: "🏅 Leaderboard updated - Check your ranking in the class challenges!",
    date: "2025-06-05",
    type: "ranking",
    icon: <TrendingUpIcon color="warning" />
  },
];

const modules = [
  { 
    label: "Spelling", 
    icon: <EmojiObjectsIcon color="primary" />, 
    path: "/spelling",
    description: "Master word spelling",
    progress: 75,
    lessons: 45
  },
  { 
    label: "Reading", 
    icon: <BookIcon color="success" />, 
    path: "/reading",
    description: "Improve comprehension",
    progress: 60,
    lessons: 38
  },
  { 
    label: "Grammar", 
    icon: <EditNoteIcon color="secondary" />, 
    path: "/grammar",
    description: "Perfect your grammar",
    progress: 80,
    lessons: 52
  },
  { 
    label: "Writing", 
    icon: <SchoolIcon color="primary" />, 
    path: "/writing",
    description: "Express your thoughts",
    progress: 45,
    lessons: 30
  },
  { 
    label: "Listening", 
    icon: <BoltIcon color="warning" />, 
    path: "/listening",
    description: "Enhance listening skills",
    progress: 55,
    lessons: 25
  },
  { 
    label: "Pronunciation", 
    icon: <RecordVoiceOverIcon color="info" />, 
    path: "/pronunciation",
    description: "Speak with confidence",
    progress: 35,
    lessons: 28
  },
  { 
    label: "Vocabulary", 
    icon: <QuizIcon color="error" />, 
    path: "/vocabulary",
    description: "Expand your word bank",
    progress: 90,
    lessons: 60
  },
  { 
    label: "S.H.A.R.P", 
    icon: <WorkspacePremiumIcon color="secondary" />, 
    path: "/sharp",
    description: "Advanced skills",
    progress: 25,
    lessons: 15
  },
];

const improveSkills = [
  { label: "Learn", icon: <BookIcon />, color: "primary", path: "/learn", count: "150+ Lessons" },
  { label: "Practice", icon: <EditNoteIcon />, color: "success", path: "/practice", count: "500+ Exercises" },
  { label: "Test", icon: <QuizIcon />, color: "warning", path: "/test", count: "100+ Tests" },
  { label: "Battles", icon: <SportsKabaddiIcon />, color: "secondary", path: "/battles", count: "Live Competitions" },
  { label: "Challenges", icon: <EmojiEventsIcon />, color: "error", path: "/challenges", count: "Weekly Events" },
];

const studentStats = {
  totalPoints: 2450,
  weeklyStreak: 7,
  completedLessons: 127,
  rank: 15,
  totalStudents: 1250
};

export default function HomePage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    setTipIndex(now.getDate() % skillTips.length);
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: { xs: 2, md: 3 },
        px: { xs: 1, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Enhanced Hero Section with Personal Stats */}
        <Box
          sx={{
            mb: 4,
            p: { xs: 3, md: 6 },
            pt: { xs: 2, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            color: "#fff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"25\" cy=\"25\" r=\"2\" fill=\"%23ffffff\" opacity=\"0.1\"/><circle cx=\"75\" cy=\"75\" r=\"3\" fill=\"%23ffffff\" opacity=\"0.05\"/><circle cx=\"50\" cy=\"10\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></svg>')",
              backgroundSize: "100px 100px",
            }
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h2"
              fontWeight={900}
              gutterBottom
              sx={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                background: "linear-gradient(45deg, #fff 30%, #e3f2fd 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              {getGreeting()}, Future Scholar! 🌟
            </Typography>
            <Typography 
              variant="h4" 
              fontWeight={700}
              gutterBottom
              sx={{ opacity: 0.95, mb: 2 }}
            >
              Welcome to Master Of Alphabet
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 800, 
                mx: "auto", 
                opacity: 0.9,
                lineHeight: 1.6,
                mb: 3
              }}
            >
              🚀 Unlock your English superpowers with AI-powered learning! 
              From Spelling Champions to Grammar Gurus - every day brings new adventures in language mastery.
            </Typography>
            
            {/* Personal Stats Row */}
            <Grid container spacing={2} sx={{ mt: 2, maxWidth: 600, mx: "auto" }}>
              <Grid item xs={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800}>
                    {studentStats.totalPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Total Points
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800}>
                    {studentStats.weeklyStreak} 🔥
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Day Streak
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800}>
                    #{studentStats.rank}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Class Rank
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={800}>
                    {studentStats.completedLessons}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Lessons Done
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Enhanced Offers Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
            borderRadius: 4,
            mb: 4,
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(255,154,158,0.3)",
            alignItems: "stretch",
            position: "relative",
          }}
        >
          {/* Floating discount badge */}
          <Chip 
            label="🔥 LIMITED TIME" 
            color="error" 
            sx={{ 
              position: "absolute", 
              top: 16, 
              right: 16, 
              zIndex: 2,
              fontWeight: 800,
              animation: "pulse 2s infinite"
            }} 
          />
          
          <Box
            sx={{
              flex: 1,
              minHeight: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fff",
              position: "relative",
            }}
          >
            <img
              src={offerImage}
              alt="Special Offers"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              py: 4,
              px: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography variant="h5" fontWeight={800} color="#2c387e" mb={2}>
              🎁 Exclusive Launch Offers!
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<PaidIcon />}
                sx={{ 
                  fontWeight: 700, 
                  flex: 1, 
                  borderRadius: 3,
                  background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  boxShadow: "0 8px 20px rgba(102,126,234,0.3)"
                }}
              >
                Pre-launch 50% OFF
              </Button>
              <Button
                variant="contained" 
                color="success"
                startIcon={<LoyaltyIcon />}
                sx={{ 
                  fontWeight: 700, 
                  flex: 1, 
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(76,175,80,0.3)"
                }}
              >
                Free Premium Week
              </Button>
            </Stack>

            <Button
              variant="contained"
              startIcon={<CardGiftcardIcon sx={{ fontSize: 28 }} />}
              sx={{
                fontWeight: 800,
                fontSize: 18,
                borderRadius: 4,
                py: 2,
                background: "linear-gradient(45deg, #ff6b6b 30%, #feca57 90%)",
                color: "#fff",
                boxShadow: "0 12px 25px rgba(255,107,107,0.4)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(255,107,107,0.5)"
                }
              }}
            >
              🎊 Mega Giveaway Contest
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<LockOpenIcon />}
                sx={{ 
                  fontWeight: 700, 
                  flex: 1, 
                  borderRadius: 3,
                  borderColor: "#667eea",
                  color: "#667eea"
                }}
              >
                Unlock All Features
              </Button>
              <Button
                variant="outlined"
                startIcon={<GroupWorkIcon />}
                sx={{ 
                  fontWeight: 700, 
                  flex: 1, 
                  borderRadius: 3,
                  borderColor: "#764ba2",
                  color: "#764ba2"
                }}
              >
                Team Challenges
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Enhanced Top 4 Boxes */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Enhanced Skill Spotlight */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              height: '100%',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(102,126,234,0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                animation: 'rotate 20s linear infinite'
              }
            }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TipsAndUpdatesIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6" fontWeight={800}>
                    💡 Skill Spotlight
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {skillTips[tipIndex].module}
                  </Typography>
                  <Chip 
                    label={`${skillTips[tipIndex].difficulty} • ${skillTips[tipIndex].time}`}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                <Typography sx={{ 
                  fontSize: 14, 
                  lineHeight: 1.5,
                  mb: 2,
                  opacity: 0.9
                }}>
                  {skillTips[tipIndex].tip}
                </Typography>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    mt: 'auto',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                  onClick={() => navigate('/skill-spotlight')}
                >
                  Try This Tip
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Enhanced Word of The Day */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              height: '100%',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(252,182,159,0.3)',
              position: 'relative'
            }}>
              <Badge badgeContent="NEW" color="error" sx={{ alignSelf: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WorkspacePremiumIcon sx={{ fontSize: 32, color: '#e65100', mr: 1 }} />
                  <Typography variant="h6" fontWeight={800} color="#bf360c">
                    📚 Word Power
                  </Typography>
                </Box>
              </Badge>
              
              <Box sx={{ my: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={900} color="#bf360c">
                  Serendipity
                </Typography>
                <Typography variant="body2" color="#d84315" sx={{ fontStyle: 'italic' }}>
                  /ˌserənˈdipədē/
                </Typography>
              </Box>
              
              <Typography sx={{ 
                fontSize: 14, 
                color: '#bf360c',
                textAlign: 'center',
                mb: 2,
                fontWeight: 500
              }}>
                "Happy accidents that lead to wonderful discoveries! ✨"
              </Typography>
              
              <Button
                variant="contained"
                size="small"
                sx={{
                  mt: 'auto',
                  bgcolor: '#ff7043',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#f4511e' }
                }}
                onClick={() => navigate('/word-of-the-day')}
              >
                Explore More Words
              </Button>
            </Paper>
          </Grid>

          {/* Enhanced Daily Learning */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              height: '100%',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(168,237,234,0.3)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BookIcon sx={{ fontSize: 32, color: '#00695c', mr: 1 }} />
                <Typography variant="h6" fontWeight={800} color="#00695c">
                  🎯 Smart Learning
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#00695c" sx={{ mb: 1 }}>
                  Today's Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(0,105,92,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#00695c',
                      borderRadius: 4
                    }
                  }} 
                />
                <Typography variant="caption" color="#00695c" sx={{ mt: 1 }}>
                  65% Complete • 2 lessons left
                </Typography>
              </Box>
              
              <Typography sx={{ 
                fontSize: 14, 
                color: '#00695c',
                mb: 2,
                fontWeight: 500
              }}>
                Personalized lessons that adapt to your learning pace! 🚀
              </Typography>
              
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayArrowIcon />}
                sx={{
                  mt: 'auto',
                  bgcolor: '#26a69a',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#00695c' }
                }}
                onClick={() => navigate('/learn')}
              >
                Continue Learning
              </Button>
            </Paper>
          </Grid>

          {/* Enhanced Daily Challenges */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{
              height: '100%',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(250,112,154,0.3)',
              position: 'relative'
            }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Chip 
                  label="🔥 LIVE" 
                  size="small" 
                  color="error" 
                  sx={{ fontWeight: 800, animation: 'pulse 2s infinite' }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 32, color: '#ff6f00', mr: 1 }} />
                <Typography variant="h6" fontWeight={800} color="#e65100">
                  🏆 Battle Arena
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#ff8f00" fontWeight={600}>
                  📊 Active Challenges: 3
                </Typography>
                <Typography variant="body2" color="#ff8f00">
                  👥 245 students competing
                </Typography>
                <Typography variant="body2" color="#ff8f00">
                  ⏰ 2h 15m remaining
                </Typography>
              </Box>
              
              <Typography sx={{ 
                fontSize: 14, 
                color: '#e65100',
                mb: 2,
                fontWeight: 500
              }}>
                Join live competitions and win exciting rewards! 🎁
              </Typography>
              
              <Button
                variant="contained"
                size="small"
                startIcon={<SportsKabaddiIcon />}
                sx={{
                  mt: 'auto',
                  bgcolor: '#ff8f00',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#ff6f00' }
                }}
                onClick={() => navigate('/challenges')}
              >
                Join Battle
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Enhanced Skills Assessment */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
            boxShadow: "0 15px 35px rgba(102,126,234,0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "100%",
              background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><polygon points=\"0,0 100,0 100,100\" fill=\"%23ffffff\" opacity=\"0.05\"/></svg>')",
              backgroundSize: "cover",
            }
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
              🎯 AI Skills Assessment
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Discover your English superpowers with our smart evaluation system!
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip 
                label="✨ Personalized Learning Path" 
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }}
              />
              <Chip 
                label="📊 Detailed Analytics" 
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }}
              />
              <Chip 
                label="🏆 Skill Certification" 
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }}
              />
            </Box>
          </Box>
          <Button
            size="large"
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{ 
              borderRadius: 4, 
              fontWeight: 800, 
              px: 4,
              py: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: 16,
              boxShadow: "0 8px 20px rgba(255,255,255,0.2)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)"
              }
            }}
            onClick={() => navigate("/skill-assessment")}
          >
            Start Assessment
          </Button>
        </Paper>

        {/* Enhanced Explore Modules */}
        <Box
          sx={{
            mb: 4,
            py: 4,
            px: { xs: 2, md: 4 },
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: 4,
            boxShadow: "0 15px 35px rgba(240,147,251,0.3)",
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight={900} 
            color="white" 
            mb={3} 
            textAlign="center"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            🚀 Explore Learning Modules
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
                    borderRadius: 4,
                    p: 3,
                    boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": { 
                      transform: "translateY(-8px)", 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      "& .module-progress": {
                        transform: "scale(1.1)"
                      }
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, transparent 0%, currentColor ${mod.progress}%, transparent 100%)`,
                      opacity: 0.3
                    }
                  }}
                  onClick={() => navigate(mod.path)}
                >
                  <Avatar sx={{ 
                    bgcolor: "#f5f5f5", 
                    width: 60, 
                    height: 60, 
                    mb: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}>
                    {mod.icon}
                  </Avatar>
                  
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                    {mod.label}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    textAlign="center"
                    sx={{ mb: 2, fontSize: 12 }}
                  >
                    {mod.description}
                  </Typography>
                  
                  <Box sx={{ width: "100%", mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {mod.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={mod.progress}
                      className="module-progress"
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        transition: "transform 0.3s ease",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="primary" fontWeight={600}>
                    {mod.lessons} Lessons Available
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enhanced Skills Improvement */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 4,
            boxShadow: "0 15px 35px rgba(102,126,234,0.3)",
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight={900} 
            color="white" 
            mb={3} 
            textAlign="center"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            ⚡ Supercharge Your Skills
          </Typography>
          <Grid container spacing={3}>
            {improveSkills.map((skill, i) => (
              <Grid item xs={12} sm={6} md={2.4} key={skill.label}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={skill.icon}
                  sx={{
                    width: "100%",
                    height: "120px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    fontWeight: 800,
                    borderRadius: 4,
                    fontSize: 16,
                    bgcolor: "rgba(255,255,255,0.95)",
                    color: "#333",
                    boxShadow: "0 8px 20px rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "white",
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 30px rgba(255,255,255,0.3)",
                      "& .skill-icon": {
                        transform: "scale(1.2)"
                      }
                    },
                    "& .MuiButton-startIcon": {
                      margin: 0,
                      fontSize: 32,
                      transition: "transform 0.3s ease"
                    }
                  }}
                  onClick={() => navigate(skill.path)}
                >
                  <Box className="skill-icon">
                    {skill.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={800}>
                    {skill.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {skill.count}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enhanced Bottom 3 Boxes */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Enhanced Things to Do */}
          <Grid item xs={12} md={4}>
            <Paper sx={{
              height: '100%',
              minHeight: 300,
              p: 3,
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(252,182,159,0.3)',
              position: 'relative'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight={800} color="#bf360c">
                  ✅ Daily Quests
                </Typography>
                <Chip 
                  label={`${tasks.filter(t => !t.done).length} left`}
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              
              <Stack spacing={2}>
                {tasks.map((task, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: task.done ? 'rgba(76,175,80,0.1)' : 'rgba(255,255,255,0.7)',
                      borderRadius: 3,
                      border: task.done ? '2px solid #4caf50' : '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {task.done ? (
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 2 }} />
                    ) : (
                      <Box sx={{
                        width: 24,
                        height: 24,
                        border: '2px solid #ff8f00',
                        borderRadius: '50%',
                        mr: 2
                      }}/>
                    )}
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        sx={{ 
                          color: task.done ? 'success.main' : '#bf360c',
                          textDecoration: task.done ? 'line-through' : 'none'
                        }}
                      >
                        {task.text}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={`+${task.points} XP`}
                          size="small"
                          color="primary"
                          sx={{ fontSize: 10, height: 18 }}
                        />
                        {task.streak > 0 && (
                          <Chip 
                            label={`🔥 ${task.streak}`}
                            size="small"
                            color="error"
                            sx={{ fontSize: 10, height: 18 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
              
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: '#ff8f00',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#ff6f00' }
                }}
              >
                View All Quests
              </Button>
            </Paper>
          </Grid>

          {/* Enhanced Announcements */}
          <Grid item xs={12} md={4}>
            <Paper sx={{
              height: '100%',
              minHeight: 300,
              p: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(102,126,234,0.3)',
              position: 'relative'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>
                  📢 Announcements
                </Typography>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <NotificationsIcon />
                </IconButton>
              </Box>
              
              <Stack spacing={2}>
                {announcements.map((announcement, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 2,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      borderLeft: `4px solid ${announcement.priority === 'high' ? '#ff4444' : announcement.priority === 'medium' ? '#ffaa00' : '#00ff88'}`,
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
                        {announcement.title}
                      </Typography>
                      <Chip 
                        label={announcement.category}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)', 
                          color: 'white',
                          fontSize: 10
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {announcement.text}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {announcement.date}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                View All Announcements
              </Button>
            </Paper>
          </Grid>

          {/* Enhanced Updates */}
          <Grid item xs={12} md={4}>
            <Paper sx={{
              height: '100%',
              minHeight: 300,
              p: 3,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: 'white',
              borderRadius: 4,
              boxShadow: '0 12px 25px rgba(17,153,142,0.3)',
              position: 'relative'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>
                  ⚡ Fresh Updates
                </Typography>
                <Chip 
                  label="LIVE"
                  size="small"
                  color="error"
                  sx={{ fontWeight: 800, animation: 'pulse 2s infinite' }}
                />
              </Box>
              
              <Stack spacing={2}>
                {updates.map((update, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      p: 2,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      {update.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {update.text}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {update.date}
                        </Typography>
                        <Chip 
                          label={update.type}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            color: 'white',
                            fontSize: 9,
                            height: 16
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
              
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                View All Updates
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* New Quick Stats Section */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            boxShadow: "0 15px 35px rgba(250,112,154,0.3)",
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight={900} 
            color="white" 
            mb={3} 
            textAlign="center"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            📊 Your Learning Journey
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box textAlign="center" sx={{ p: 2, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
                <Typography variant="h3" fontWeight={900} color="white">
                  {studentStats.totalPoints.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Total Points
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center" sx={{ p: 2, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
                <Typography variant="h3" fontWeight={900} color="white">
                  #{studentStats.rank}
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Class Rank
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center" sx={{ p: 2, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
                <Typography variant="h3" fontWeight={900} color="white">
                  {studentStats.weeklyStreak} 🔥
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Day Streak
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box textAlign="center" sx={{ p: 2, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
                <Typography variant="h3" fontWeight={900} color="white">
                  {Math.round((studentStats.completedLessons / 150) * 100)}%
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Progress
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Motivational Footer */}
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 4,
            color: "white",
            boxShadow: "0 15px 35px rgba(102,126,234,0.3)",
          }}
        >
          <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
            🌟 "Every Expert Was Once a Beginner" 🌟
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Keep learning, keep growing, and unlock your full potential!
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)"
                }
              }}
            >
              🎯 Set Learning Goals
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "rgba(255,255,255,0.3)",
                color: "white",
                fontWeight: 700,
                borderRadius: 3,
                px: 4,
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.5)",
                  bgcolor: "rgba(255,255,255,0.1)"
                }
              }}
            >
              📚 View Study Plan
            </Button>
          </Box>
        </Box>

        {/* Add CSS animations */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            
            @keyframes rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    </Box>
  );
}