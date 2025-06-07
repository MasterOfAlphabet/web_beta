import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  CircularProgress,
  Tooltip,
  Button,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { amber, blue, grey, orange } from "@mui/material/colors";

// Sample Data Generation
const generateSampleData = () => {
  const districts = ["Hyderabad", "Warangal", "Rangareddy", "Khammam", "Nizamabad"];
  const schools = [
    "Telangana Model School",
    "Kendriya Vidyalaya",
    "Delhi Public School",
    "St. Ann's High School",
    "GVMC High School",
  ];
  let data = {};
  [
    "Spelling",
    "Reading",
    "Grammar",
    "Vocabulary",
    "Writing",
    "Listening",
    "S.H.A.R.P",
    "All Modules",
  ].forEach((module) => {
    data[module] = {};
    ["Daily", "Weekly", "Monthly", "All-Time"].forEach((timeframe) => {
      data[module][timeframe] = {};
      ["Class", "School", "District", "State", "National"].forEach((category) => {
        const count = Math.floor(Math.random() * 15) + 3; // 3-18 participants
        data[module][timeframe][category] = Array.from({ length: count }, (_, i) => ({
          rank: i + 1,
          name: i === 4 ? "You" : ["Rajesh", "Priya", "Arjun", "Sneha", "Amit", "Kavitha", "Rahul"][
            Math.floor(Math.random() * 7)
          ],
          school: schools[Math.floor(Math.random() * schools.length)],
          district: districts[Math.floor(Math.random() * districts.length)],
          score: Math.floor(Math.random() * 1000) + 500,
          pic: `https://randomuser.me/api/portraits/${
            Math.random() > 0.5 ? "men" : "women"
          }/${Math.floor(Math.random() * 50)}.jpg`,
        }));
      });
    });
  });
  return data;
};

const MODULES = [
  "Spelling",
  "Reading",
  "Grammar",
  "Vocabulary",
  "Writing",
  "Listening",
  "S.H.A.R.P",
  "All Modules",
];
const TIMEFRAMES = ["Daily", "Weekly", "Monthly", "All-Time"];
const CATEGORIES = ["Class", "School", "District", "State", "National"];

// Enhanced badge system
const getBadge = (rank) => {
  const badges = {
    1: {
      icon: <EmojiEventsIcon sx={{ color: amber[500] }} fontSize="small" />,
      color: amber[100],
      title: "Crown Champion",
    },
    2: {
      icon: <TrendingUpIcon sx={{ color: grey[400] }} fontSize="small" />,
      color: grey[100],
      title: "Speed Master",
    },
    3: {
      icon: <StarIcon sx={{ color: orange[300] }} fontSize="small" />,
      color: orange[50],
      title: "Elite Performer",
    },
  };
  return badges[rank] || null;
};

// New Feature: Top 3 Podium
function Podium({ data }) {
  const top3 = [data[1], data[0], data[2]]; // 2nd, 1st, 3rd for visual effect
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="end"
      spacing={2}
      sx={{ mb: 3, mt: 2, minHeight: 90 }}
      wrap="nowrap"
    >
      {top3.map((item, idx) =>
        item ? (
          <Grid item key={item.rank} xs={4} sx={{ textAlign: "center" }}>
            <Tooltip title={getBadge(item.rank)?.title || ""}>
              <Box
                sx={{
                  bgcolor: getBadge(item.rank)?.color || "#f2f2f2",
                  borderRadius: "50%",
                  mx: "auto",
                  width: idx === 1 ? 78 : 62,
                  height: idx === 1 ? 78 : 62,
                  zIndex: idx === 1 ? 1 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    idx === 1
                      ? "3px solid #FFC107"
                      : "2px solid #e0e0e0",
                  boxShadow: idx === 1 ? 3 : 1,
                  mb: idx === 1 ? 0 : 2,
                }}
              >
                <Avatar
                  src={item.pic}
                  sx={{
                    width: idx === 1 ? 56 : 44,
                    height: idx === 1 ? 56 : 44,
                    fontWeight: "bold",
                    fontSize: 22,
                  }}
                >
                  {item.name[0]}
                </Avatar>
              </Box>
            </Tooltip>
            <Typography
              mt={1}
              fontWeight={700}
              fontSize={idx === 1 ? 16 : 14}
              color={idx === 1 ? "primary.main" : "text.secondary"}
              noWrap
              title={item.name}
            >
              {item.name}
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              #{item.rank} • {item.score} pts
            </Typography>
          </Grid>
        ) : (
          <Grid item xs={4} key={idx} />
        )
      )}
    </Grid>
  );
}

// New Feature: My Stats Card
function MyStatsCard({ youData, rank }) {
  if (!youData)
    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          bgcolor: "#f9f9fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography color="text.secondary" fontWeight={500}>
          You are not on this leaderboard yet. Join a challenge to get ranked!
        </Typography>
      </Paper>
    );
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        boxShadow: 2,
      }}
    >
      <Avatar
        src={youData.pic}
        sx={{ width: 56, height: 56, border: "2px solid #1976d2", mr: 2 }}
      >
        {youData.name[0]}
      </Avatar>
      <Box flex={1}>
        <Typography fontWeight={700} fontSize={18}>
          {youData.name}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
          <Chip
            icon={<SchoolIcon fontSize="small" />}
            label={youData.school}
            size="small"
            sx={{ bgcolor: blue[50], fontWeight: 500 }}
          />
          <Chip
            icon={<LocationOnIcon fontSize="small" />}
            label={youData.district}
            size="small"
            sx={{ bgcolor: amber[50], fontWeight: 500 }}
          />
        </Stack>
      </Box>
      <Stack alignItems="flex-end">
        <Typography fontWeight={700} color="primary" fontSize={17}>
          Rank #{rank}
        </Typography>
        <Typography fontSize={15} color="text.secondary">
          {youData.score} pts
        </Typography>
      </Stack>
    </Paper>
  );
}

// New Feature: Share Button
function ShareLeaderboardButton({ module, timeframe, category }) {
  const shareText = `Check out the ${category} ${module} leaderboard (${timeframe}) on Master of Alphabet!`;
  return (
    <Tooltip title="Share Leaderboard">
      <Button
        variant="outlined"
        size="small"
        startIcon={<LeaderboardIcon />}
        sx={{ fontWeight: 600, borderRadius: 2 }}
        onClick={() => navigator?.clipboard.writeText(shareText)}
      >
        Share
      </Button>
    </Tooltip>
  );
}

export default function LeaderboardsPage() {
  const [selectedModule, setSelectedModule] = useState(MODULES[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[0]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // For mobile tabs (optional, can use dropdowns)
  const [tabValue, setTabValue] = useState(0);

  // Load data (simulate API call)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLeaderboardData(generateSampleData());
      setLoading(false);
    }, 800);
  }, []);

  // Get leaderboard for current settings
  const currentData =
    leaderboardData?.[selectedModule]?.[selectedTimeframe]?.[selectedCategory] || [];

  // Find "You" and rank
  const youIndex = currentData.findIndex((item) => item.name === "You");
  const youData = youIndex >= 0 ? currentData[youIndex] : null;

  // Filter for search
  const filteredData = useMemo(() => {
    return currentData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, currentData]);

  // For podium, always show top 3 (even if filtered)
  const podiumData = currentData.slice(0, 3);

  // Feature: Download as CSV
  const handleDownloadCSV = () => {
    const rows = [
      ["Rank", "Name", "School", "District", "Score"],
      ...filteredData.map((item) => [
        item.rank,
        item.name,
        item.school,
        item.district,
        item.score,
      ]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fc", py: { xs: 1, md: 4 } }}>
      <Box
        sx={{
          maxWidth: 880,
          mx: "auto",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper
          elevation={5}
          sx={{
            borderRadius: 5,
            p: { xs: 2, sm: 4 },
            mb: 4,
            bgcolor: "#fff",
            boxShadow: "0 10px 36px 0 rgba(80,130,250,.12)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            mb={2}
            spacing={2}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              color="primary"
              sx={{ letterSpacing: 1 }}
            >
              Telangana Champions
            </Typography>
            <Stack direction="row" spacing={2}>
              <ShareLeaderboardButton
                module={selectedModule}
                timeframe={selectedTimeframe}
                category={selectedCategory}
              />
              <Tooltip title="Download leaderboard as CSV">
                <IconButton
                  aria-label="Download CSV"
                  color="primary"
                  onClick={handleDownloadCSV}
                >
                  <AssignmentTurnedInIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Filters */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "#f9f9fc",
              borderRadius: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              select
              label="Module"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              sx={{ minWidth: 130, bgcolor: "#fff", borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterAltIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
            >
              {MODULES.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Timeframe"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              sx={{ minWidth: 130, bgcolor: "#fff", borderRadius: 2 }}
            >
              {TIMEFRAMES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ minWidth: 130, bgcolor: "#fff", borderRadius: 2 }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: 180, bgcolor: "#fff", borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {/* Heading & Subtitle */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <Stack>
              <Typography fontWeight={700} fontSize={20} mb={0.5}>
                {selectedCategory} • {selectedModule}
              </Typography>
              <Typography fontSize={15} color="text.secondary">
                {selectedTimeframe} • {filteredData.length} participants
              </Typography>
            </Stack>
            {/* Optional: leaderboard tabs for mobile */}
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 36, ".MuiTabs-flexContainer": { gap: 1 } }}
            >
              {MODULES.slice(0, 4).map((m, i) => (
                <Tab
                  key={m}
                  label={m}
                  value={i}
                  sx={{
                    fontWeight: selectedModule === m ? 700 : 500,
                    color: selectedModule === m ? "primary.main" : "text.secondary",
                    minHeight: 36,
                  }}
                  onClick={() => setSelectedModule(m)}
                />
              ))}
            </Tabs>
          </Stack>

          {loading ? (
            <Box
              sx={{
                py: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress size={40} color="primary" />
              <Typography mt={2} fontSize={17} color="primary">
                Loading Leaderboards...
              </Typography>
            </Box>
          ) : (
            <>
              {/* My Stats */}
              <MyStatsCard youData={youData} rank={youIndex + 1} />

              {/* Podium */}
              {podiumData.length > 0 && <Podium data={podiumData} />}

              <Divider sx={{ my: 2 }} />

              {/* Leaderboard List */}
              {filteredData.length > 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#f7fafd",
                    borderRadius: 3,
                    px: { xs: 0, sm: 2 },
                  }}
                >
                  <Grid container direction="column" spacing={1}>
                    {filteredData.map((item, idx) => {
                      const badge = getBadge(item.rank);
                      return (
                        <Grid item key={item.rank + item.name}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1,
                              px: 1,
                              borderRadius: 2,
                              bgcolor: badge ? badge.color : "#fff",
                              boxShadow: badge ? 2 : 0,
                              borderLeft: badge
                                ? `6px solid ${badge.icon.props.sx.color}`
                                : undefined,
                              transition: "box-shadow .15s",
                              "&:hover": {
                                boxShadow: 3,
                                bgcolor: "#f9f9f9",
                              },
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight={800}
                              color="primary"
                              sx={{ width: 34, textAlign: "center", mr: 1 }}
                            >
                              {item.rank}
                            </Typography>
                            <Avatar
                              src={item.pic}
                              sx={{
                                width: 38,
                                height: 38,
                                border: "1.5px solid #1976d2",
                                mr: 1.5,
                              }}
                            >
                              {item.name[0]}
                            </Avatar>
                            <Box flex={1} minWidth={0}>
                              <Typography
                                fontWeight={item.name === "You" ? 800 : 600}
                                noWrap
                                sx={{
                                  color:
                                    item.rank === 1
                                      ? "primary.main"
                                      : item.rank === 2
                                      ? grey[800]
                                      : item.rank === 3
                                      ? orange[600]
                                      : "#222",
                                }}
                              >
                                {item.name}
                                {item.name === "You" && (
                                  <Chip
                                    size="small"
                                    label="You"
                                    color="info"
                                    sx={{
                                      ml: 1,
                                      fontWeight: 700,
                                      bgcolor: blue[100],
                                    }}
                                  />
                                )}
                              </Typography>
                              <Typography
                                fontSize={13}
                                color="text.secondary"
                                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                              >
                                {item.school} • {item.district}
                              </Typography>
                            </Box>
                            <Stack alignItems="flex-end" sx={{ minWidth: 92 }}>
                              <Typography fontSize={15} fontWeight={700} color="primary">
                                {item.score} pts
                              </Typography>
                              {badge && (
                                <Tooltip title={badge.title}>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    {badge.icon}
                                    <Typography fontSize={12} fontWeight={600} color="text.secondary">
                                      {badge.title}
                                    </Typography>
                                  </Stack>
                                </Tooltip>
                              )}
                            </Stack>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              ) : (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <LeaderboardIcon sx={{ fontSize: 44, color: "#bdbdbd", mb: 1 }} />
                  <Typography fontSize={20} fontWeight={700} color="text.secondary">
                    No participants found
                  </Typography>
                  <Typography fontSize={15} color="text.secondary">
                    Try adjusting the filters or search.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
        <Box textAlign="center" mt={4} mb={2}>
          <Typography fontWeight={600} fontSize={16} color="primary">
            Think you can top the leaderboard? <Button href="/challenges" variant="contained" sx={{ ml: 1, fontWeight: 700 }}>Join a Challenge Now</Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}