import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Card,
  CardContent,
  Fade,
  Tooltip,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  LocationOn as LocationOnIcon,
  Map as MapIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { statesAndDistricts } from "../utils/stateDistrictData";
import { runTransaction} from "firebase/firestore";
import { firestore, auth } from "../services/firebase";


function passwordStrength(pwd) {
  let score = 0;
  if (!pwd) return 0;
  if (pwd.length >= 8) score += 30;
  if (/[A-Z]/.test(pwd)) score += 20;
  if (/[a-z]/.test(pwd)) score += 20;
  if (/\d/.test(pwd)) score += 15;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
  return Math.min(score, 100);
}

const strengthLabels = [
  { min: 0, label: "Too Short", color: "error" },
  { min: 25, label: "Weak", color: "warning" },
  { min: 50, label: "Okay", color: "info" },
  { min: 75, label: "Strong", color: "success" },
];

function getStrengthLabel(score) {
  return (
    strengthLabels
      .slice()
      .reverse()
      .find((s) => score >= s.min) || strengthLabels[0]
  );
}

// Now the value is the Roman literal, but we still have classNumber (integer) and classGroup for easy lookup.
const classOptions = [
  { label: "Class I", value: "I", classNumber: 1, classGroup: "I-II" },
  { label: "Class II", value: "II", classNumber: 2, classGroup: "I-II" },
  { label: "Class III", value: "III", classNumber: 3, classGroup: "III-V" },
  { label: "Class IV", value: "IV", classNumber: 4, classGroup: "III-V" },
  { label: "Class V", value: "V", classNumber: 5, classGroup: "III-V" },
  { label: "Class VI", value: "VI", classNumber: 6, classGroup: "VI-X" },
  { label: "Class VII", value: "VII", classNumber: 7, classGroup: "VI-X" },
  { label: "Class VIII", value: "VIII", classNumber: 8, classGroup: "VI-X" },
  { label: "Class IX", value: "IX", classNumber: 9, classGroup: "VI-X" },
  { label: "Class X", value: "X", classNumber: 10, classGroup: "VI-X" },
];

const genderOptions = [
  { value: "Male", label: "Boy" },
  { value: "Female", label: "Girl" },
];

const indianStates = Object.keys(statesAndDistricts).map((state) => ({
  value: state,
  label: state,
}));

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    classLevel: "",
    gender: "",
    state: "",
    district: "",
    city: "",
    school: "",
    parentMobile: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [districts, setDistricts] = useState([]);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (form.state) {
      setDistricts(statesAndDistricts[form.state] || []);
      setForm((prev) => ({ ...prev, district: "" }));
    } else {
      setDistricts([]);
      setForm((prev) => ({ ...prev, district: "" }));
    }
    // eslint-disable-next-line
  }, [form.state]);

  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.classLevel) err.classLevel = "Class is required";
    if (!form.gender) err.gender = "Gender is required";
    if (!form.state) err.state = "State is required";
    if (!form.district) err.district = "District is required";
    if (!form.city) err.city = "City is required";
    if (!form.school) err.school = "School is required";
    if (!form.parentMobile || !/^\d{10}$/.test(form.parentMobile))
      err.parentMobile = "Valid 10-digit mobile # required";
    if (!form.password || form.password.length < 8)
      err.password = "Password must be at least 8 characters";
    if (form.password && passwordStrength(form.password) < 50)
      err.password = "Password is too weak";
    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Enter a valid email";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    validate();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setSubmitting(true);
  setError({});

  try {
    const signupEmail =
      form.email?.trim() || `${form.parentMobile}@rankgenie.in`;

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupEmail,
      form.password
    );
    const user = userCredential.user;

    const selectedOption = classOptions.find(
      (opt) => opt.value === form.classLevel
    );
    const classNumber = selectedOption?.classNumber;
    const classGroup = selectedOption?.classGroup;

    await runTransaction(firestore, async (transaction) => {
      const studentRef = doc(firestore, "students", user.uid);
      const subscriptionRef = doc(firestore, "students", user.uid, "subscription", "current");

      // Student data
      const studentDoc = {
        id: user.uid,
        name: form.name,
        parentMobile: "+91" + form.parentMobile,
        email: form.email?.trim() || null,
        class: form.classLevel,
        classNumber,
        classGroup,
        gender: form.gender,
        city: form.city,
        district: form.district,
        state: form.state,
        school: form.school,
        subscriptionStatus: "trial", // for quick access on read
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Subscription data
      const subscriptionDoc = {
        subscriptionType: "trial",
        subscriptionStatus: "active",
        startDate: serverTimestamp(),
        endDate: null,
        promotionalOfferUsed: false,
        promoCodeUsed: null,
        signupSource: "direct",
        paymentVerified: false,
        transactionId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      transaction.set(studentRef, studentDoc);
      transaction.set(subscriptionRef, subscriptionDoc);
    });

    setSubmitting(false);
    setSubmitted(true);
  } catch (err) {
    setSubmitting(false);
    setError({ submit: err.message });
    console.error("Signup transaction failed:", err);
  }
};


  const handleCancel = () => {
    window.location.href = "/";
  };

  const pwdScore = passwordStrength(form.password);
  const pwdStrength = getStrengthLabel(pwdScore);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
      }}
    >
      <Fade in>
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            maxWidth: 680,
            width: "100%",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #667eea, #764ba2, #667eea)",
            },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              ✨ Student Signup
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Join our learning community today
            </Typography>
          </Box>

          {submitted ? (
            <Card
              sx={{
                background: "linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)",
                border: "2px solid #4caf50",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Stack alignItems="center" spacing={3} py={2}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 80 }} />
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="success.main"
                  >
                    🎉 Welcome Aboard!
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    Congratulations, <strong>{form.name}</strong>! Your account
                    has been created successfully.
                  </Typography>
                  <Typography color="text.secondary" textAlign="center">
                    You can now log in using your parent's mobile number and
                    password to start your learning journey.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    href="/signin"
                    sx={{
                      borderRadius: 3,
                      px: 5,
                      py: 1.5,
                      background:
                        "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Start Learning →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <form autoComplete="off" onSubmit={handleSubmit}>
              {/* Section 1: Student Info */}
              <Card
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #e8f4fd 0%, #f3e5f5 100%)",
                  border: "1px solid rgba(102, 126, 234, 0.15)",
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.12)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #667eea, #764ba2)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                      }}
                    >
                      👤
                    </Box>
                    Student Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.name && error.name)}
                        helperText={touched.name && error.name}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                }}
                              >
                                <PersonIcon
                                  sx={{ fontSize: 14, color: "white" }}
                                />
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#5e35b1",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        name="classLevel"
                        label="Class"
                        value={form.classLevel}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.classLevel && error.classLevel)}
                        helperText={touched.classLevel && error.classLevel}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                }}
                              >
                                <SchoolIcon
                                  sx={{ fontSize: 14, color: "white" }}
                                />
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#5e35b1",
                          },
                        }}
                      >
                        {classOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                              },
                            }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        name="gender"
                        label="Gender"
                        value={form.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.gender && error.gender)}
                        helperText={touched.gender && error.gender}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                  fontSize: "12px",
                                }}
                              >
                                {form.gender === "Male"
                                  ? "👦"
                                  : form.gender === "Female"
                                  ? "👧"
                                  : "🧒"}
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#5e35b1",
                          },
                        }}
                      >
                        {genderOptions.map((g) => (
                          <MenuItem
                            key={g.value}
                            value={g.value}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                              },
                            }}
                          >
                            <span>{g.value === "Male" ? "👦" : "👧"}</span>
                            {g.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        name="state"
                        label="State"
                        value={form.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.state && error.state)}
                        helperText={touched.state && error.state}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                }}
                              >
                                <MapIcon
                                  sx={{ fontSize: 14, color: "white" }}
                                />
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#5e35b1",
                          },
                        }}
                      >
                        {indianStates.map((state) => (
                          <MenuItem
                            key={state.value}
                            value={state.value}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                              },
                            }}
                          >
                            🏛️ {state.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        name="district"
                        label="District"
                        value={form.district}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.district && error.district)}
                        helperText={touched.district && error.district}
                        required
                        disabled={!form.state}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background: form.state
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                    : "linear-gradient(135deg, #ccc 0%, #999 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                  fontSize: "12px",
                                }}
                              >
                                🏘️
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: form.state
                              ? "rgba(255, 255, 255, 0.9)"
                              : "rgba(245, 245, 245, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: form.state
                                ? "rgba(255, 255, 255, 0.95)"
                                : "rgba(245, 245, 245, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: form.state
                                ? "translateY(-1px)"
                                : "none",
                              boxShadow: form.state
                                ? "0 4px 15px rgba(102, 126, 234, 0.1)"
                                : "none",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: form.state ? "#5e35b1" : "#999",
                          },
                        }}
                      >
                        {districts.map((d) => (
                          <MenuItem
                            key={d}
                            value={d}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                              },
                            }}
                          >
                            🏘️ {d}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="city"
                        label="City"
                        value={form.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.city && error.city)}
                        helperText={touched.city && error.city}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                }}
                              >
                                <LocationOnIcon
                                  sx={{ fontSize: 14, color: "white" }}
                                />
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#5e35b1",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="school"
                        label="School Name"
                        value={form.school}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.school && error.school)}
                        helperText={touched.school && error.school}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mr: 0.5,
                                }}
                              >
                                <SchoolIcon
                                  sx={{ fontSize: 14, color: "white" }}
                                />
                              </Box>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(102, 126, 234, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.95)",
                              borderColor: "rgba(102, 126, 234, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: "#667eea",
                              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 600,
                            color: "#5e35b1",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Section 2: Account Info */}
              <Card
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  border: "2px solid #6c757d",
                  borderRadius: 4,
                  boxShadow: "0 8px 32px rgba(108, 117, 125, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background:
                      "linear-gradient(90deg, #6c757d, #495057, #6c757d)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        boxShadow: "0 4px 16px rgba(108, 117, 125, 0.3)",
                      }}
                    >
                      <Typography sx={{ fontSize: "1.5rem" }}>🔐</Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: "#495057",
                          mb: 0.5,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        Account Security
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6c757d",
                          fontWeight: 500,
                        }}
                      >
                        Set up your login credentials securely
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          fullWidth
                          name="parentMobile"
                          label="Parent's Mobile Number"
                          value={form.parentMobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!(touched.parentMobile && error.parentMobile)}
                          helperText={
                            touched.parentMobile && error.parentMobile
                          }
                          required
                          inputProps={{ maxLength: 10 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mr: 1,
                                  }}
                                >
                                  <PhoneIcon
                                    sx={{ color: "white", fontSize: 18 }}
                                  />
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "2px solid transparent",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 1)",
                                borderColor: "#28a745",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 20px rgba(40, 167, 69, 0.2)",
                              },
                              "&.Mui-focused": {
                                borderColor: "#28a745",
                                boxShadow: "0 0 0 3px rgba(40, 167, 69, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontWeight: 600,
                              color: "#495057",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: 12,
                            background: "#28a745",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            transform: form.parentMobile
                              ? "scale(1)"
                              : "scale(0)",
                            transition: "transform 0.2s ease",
                          }}
                        >
                          PRIMARY LOGIN
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email Address (Optional)"
                          placeholder="your.email@example.com"
                          value={form.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!(touched.email && error.email)}
                          helperText={
                            (touched.email && error.email) ||
                            "Optional: For account recovery and notifications"
                          }
                          type="email"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mr: 1,
                                  }}
                                >
                                  <Typography
                                    sx={{ color: "white", fontSize: 16 }}
                                  >
                                    📧
                                  </Typography>
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "2px solid transparent",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 1)",
                                borderColor: "#17a2b8",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 20px rgba(23, 162, 184, 0.2)",
                              },
                              "&.Mui-focused": {
                                borderColor: "#17a2b8",
                                boxShadow: "0 0 0 3px rgba(23, 162, 184, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontWeight: 600,
                              color: "#495057",
                            },
                            "& .MuiFormHelperText-root": {
                              fontWeight: 500,
                              fontSize: "0.8rem",
                            },
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          fullWidth
                          name="password"
                          type={showPwd ? "text" : "password"}
                          label="Create Password"
                          value={form.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!(touched.password && error.password)}
                          helperText={touched.password && error.password}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mr: 1,
                                  }}
                                >
                                  <LockIcon
                                    sx={{ color: "white", fontSize: 18 }}
                                  />
                                </Box>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPwd(!showPwd)}
                                  edge="end"
                                  sx={{
                                    background: "rgba(220, 53, 69, 0.1)",
                                    "&:hover": {
                                      background: "rgba(220, 53, 69, 0.2)",
                                    },
                                  }}
                                >
                                  {showPwd ? (
                                    <VisibilityOff color="error" />
                                  ) : (
                                    <Visibility color="error" />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "2px solid transparent",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 1)",
                                borderColor: "#dc3545",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 20px rgba(220, 53, 69, 0.2)",
                              },
                              "&.Mui-focused": {
                                borderColor: "#dc3545",
                                boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontWeight: 600,
                              color: "#495057",
                            },
                          }}
                        />
                        {form.password && (
                          <Box sx={{ mt: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="#495057"
                                sx={{ mr: 2 }}
                              >
                                Password Strength:
                              </Typography>
                              <Box
                                sx={{
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 2,
                                  background: `linear-gradient(135deg, ${
                                    pwdStrength.color === "error"
                                      ? "#dc3545"
                                      : pwdStrength.color === "warning"
                                      ? "#fd7e14"
                                      : pwdStrength.color === "info"
                                      ? "#17a2b8"
                                      : "#28a745"
                                  } 0%, ${
                                    pwdStrength.color === "error"
                                      ? "#c82333"
                                      : pwdStrength.color === "warning"
                                      ? "#e8590c"
                                      : pwdStrength.color === "info"
                                      ? "#138496"
                                      : "#1e7e34"
                                  } 100%)`,
                                  color: "white",
                                  fontSize: "0.8rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {pwdStrength.label}
                              </Box>
                            </Box>
                            <Box sx={{ position: "relative", width: "100%" }}>
                              <LinearProgress
                                variant="determinate"
                                value={pwdScore}
                                sx={{
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 6,
                                    background: `linear-gradient(90deg, ${
                                      pwdStrength.color === "error"
                                        ? "#dc3545"
                                        : pwdStrength.color === "warning"
                                        ? "#fd7e14"
                                        : pwdStrength.color === "info"
                                        ? "#17a2b8"
                                        : "#28a745"
                                    }, ${
                                      pwdStrength.color === "error"
                                        ? "#c82333"
                                        : pwdStrength.color === "warning"
                                        ? "#e8590c"
                                        : pwdStrength.color === "info"
                                        ? "#138496"
                                        : "#1e7e34"
                                    })`,
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  position: "absolute",
                                  right: 8,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  fontSize: "0.7rem",
                                  fontWeight: "bold",
                                  color: "white",
                                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                }}
                              >
                                {pwdScore}%
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ position: "relative" }}>
                        <TextField
                          fullWidth
                          name="confirmPassword"
                          type={showCPwd ? "text" : "password"}
                          label="Confirm Password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            !!(touched.confirmPassword && error.confirmPassword)
                          }
                          helperText={
                            touched.confirmPassword && error.confirmPassword
                          }
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background:
                                      form.password &&
                                      form.confirmPassword &&
                                      form.password === form.confirmPassword
                                        ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                                        : "linear-gradient(135deg, #6c757d 0%, #495057 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mr: 1,
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  {form.password &&
                                  form.confirmPassword &&
                                  form.password === form.confirmPassword ? (
                                    <CheckCircleIcon
                                      sx={{ color: "white", fontSize: 18 }}
                                    />
                                  ) : (
                                    <LockIcon
                                      sx={{ color: "white", fontSize: 18 }}
                                    />
                                  )}
                                </Box>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowCPwd(!showCPwd)}
                                  edge="end"
                                  sx={{
                                    background:
                                      form.password &&
                                      form.confirmPassword &&
                                      form.password === form.confirmPassword
                                        ? "rgba(40, 167, 69, 0.1)"
                                        : "rgba(108, 117, 125, 0.1)",
                                    "&:hover": {
                                      background:
                                        form.password &&
                                        form.confirmPassword &&
                                        form.password === form.confirmPassword
                                          ? "rgba(40, 167, 69, 0.2)"
                                          : "rgba(108, 117, 125, 0.2)",
                                    },
                                  }}
                                >
                                  {showCPwd ? (
                                    <VisibilityOff
                                      color={
                                        form.password &&
                                        form.confirmPassword &&
                                        form.password === form.confirmPassword
                                          ? "success"
                                          : "disabled"
                                      }
                                    />
                                  ) : (
                                    <Visibility
                                      color={
                                        form.password &&
                                        form.confirmPassword &&
                                        form.password === form.confirmPassword
                                          ? "success"
                                          : "disabled"
                                      }
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              background: "rgba(255, 255, 255, 0.9)",
                              border: "2px solid transparent",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 1)",
                                borderColor:
                                  form.password &&
                                  form.confirmPassword &&
                                  form.password === form.confirmPassword
                                    ? "#28a745"
                                    : "#6c757d",
                                transform: "translateY(-1px)",
                                boxShadow:
                                  form.password &&
                                  form.confirmPassword &&
                                  form.password === form.confirmPassword
                                    ? "0 4px 20px rgba(40, 167, 69, 0.2)"
                                    : "0 4px 20px rgba(108, 117, 125, 0.2)",
                              },
                              "&.Mui-focused": {
                                borderColor:
                                  form.password &&
                                  form.confirmPassword &&
                                  form.password === form.confirmPassword
                                    ? "#28a745"
                                    : "#6c757d",
                                boxShadow:
                                  form.password &&
                                  form.confirmPassword &&
                                  form.password === form.confirmPassword
                                    ? "0 0 0 3px rgba(40, 167, 69, 0.1)"
                                    : "0 0 0 3px rgba(108, 117, 125, 0.1)",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              fontWeight: 600,
                              color: "#495057",
                            },
                          }}
                        />
                        {form.password && form.confirmPassword && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: 12,
                              background:
                                form.password === form.confirmPassword
                                  ? "#28a745"
                                  : "#dc3545",
                              color: "white",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              transform: "scale(1)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {form.password === form.confirmPassword ? (
                              <>
                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                MATCH
                              </>
                            ) : (
                              <>
                                <CancelIcon sx={{ fontSize: 14 }} />
                                NO MATCH
                              </>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Security Tips */}
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #e8f4f8 0%, #f0f8ff 100%)",
                      border: "1px solid #17a2b8",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography sx={{ fontSize: "1.2rem" }}>💡</Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#138496"
                          sx={{ mb: 1 }}
                        >
                          Security Tips
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#28a745", fontSize: 16 }}
                            />
                            <Typography variant="body2" color="#495057">
                              8+ characters
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#28a745", fontSize: 16 }}
                            />
                            <Typography variant="body2" color="#495057">
                              Mix of letters & numbers
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#28a745", fontSize: 16 }}
                            />
                            <Typography variant="body2" color="#495057">
                              Special characters
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: "#28a745", fontSize: 16 }}
                            />
                            <Typography variant="body2" color="#495057">
                              No personal info
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              {error.submit && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)",
                    border: "1px solid #f44336",
                  }}
                >
                  <Typography color="error.main" fontWeight="bold">
                    ❌ {error.submit}
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.5)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {submitting ? "Creating Account..." : "🚀 Create Account"}
                </Button>

                <Tooltip title="Cancel and return to homepage">
                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: "bold",
                      borderColor: "#ccc",
                      color: "#666",
                      "&:hover": {
                        borderColor: "#999",
                        backgroundColor: "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </Stack>
            </form>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}
