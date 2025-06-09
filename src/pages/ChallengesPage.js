import React, { useEffect, useState } from "react";
import { firestore } from "../services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import StudentDataForm from "../components/StudentDataForm";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Divider,
  Modal,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
  Paper
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import { styled } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";

// Styled components
const GradientCard = styled(Card)(({ theme, gradient }) => ({
  background: gradient,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8]
  }
}));

const HeroSection = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: "center"
}));

const CLASS_GROUPS = [
  {
    key: "Class I/II",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    title: "Little Champs",
    subtitle: "Class I-II",
    icon: <SchoolIcon fontSize="large" />
  },
  {
    key: "Class III-V",
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    title: "Rising Stars",
    subtitle: "Class III-V",
    icon: <EmojiEventsIcon fontSize="large" />
  },
  {
    key: "Class VI-X",
    gradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    title: "Word Wizards",
    subtitle: "Class VI-X",
    icon: <PeopleIcon fontSize="large" />
  }
];

const CATEGORY_COLORS = {
  "Dictation": "#FF7043",
  "Find the correct spelling": "#42A5F5",
  "Find the missing letter": "#66BB6A",
  "Unscramble": "#FFA726",
  "Spell the pic": "#AB47BC",
  "Correct Spelling": "#EC407A",
  "Spelling": "#EC407A"
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState({});
  const [showFormFor, setShowFormFor] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch challenges
        const docRef = doc(firestore, "MoAChallenges", "DWMSChallenges");
        const docSnap = await getDoc(docRef);
        
        // Fetch challenge stats
        const statsRef = collection(firestore, "ChallengeStats");
        const statsQuery = query(statsRef, where("active", "==", true));
        const statsSnapshot = await getDocs(statsQuery);
        
        const statsData = {};
        statsSnapshot.forEach(doc => {
          statsData[doc.id] = doc.data();
        });

        if (docSnap.exists()) {
          const allQuestions = docSnap.data().questions || [];
          const byClass = {};
          
          CLASS_GROUPS.forEach(({ key }) => {
            byClass[key] = allQuestions.find(
              q => (q.classGroup === key || q.classGroup === key.replace("-", "/")) &&
              q.difficultyLevel === "Rookie"
            );
          });

          setChallenges(byClass);
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStudentRegistration = (classGroup, data) => {
    navigate(`/challenge/rookie/${encodeURIComponent(classGroup)}`, {
      state: { student: data }
    });
  };

  const getWhatsAppShareUrl = (challengeTitle, classGroup) => {
    const text = encodeURIComponent(
      `Can you solve the "${challengeTitle}" challenge for ${classGroup}? Try it now on Master of Alphabet!`
    );
    return `https://wa.me/?text=${text}`;
  };

  const calculateTimeLeft = (endTime) => {
    if (!endTime) return "Challenge ended";
    return formatDistanceToNow(new Date(endTime.toDate()), { addSuffix: true });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <HeroSection elevation={6}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Master of Alphabet Challenges
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Test Your Spelling Skills and Win Exciting Prizes!
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', mt: 2 }}>
          Top performers receive special rewards. Weekly challenges with new opportunities to win!
        </Typography>
      </HeroSection>

      <Grid container spacing={4}>
        {CLASS_GROUPS.map(({ key, gradient, title, subtitle, icon }) => {
          const challenge = challenges[key];
          const challengeStats = stats[key] || {};
          
          return (
            <Grid item xs={12} key={key}>
              <GradientCard gradient={gradient}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                      {icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        {title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    <Chip
                      label={challenge?.category || "Spelling"}
                      size="small"
                      sx={{
                        backgroundColor: CATEGORY_COLORS[challenge?.category] || "#EC407A",
                        color: "white"
                      }}
                    />
                    <Chip
                      label="Weekly Challenge"
                      size="small"
                      color="primary"
                      icon={<EmojiEventsIcon fontSize="small" />}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {challenge ? (
                    <>
                      <Box mb={3}>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                          "Can you solve this week's challenge?"
                        </Typography>
                      </Box>

                      <Box display="flex" flexWrap="wrap" gap={3} mt={3}>
                        <Box display="flex" alignItems="center">
                          <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {calculateTimeLeft(challengeStats.endTime)}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <PeopleIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {challengeStats.submissions || 0} submissions
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <EmojiEventsIcon color="action" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {challengeStats.prizes || "5 prizes available"}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Challenge coming soon...
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => setShowFormFor(key)}
                    sx={{ fontWeight: 600 }}
                  >
                    Take Challenge
                  </Button>

                  <Tooltip title="Share on WhatsApp">
                    <IconButton
                      href={challenge ? getWhatsAppShareUrl(challenge.questionText, challenge.classGroup) : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on WhatsApp"
                      color="primary"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </GradientCard>

              {/* Registration Modal */}
              <Modal
                open={showFormFor === key}
                onClose={() => setShowFormFor(null)}
                aria-labelledby="registration-modal-title"
              >
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '90%', sm: 500 },
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2
                }}>
                  <Typography id="registration-modal-title" variant="h6" component="h2" gutterBottom>
                    Register for {title} Challenge
                  </Typography>
                  <StudentDataForm
                    showClassDropdown
                    allowedClasses={key}
                    onSubmit={(data) => handleStudentRegistration(key, data)}
                    onCancel={() => setShowFormFor(null)}
                    requireParentMobile
                  />
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                      onClick={() => setShowFormFor(null)}
                      variant="outlined"
                      color="secondary"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}