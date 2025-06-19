import React, { useEffect, useState } from "react";
import { firestore, auth } from "../services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import StudentDataForm from "../components/StudentDataForm";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Modal,
  Avatar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";
import StudentWelcomeSection from "../components/StudentWelcomeSection";

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  textAlign: "center",
  width: "100%"
}));

const CLASS_GROUPS = [
  {
    key: "Class I/II",
    gradient: { from: "#ff9a9e", to: "#fad0c4" },
    title: "Little Champs",
    subtitle: "Class I-II",
    icon: "🎓"
  },
  {
    key: "Class III-V",
    gradient: { from: "#a1c4fd", to: "#c2e9fb" },
    title: "Rising Stars",
    subtitle: "Class III-V",
    icon: "🏆"
  },
  {
    key: "Class VI-X",
    gradient: { from: "#84fab0", to: "#8fd3f4" },
    title: "Word Wizards",
    subtitle: "Class VI-X",
    icon: "🧙‍♂️"
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(firestore, "MoAChallenges", "DWMSChallenges");
        const docSnap = await getDoc(docRef);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleStudentRegistration = (classGroup, data) => {
    const challengeType = "daily";
    const studentData = { ...data, classGroup };
    navigate(`/challenge/${challengeType}`, {
      state: { student: studentData }
    });
  };

  const handleTakeChallenge = (classGroup) => {
    if (user) {
      const studentData = {
        name: user.displayName || user.email || "Anonymous",
        studentId: user.uid,
        classGroup,
      };
      handleStudentRegistration(classGroup, studentData);
    } else {
      setShowFormFor(classGroup);
    }
  };

  const getWhatsAppShareUrl = (challengeTitle, classGroup) => {
    const text = encodeURIComponent(
      `Can you solve the "${challengeTitle}" challenge for ${classGroup}? Try it now on Master of Alphabet!`
    );
    return `https://wa.me/?text=${text}`;
  };

  const calculateTimeLeft = (endTime) => {
    if (!endTime) return "Challenge ended";
    try {
      const now = new Date();
      const endDate = endTime.toDate ? endTime.toDate() : new Date(endTime);
      const diff = endDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `${days}d ${hours}h left`;
      if (hours > 0) return `${hours}h left`;
      return "Ending soon";
    } catch (e) {
      console.error("Error calculating time left:", e);
      return "Time info unavailable";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Full-width welcome section */}
      <Box sx={{ width: "100%", bgcolor: "#f0f4ff", py: 2 }}>
        <StudentWelcomeSection />
      </Box>

      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Master of Alphabet
          <Box component="span" sx={{ 
            display: 'block',
            background: 'linear-gradient(to right, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '0.8em'
          }}>
            Challenges
          </Box>
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Test Your Spelling Skills and Win Exciting Prizes!
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', mt: 2 }}>
          Top performers receive special rewards. Weekly challenges with new opportunities to win!
        </Typography>
      </HeroSection>

      {/* Challenge Cards Section */}
      <Box sx={{ 
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 4, md: 6 },
        py: 6
      }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Choose Your Challenge Level
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
            Select the challenge that matches your grade level and start your spelling adventure!
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 4 }}>
          {CLASS_GROUPS.map(({ key, gradient, title, subtitle, icon }) => {
            const challenge = challenges[key] || {};
            const challengeStats = stats[key] || {};

            return (
              <Box
                key={key}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                  backgroundColor: 'background.paper',
                  boxShadow: 3,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Background Gradient */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                  opacity: 0.05,
                  '&:hover': { opacity: 0.1 },
                  transition: 'opacity 0.5s'
                }} />

                <Box sx={{ p: 4, position: 'relative' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    justifyContent: 'space-between',
                    gap: 4
                  }}>
                    {/* Left Section - Challenge Info */}
                    <Box sx={{ flex: 1 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ 
                          width: 64, 
                          height: 64,
                          backgroundColor: gradient.from,
                          backgroundImage: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
                          fontSize: '2rem'
                        }}>
                          {icon}
                        </Avatar>
                        <Box sx={{ ml: 3 }}>
                          <Typography variant="h5" component="h3" sx={{ fontWeight: 700 }}>
                            {title}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            {subtitle}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Category Badge */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        <Box sx={{
                          px: 3,
                          py: 1,
                          borderRadius: '16px',
                          backgroundColor: CATEGORY_COLORS[challenge?.category] || '#EC407A',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: 1,
                          fontSize: '0.875rem'
                        }}>
                          {challenge?.category || "Spelling"}
                        </Box>
                        <Box sx={{
                          px: 3,
                          py: 1,
                          borderRadius: '16px',
                          background: 'linear-gradient(to right, #FFD700, #FFA500)',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: 1,
                          fontSize: '0.875rem'
                        }}>
                          🏆 Weekly Challenge
                        </Box>
                      </Box>

                      {/* Challenge Description */}
                      {challenge?.questionText ? (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body1" sx={{ 
                            fontStyle: 'italic',
                            mb: 2,
                            backgroundColor: 'grey.50',
                            p: 2,
                            borderRadius: 2,
                            borderLeft: '4px solid',
                            borderColor: 'primary.main'
                          }}>
                            "{challenge.questionText}"
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body1" sx={{ 
                            color: 'text.disabled',
                            backgroundColor: 'grey.50',
                            p: 2,
                            borderRadius: 2
                          }}>
                            Challenge coming soon...
                          </Typography>
                        </Box>
                      )}

                      {/* Stats */}
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                        gap: 2,
                        mb: 3
                      }}>
                        <Box sx={{ 
                          backgroundColor: 'rgba(66, 165, 245, 0.1)',
                          p: 2,
                          borderRadius: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>⏰</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                            {calculateTimeLeft(challengeStats.endTime)}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          backgroundColor: 'rgba(102, 187, 106, 0.1)',
                          p: 2,
                          borderRadius: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>👥</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                            {challengeStats.submissions || 0} submissions
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          backgroundColor: 'rgba(171, 71, 188, 0.1)',
                          p: 2,
                          borderRadius: 2,
                          textAlign: 'center'
                        }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>🎁</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.dark' }}>
                            {challengeStats.prizes || "5 prizes"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Right Section - Actions */}
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: { xs: 'center', md: 'flex-end' },
                      gap: 2,
                      minWidth: { md: '200px' }
                    }}>
                      {/* Main Action Button */}
                      <Box
                        component="button"
                        onClick={() => handleTakeChallenge(key)}
                        disabled={!user}
                        sx={{
                          px: 4,
                          py: 2,
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '1rem',
                          transition: 'all 0.3s',
                          transform: 'translateY(0)',
                          boxShadow: 2,
                          background: user 
                            ? `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`
                            : 'grey.300',
                          color: user ? 'white' : 'grey.500',
                          border: 'none',
                          cursor: user ? 'pointer' : 'not-allowed',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': user ? {
                            boxShadow: 4,
                            '&::after': {
                              opacity: 0.2
                            }
                          } : {},
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            opacity: 0,
                            transition: 'opacity 0.3s'
                          }
                        }}
                      >
                        {user ? "Take Challenge" : "Login to Take Challenge"}
                      </Box>

                      {/* Share Button */}
                      <Box
                        component="a"
                        href={challenge?.questionText ? getWhatsAppShareUrl(challenge.questionText, challenge.classGroup) : "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 3,
                          py: 1.5,
                          backgroundColor: '#25D366',
                          color: 'white',
                          borderRadius: '16px',
                          fontWeight: 600,
                          transition: 'all 0.3s',
                          textDecoration: 'none',
                          '&:hover': {
                            backgroundColor: '#128C7E',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        Share
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Bottom CTA Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 8,
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          borderRadius: 4,
          p: 4,
          color: 'white'
        }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2 }}>
           Ready to Jump In and Attempt the Challenges and Win Prizes/Rewards?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
           Compete with Students for Daily, Weekly, Monthly and Special Challenges at National Level!
          </Typography>
          <Box
            component="button"
            sx={{
              px: 4,
              py: 2,
              backgroundColor: 'white',
              color: 'primary.main',
              borderRadius: '24px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 2
              }
            }}
          >
            Buy a 1/3/12 Month(s) Premium Subscription Today
          </Box>
        </Box>
      </Box>

      {/* Registration Modal */}
      <Modal
        open={Boolean(showFormFor)}
        onClose={() => setShowFormFor(null)}
        aria-labelledby="registration-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          backgroundColor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography id="registration-modal-title" variant="h6" component="h2" gutterBottom>
            Register for {showFormFor ? CLASS_GROUPS.find(c => c.key === showFormFor)?.title : ''} Challenge
          </Typography>
          <StudentDataForm
            showClassDropdown
            allowedClasses={showFormFor}
            onSubmit={(data) => {
              handleStudentRegistration(showFormFor, data);
              setShowFormFor(null);
            }}
            onCancel={() => setShowFormFor(null)}
            requireParentMobile
          />
        </Box>
      </Modal>
    </Box>
  );
}