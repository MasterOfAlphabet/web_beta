import React, { useState, useContext } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PhoneAndroid,
  Lock,
  AccountCircle,
} from "@mui/icons-material";
import { AuthContext } from "../App";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "हिन्दी", value: "hi" },
  { label: "తెలుగు", value: "te" },
];

export default function LoginPage() {
  const [parentMobile, setParentMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [language, setLanguage] = useState("en");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Use AuthContext to manage global user state
  const { setLoggedInUser } = useContext(AuthContext) || {};
 // Inside the component
const location = useLocation();
const navigate = useNavigate();
const queryParams = new URLSearchParams(location.search);
const redirectTo = queryParams.get("redirect") || "/dashboard"; // ✅ fallback path

  const handleLogin = async (e) => {
    e.preventDefault();
    setMobileError("");
    setPasswordError("");

    let valid = true;
    if (!parentMobile.trim() || !/^\d{10}$/.test(parentMobile.trim())) {
      setMobileError("Valid 10-digit mobile # required");
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      const syntheticEmail = `${parentMobile.trim()}@rankgenie.in`;
      const userCredential = await signInWithEmailAndPassword(
        auth,
        syntheticEmail,
        password
      );
      const { uid } = userCredential.user;

      // --- Fetch student profile ---
      const studentRef = doc(firestore, "students", uid);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        setSnackbar({
          open: true,
          message: "Student record not found. Please contact support.",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      const studentData = studentSnap.data();

      // --- Fetch subscription ---
      const subRef = doc(firestore, "students", uid, "subscription", "current");
      const subSnap = await getDoc(subRef);

      let subscriptionType = "trial";
      let subscriptionStatus = "active";
      let subscriptionStartDate = null;
      let subscriptionEndDate = null;
      let daysRemaining = null;

      if (subSnap.exists()) {
        const sub = subSnap.data();
        subscriptionType = sub.subscriptionType || "trial";
        subscriptionStatus = sub.subscriptionStatus || "active";
        subscriptionStartDate = sub.subscriptionStartDate?.toDate?.() || null;
        subscriptionEndDate = sub.subscriptionEndDate?.toDate?.() || null;

        if (subscriptionEndDate) {
          const now = new Date();
          const timeDiff = subscriptionEndDate.getTime() - now.getTime();
          daysRemaining = Math.max(
            0,
            Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
          );

          if (daysRemaining <= 0) {
            subscriptionStatus = "expired";
          }
        }
      }

      // --- Construct final user session object ---
      const userInfo = {
        uid,
        role: "student",
        email: syntheticEmail,
        name: studentData.name,
        class: studentData.class,
        gender: studentData.gender,
        city: studentData.city,
        district: studentData.district,
        state: studentData.state,
        school: studentData.school,
        subscriptionType,
        subscriptionStatus,
        subscriptionStartDate,
        subscriptionEndDate,
        daysRemaining,
      };

      // Save to context and localStorage for persistence
      setLoggedInUser?.(userInfo);
      localStorage.setItem("studentUser", JSON.stringify(userInfo));

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
     navigate(redirectTo);

    } catch (error) {
      let message = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found")
        message = "No account found with this mobile #";
      if (error.code === "auth/wrong-password") message = "Incorrect password";
      setSnackbar({ open: true, message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- UI Render ---
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f6fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          minWidth: 330,
          maxWidth: 370,
        }}
      >
        <Box textAlign="center" mb={2}>
          <AccountCircle color="primary" sx={{ fontSize: 64 }} />
          <Typography variant="h5" fontWeight={700} mt={1}>
            Master of Alphabet
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            National Level English Language Skills Competition
          </Typography>
        </Box>
        <Typography variant="h6" align="center" mb={1} fontWeight={600}>
          Welcome Back!
        </Typography>
        <Typography
          variant="body2"
          align="center"
          mb={2}
          color="text.secondary"
        >
          Sign in to continue to your challenges
        </Typography>
        <form onSubmit={handleLogin} autoComplete="on">
          <TextField
            label="Parent's Mobile #"
            value={parentMobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setParentMobile(val);
              setMobileError("");
            }}
            error={!!mobileError}
            helperText={mobileError}
            fullWidth
            margin="normal"
            autoComplete="username"
            inputProps={{ maxLength: 10 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroid />
                </InputAdornment>
              ),
            }}
            size="medium"
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            error={!!passwordError}
            helperText={passwordError}
            fullWidth
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size="medium"
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
            mb={1.5}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography fontSize={14}>Remember me</Typography>}
              sx={{ ml: -1 }}
            />
            <Button
              variant="text"
              size="small"
              sx={{ fontSize: "13px" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Button>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            mt={1}
          >
            <Button
              type="button"
              variant="outlined"
              fullWidth
              sx={{
                fontWeight: "bold",
                fontSize: 16,
                py: 1,
                borderRadius: 2,
                mb: 1,
              }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontWeight: "bold",
                fontSize: 17,
                py: 1.2,
                borderRadius: 2,
                mt: 1,
                mb: 1,
              }}
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={18} color="inherit" />
              }
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Stack>
        </form>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          mt={1}
        >
          <Typography fontSize={15}>Don't have an account?</Typography>
          <Button
            variant="text"
            size="small"
            sx={{ ml: 1, fontWeight: "bold", fontSize: 15 }}
            onClick={() => navigate("/signup")}
          >
            Register
          </Button>
        </Stack>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
