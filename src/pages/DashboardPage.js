import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Alert,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SchoolIcon from "@mui/icons-material/School";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { amber, blue, green, orange, deepPurple, pink } from "@mui/material/colors";

// --- MOCK DATA ---

const user = {
  name: "Aanya Sharma",
  avatar: "",
  level: "Word Wizard",
  streak: 5,
  points: 560,
  progress: 0.7,
};

const activeChallenges = [
  {
    id: 1,
    title: "Spelling Blitz",
    progress: 0.6,
    type: "Daily",
    due: "2h left",
    color: orange[400],
  },
  {
    id: 2,
    title: "Vocab Sprint",
    progress: 0.2,
    type: "Weekly",
    due: "1 day left",
    color: blue[400],
  },
];

const achievements = [
  {
    id: 1,
    icon: <EmojiEventsIcon sx={{ color: amber[800] }} />,
    title: "1st Place: Spelling Blitz",
    date: "2025-06-05",
  },
  {
    id: 2,
    icon: <CheckCircleIcon sx={{ color: blue[400] }} />,
    title: "New Badge: Grammar Guru",
    date: "2025-06-03",
  },
];

const leaderboard = {
  rank: 8,
  top: [
    { name: "Simran Kaur", avatar: "", rank: 1 },
    { name: "Rahul Singh", avatar: "", rank: 2 },
    { name: "Krishna Rao", avatar: "", rank: 3 },
  ],
};

const recommendations = [
  {
    id: 1,
    icon: <AssignmentTurnedInIcon sx={{ color: green[700] }} />,
    text: 'Try "Word Builders" challenge',
  },
  {
    id: 2,
    icon: <TipsAndUpdatesIcon sx={{ color: deepPurple[400] }} />,
    text: 'Watch: "5 Tips for Spelling Bees"',
  },
];

const activity = [
  {
    id: 1,
    icon: <CalendarMonthIcon sx={{ color: pink[400] }} />,
    text: "Joined Word Builders",
    date: "Today",
  },
  {
    id: 2,
    icon: <AssignmentTurnedInIcon sx={{ color: blue[400] }} />,
    text: "Completed Reading Marathon",
    date: "Yesterday",
  },
];

const notifications = [
  {
    id: 1,
    type: "announcement",
    icon: <NewReleasesIcon color="warning" />,
    message: "Mega Quiz on June 15th!",
    date: "Today",
  },
  {
    id: 2,
    type: "reminder",
    icon: <NotificationsActiveIcon color="primary" />,
    message: "Vocab Sprint: 1 day left to participate!",
    date: "2h ago",
  },
];

// --- COMPONENTS ---

function DashboardCard({ title, icon, children, actions, ...rest }) {
  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 4,
        mb: 2,
        p: 0,
        overflow: "visible",
        ...rest.sx,
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
          {icon}
          <Typography fontWeight={700} fontSize={18}>
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
      {actions && <CardActions sx={{ pt: 0, pb: 1 }}>{actions}</CardActions>}
    </Card>
  );
}

function ChallengeProgress({ challenge }) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#fff",
        borderRadius: 2,
        mb: 1.5,
        p: 1.5,
        borderLeft: `5px solid ${challenge.color}`,
        minWidth: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontWeight={600} fontSize={16} noWrap maxWidth={180}>
              {challenge.title}
            </Typography>
            <Chip
              label={challenge.type}
              size="small"
              sx={{
                fontWeight: 500,
                bgcolor: challenge.type === "Daily" ? orange[50] : blue[50],
                color: challenge.type === "Daily" ? orange[700] : blue[700],
              }}
            />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={challenge.progress * 100}
            sx={{
              height: 6,
              borderRadius: 3,
              mt: 1,
              bgcolor: "#eee",
              "& .MuiLinearProgress-bar": {
                bgcolor: challenge.color,
              },
            }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography fontSize={13} color="text.secondary" mt={0.5}>
              {Math.round(challenge.progress * 100)}% complete
            </Typography>
            <Typography fontSize={13} color="text.secondary" mt={0.5}>
              {challenge.due}
            </Typography>
          </Stack>
        </Stack>
        <Button
          variant="contained"
          size="small"
          color="primary"
          sx={{ fontWeight: 700, borderRadius: 2, ml: 2, minWidth: 90 }}
        >
          {challenge.progress < 1 ? "Continue" : "View"}
        </Button>
      </Stack>
    </Paper>
  );
}

function AchievementItem({ achievement }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.2} mb={1}>
      {achievement.icon}
      <Typography fontWeight={600} fontSize={15} color="text.primary">
        {achievement.title}
      </Typography>
      <Typography fontSize={13} color="text.secondary">
        ({achievement.date})
      </Typography>
    </Stack>
  );
}

function LeaderboardMini({ leaderboard }) {
  return (
    <Box>
      <Typography fontSize={14} color="text.secondary" mb={1}>
        You’re <b>#{leaderboard.rank}</b> in your class this week!
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        {leaderboard.top.map((item, idx) => (
          <Tooltip title={`#${item.rank} ${item.name}`} key={item.name}>
            <Badge
              badgeContent={item.rank}
              color={idx === 0 ? "warning" : idx === 1 ? "secondary" : "info"}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar sx={{ bgcolor: [amber[200], blue[100], deepPurple[100]][idx] }}>
                {item.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </Avatar>
            </Badge>
          </Tooltip>
        ))}
      </Stack>
      <Button
        variant="outlined"
        size="small"
        color="primary"
        endIcon={<ArrowForwardIosIcon fontSize="small" />}
        href="/leaderboards"
        sx={{ fontWeight: 600, mt: 1 }}
      >
        See All
      </Button>
    </Box>
  );
}

function RecommendationList({ recommendations }) {
  return (
    <List dense disablePadding>
      {recommendations.map((rec) => (
        <ListItem key={rec.id} dense disableGutters sx={{ pl: 0 }}>
          <ListItemAvatar sx={{ minWidth: 34 }}>{rec.icon}</ListItemAvatar>
          <ListItemText
            primary={
              <Typography fontSize={14} fontWeight={500}>
                {rec.text}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function ActivityList({ activity }) {
  return (
    <List dense disablePadding>
      {activity.map((item) => (
        <ListItem key={item.id} dense disableGutters sx={{ pl: 0 }}>
          <ListItemAvatar sx={{ minWidth: 34 }}>{item.icon}</ListItemAvatar>
          <ListItemText
            primary={
              <Typography fontSize={14} fontWeight={500}>
                {item.text}
              </Typography>
            }
            secondary={
              <Typography fontSize={12} color="text.secondary">
                {item.date}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}

function NotificationPanel({ notifications }) {
  if (!notifications.length) return null;
  return (
    <Stack spacing={1} mt={2}>
      {notifications.map((notif) => (
        <Alert
          key={notif.id}
          icon={notif.icon}
          severity={notif.type === "announcement" ? "success" : "info"}
          sx={{ fontWeight: 500, borderRadius: 2, alignItems: "center", py: 0.5, pl: 1.2 }}
        >
          {notif.message}
          <Typography
            component="span"
            fontSize={12}
            color="text.secondary"
            sx={{ ml: 1.5, fontWeight: 400 }}
          >
            {notif.date}
          </Typography>
        </Alert>
      ))}
    </Stack>
  );
}

// --- MAIN DASHBOARD ---
export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fc",
        pb: 6,
        pt: { xs: 2, sm: 5 },
      }}
    >
      <Box
        sx={{
          maxWidth: 960,
          mx: "auto",
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* Welcome Block */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 5,
            p: { xs: 2, sm: 4 },
            mb: 4,
            bgcolor: "#fff",
            boxShadow: "0 10px 36px 0 rgba(80,130,250,.12)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: blue[100],
                    fontSize: 32,
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} mb={0.5}>
                    Hi, {user.name}!
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mb={0.2}>
                    <Chip
                      icon={<StarIcon sx={{ color: amber[700] }} />}
                      label={user.level}
                      color="warning"
                      sx={{ fontWeight: 700, fontSize: 14 }}
                    />
                    <Chip
                      icon={<WhatshotIcon sx={{ color: orange[700] }} />}
                      label={`Streak: ${user.streak} days`}
                      sx={{
                        bgcolor: orange[50],
                        color: orange[900],
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    />
                  </Stack>
                  <Typography fontSize={15} color="text.secondary" fontWeight={500}>
                    Keep up your excellent progress!
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={4} mt={{ xs: 2, sm: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: blue[50],
                  textAlign: "center",
                }}
              >
                <Typography fontWeight={600} fontSize={17} color={blue[800]}>
                  Points
                </Typography>
                <Typography fontWeight={800} fontSize={25} color={blue[700]}>
                  {user.points} <StarIcon fontSize="small" sx={{ color: amber[600], mb: "-4px" }} />
                </Typography>
                <Typography fontSize={14} color="text.secondary" mt={1}>
                  Progress to next level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={user.progress * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mt: 0.5,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: blue[400],
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Active Challenges */}
            <DashboardCard
              title="Your Active Challenges"
              icon={<AssignmentTurnedInIcon color="primary" />}
              actions={
                <Button variant="text" size="small" color="primary" href="/challenges">
                  Join New Challenge
                </Button>
              }
            >
              {activeChallenges.length ? (
                activeChallenges.map((c) => <ChallengeProgress key={c.id} challenge={c} />)
              ) : (
                <Typography fontSize={14} color="text.secondary" my={2}>
                  No active challenges. <Button href="/challenges">Join one now!</Button>
                </Typography>
              )}
            </DashboardCard>

            {/* Achievements */}
            <DashboardCard
              title="Recent Achievements"
              icon={<EmojiEventsIcon sx={{ color: amber[800] }} />}
              actions={
                <Button variant="text" size="small" color="primary" href="/achievements">
                  View All
                </Button>
              }
            >
              {achievements.length ? (
                achievements.map((a) => <AchievementItem achievement={a} key={a.id} />)
              ) : (
                <Typography fontSize={14} color="text.secondary" my={2}>
                  No achievements yet. Complete a challenge to earn one!
                </Typography>
              )}
            </DashboardCard>

            {/* Leaderboard */}
            <DashboardCard
              title="Leaderboard"
              icon={<LeaderboardIcon color="secondary" />}
            >
              <LeaderboardMini leaderboard={leaderboard} />
            </DashboardCard>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Recommendations */}
            <DashboardCard
              title="Suggestions For You"
              icon={<TipsAndUpdatesIcon sx={{ color: deepPurple[400] }} />}
              sx={{ bgcolor: deepPurple[50] }}
            >
              <RecommendationList recommendations={recommendations} />
            </DashboardCard>

            {/* Activity Timeline */}
            <DashboardCard
              title="Recent Activity"
              icon={<SchoolIcon color="success" />}
              sx={{ bgcolor: green[50] }}
              actions={
                <Button variant="text" size="small" color="success" href="/activity">
                  View All
                </Button>
              }
            >
              <ActivityList activity={activity} />
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Notifications / Announcements */}
        <NotificationPanel notifications={notifications} />

        {/* Quick Actions / Footer */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={5} alignItems="center" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            color="primary"
            href="/challenges"
            startIcon={<AssignmentTurnedInIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, minWidth: 170 }}
          >
            Join New Challenge
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="secondary"
            href="/certificates"
            startIcon={<InsertEmoticonIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, minWidth: 170 }}
          >
            View Certificates
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="info"
            href="/support"
            startIcon={<NotificationsActiveIcon />}
            sx={{ borderRadius: 2, fontWeight: 700, minWidth: 170 }}
          >
            Support
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}