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
} from "@mui/material";

import { Trophy} from "lucide-react";

import {
  CheckCircle as CheckCircleIcon,
  FiberManualRecord as FiberManualRecordIcon
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
import Footer from "./Footer";

const offerImage =
  "https://img.freepik.com/free-vector/special-offer-discount-sale-banner-design_1017-31299.jpg?w=826&t=st=1718150000~exp=1718150600~hmac=8f6c8c1a2e9b6f6c6c1c0e6fbf2f1d379c8a1b1e1e8b6c8e3a3e9b8c2a5a4c7e";

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
  { text: "Take a Spelling Test", done: false },
  { text: "Practice Reading Skills", done: false },
  { text: "Complete today's Word of the Day", done: true },
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

// --- HeroSection Component ---
function HeroSection() {
  return (
    <section className="bg-gradient-to-tr from-blue-50 to-pink-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-8">
        <div className="flex-1 flex flex-col items-start md:items-start">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            Welcome to <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Master Of Alphabet!</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 md:max-w-lg">
            Unlock your English skills with <span className="font-bold text-blue-700">Spelling</span>, <span className="font-bold text-pink-600">Grammar</span>, <span className="font-bold text-orange-500">Pronunciation</span>, and more. Every day is a new opportunity to <span className="font-bold text-purple-600">shine</span>!
          </p>
          <div className="flex gap-4">
            <a href="/learn" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition">
              Start Learning
            </a>
            <a href="/word-of-the-day" className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-pink-600 transition">
              <Trophy className="w-5 h-5" /> Word of the Day
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end relative">
          <img
            src="https://cdn.pixabay.com/photo/2017/01/31/19/17/avatar-2026510_1280.png"
            alt="Student Celebrating"
            className="w-64 md:w-80 rounded-3xl shadow-xl border-4 border-white bg-gradient-to-tr from-blue-100 to-pink-200"
          />
          <div className="absolute md:static mt-[-3.5rem] ml-[-2rem] flex items-center">
            <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [tipIndex, setTipIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    setTipIndex(now.getDate() % skillTips.length);
  }, []);

  return (
    <Box
      
    >
      <HeroSection />

        {/* Specials, Offers, Promotions or Coupons Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            bgcolor: "linear-gradient(90deg,#fbc2eb 0%,#a6c1ee 100%)",
            borderRadius: 4,
            mb: 4,
            overflow: "hidden",
            boxShadow: 3,
            alignItems: "stretch",
          }}
        >
          {/* Offer Image */}
          <Box
            sx={{
              flex: 1,
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fff",
            }}
          >
            <img
              src={offerImage}
              alt="Specials, Offers, Promotions"
              style={{
                maxWidth: "92%",
                borderRadius: 16,
                boxShadow: "0 2px 24px #9995",
              }}
            />
          </Box>
          {/* Offer Buttons and GiveAway */}
          <Box
            sx={{
              flex: 1,
              py: 4,
              px: { xs: 2, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Stack direction="column" spacing={2} alignItems="center" sx={{ width: "100%" }}>
              {/* Top two buttons */}
              <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PaidIcon />}
                  sx={{ fontWeight: 700, flex: 1, fontSize: 17, borderRadius: 3 }}
                >
                  Pre-launch Price
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<LoyaltyIcon />}
                  sx={{ fontWeight: 700, flex: 1, fontSize: 17, borderRadius: 3 }}
                >
                  Exclusive Coupon
                </Button>
              </Stack>
              {/* Special GiveAway */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CardGiftcardIcon sx={{ fontSize: 32 }} />}
                sx={{
                  fontWeight: 800,
                  fontSize: 20,
                  borderRadius: 4,
                  py: 2,
                  width: "90%",
                  background: "linear-gradient(90deg,#fbc02d 0%,#ff8a65 100%)",
                  color: "#5d4037",
                  boxShadow: 3,
                  my: 2,
                }}
              >
                Special GiveAway
              </Button>
              {/* Bottom two buttons */}
              <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<LockOpenIcon />}
                  sx={{ fontWeight: 700, flex: 1, fontSize: 17, borderRadius: 3 }}
                >
                  Unlock Rewards
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<GroupWorkIcon />}
                  sx={{ fontWeight: 700, flex: 1, fontSize: 17, borderRadius: 3 }}
                >
                  Collab Challenges
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>


{/* Top 4 Boxes - Perfectly Equal Size */}
<Grid container spacing={3} sx={{ mb: 3 }}>
  {/* Skill Spotlight */}
  <Grid item xs={12} sm={6} md={3}>
    <Paper sx={{
      height: '100%',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#f2f7ff',
      borderRadius: 3,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: 32 }}>
        <TipsAndUpdatesIcon sx={{ fontSize: 28, color: '#ffb300' }} />
        <Typography variant="h6" fontWeight={700} ml={1} color="primary">
          Skill Spotlight
        </Typography>
      </Box>
      <Typography sx={{
        flexGrow: 1,
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        fontSize: 14,
        lineHeight: 1.4
      }}>
        Today's Module : <b>{skillTips[tipIndex].module}:</b>
      </Typography>
      <Button
        size="small"
        sx={{
          mt: 'auto',
          alignSelf: 'center',
          px: 0,
          textTransform: 'none',
          fontSize: 14,
          color: '#7b1fa2',
          fontWeight: 600
        }}
        onClick={() => navigate('/skill-spotlight')}
      >
        Explore Tips
      </Button>
    </Paper>
  </Grid>

  {/* Word of The Day */}
  <Grid item xs={12} sm={6} md={3}>
    <Paper sx={{
      height: '100%',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#fffde7',
      borderRadius: 3,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: 32 }}>
        <WorkspacePremiumIcon sx={{ fontSize: 28, color: '#ab47bc' }} />
        <Typography variant="h6" fontWeight={700} ml={1} color="secondary">
          Word of The Day
        </Typography>
      </Box>
      <Typography sx={{
        flexGrow: 1,
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        fontSize: 14,
        lineHeight: 1.4
      }}>
        Discover, learn, and use a new word every day!
      </Typography>
      <Button
        size="small"
        sx={{
          mt: 'auto',
          alignSelf: 'center',
          px: 0,
          textTransform: 'none',
          fontSize: 14,
          color: '#7b1fa2',
          fontWeight: 600
        }}
        onClick={() => navigate('/word-of-the-day')}
      >
        Explore Series
      </Button>
    </Paper>
  </Grid>

  {/* Daily Learning */}
  <Grid item xs={12} sm={6} md={3}>
    <Paper sx={{
      height: '100%',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#e0f2f1',
      borderRadius: 3,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: 32 }}>
        <BookIcon sx={{ fontSize: 28, color: '#00bfae' }} />
        <Typography variant="h6" fontWeight={700} ml={1} color="primary">
          Daily Learning
        </Typography>
      </Box>
      <Typography sx={{
        flexGrow: 1,
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        fontSize: 14,
        lineHeight: 1.4
      }}>
        Bite-sized lessons, every single day!
      </Typography>
      <Button
        size="small"
        sx={{
          mt: 'auto',
          alignSelf: 'center',
          px: 0,
          textTransform: 'none',
          fontSize: 14,
          color: '#00bfae',
          fontWeight: 600
        }}
        onClick={() => navigate('/learn')}
      >
        Start Learning
      </Button>
    </Paper>
  </Grid>

  {/* Daily Challenges */}
  <Grid item xs={12} sm={6} md={3}>
    <Paper sx={{
      height: '100%',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      bgcolor: '#e3f2fd',
      borderRadius: 3,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, minHeight: 32 }}>
        <EmojiEventsIcon sx={{ fontSize: 28, color: '#f57c00' }} />
        <Typography variant="h6" fontWeight={700} ml={1} color="warning.dark">
          Daily Challenges
        </Typography>
      </Box>
      <Typography sx={{
        flexGrow: 1,
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        fontSize: 14,
        lineHeight: 1.4
      }}>
        Compete, have fun, and win rewards!
      </Typography>
      <Button
        size="small"
        sx={{
          mt: 'auto',
          alignSelf: 'center',
          px: 0,
          textTransform: 'none',
          fontSize: 14,
          color: '#f57c00',
          fontWeight: 600
        }}
        onClick={() => navigate('/challenges')}
      >
        View Challenges
      </Button>
    </Paper>
  </Grid>
</Grid>


        {/* Skills Assessment (full width) */}
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

        {/* Explore Modules grid */}
        <Box
          sx={{
            mb: 4,
            py: 3,
            px: { xs: 1, md: 4 },
            bgcolor: "#f7f6fd",
            borderRadius: 4,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" fontWeight={800} color="primary" mb={3} textAlign="center">
            Explore Modules
          </Typography>
          <Grid container spacing={3}>
            {modules.map((mod, i) => (
              <Grid item xs={6} sm={3} md={3} key={mod.label}>
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
                  }}
                  onClick={() => navigate(mod.path)}
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

        {/* Skills Improvement L P T B C */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: "#f3e5f5",
            borderRadius: 4,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" fontWeight={800} color="secondary.dark" mb={2}>
            Skills Improvement
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
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
                }}
                onClick={() => navigate(btn.path)}
              >
                {btn.label}
              </Button>
            ))}
          </Stack>
        </Box>


{/* BOTTOM 3 BOXES - PERFECTLY EQUAL */}
<Grid container spacing={3}>
  {/* Things to Do */}
  <Grid item xs={12} md={4}>
    <Paper sx={{
      height: '100%',
      minHeight: 240,
      p: 2,
      bgcolor: '#fffde7',
      borderRadius: 3,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <ChecklistIcon color="warning" sx={{ flexShrink: 0 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          ml={1}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Things to Do
        </Typography>
      </Box>
      <Box sx={{
        '& > *': {
          fontSize: 14,
          lineHeight: 1.5,
          wordBreak: 'break-word'
        }
      }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 24,
              height: 24,
              border: '1px solid',
              borderColor: 'grey.400',
              borderRadius: '4px',
              mr: 1.5,
              flexShrink: 0
            }}/>
            <Typography fontWeight={600}>Take a Spelling Test</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 24,
              height: 24,
              border: '1px solid',
              borderColor: 'grey.400',
              borderRadius: '4px',
              mr: 1.5,
              flexShrink: 0
            }}/>
            <Typography fontWeight={600}>Practice Reading Skills</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon sx={{ color: 'success.main', mr: 1.5, flexShrink: 0 }} />
            <Typography sx={{ color: 'grey.600', textDecoration: 'line-through' }}>
              Complete today's Word of the Day
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  </Grid>

  {/* Announcements */}
  <Grid item xs={12} md={4}>
    <Paper sx={{
      height: '100%',
      minHeight: 240,
      p: 2,
      bgcolor: '#e3f2fd',
      borderRadius: 3,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <CampaignIcon color="primary" sx={{ flexShrink: 0 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          ml={1}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Announcements
        </Typography>
      </Box>
      <Stack spacing={2}>
        <Box sx={{
          borderLeft: '3px solid',
          borderColor: 'warning.main',
          pl: 1.5,
          py: 0.5
        }}>
          <Typography fontWeight={700} fontSize={14}>
            June Challenge Winners!
          </Typography>
          <Typography variant="caption" color="text.secondary">
            2025-06-05
          </Typography>
          <Typography fontSize={13} sx={{ mt: 0.5, wordBreak: 'break-word', whiteSpace: 'normal' }}>
 Congratulations for topping our June Spelling Challenge!
</Typography>


        </Box>
        {/* Repeat for other announcements */}
      </Stack>
    </Paper>
  </Grid>

  {/* Updates */}
  <Grid item xs={12} md={4}>
    <Paper sx={{
      height: '100%',
      minHeight: 240,
      p: 2,
      bgcolor: '#f1f8e9',
      borderRadius: 3,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <BoltIcon color="success" sx={{ flexShrink: 0 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          ml={1}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          Updates
        </Typography>
      </Box>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex' }}>
          <FiberManualRecordIcon sx={{
            fontSize: 8,
            color: 'success.main',
            mt: 0.8,
            mr: 1.5,
            flexShrink: 0
          }} />
          <Box>
            <Typography fontSize={14} sx={{ wordBreak: 'break-word' }}>
              10 new Grammar Test questions added for Class VI-X.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2025-06-06
            </Typography>
          </Box>
        </Box>
        {/* Repeat for other updates */}
      </Stack>
    </Paper>
  </Grid>
</Grid>
 <Footer />
      </Box>
  );
}