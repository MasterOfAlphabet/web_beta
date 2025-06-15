import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Divider,
  IconButton,
  LinearProgress,
  Fade,
  Tooltip,
  TextField,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import { firestore, auth } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

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

const classOptions = [
  { value: "I", label: "Class I" },
  { value: "II", label: "Class II" },
  { value: "III", label: "Class III" },
  { value: "IV", label: "Class IV" },
  { value: "V", label: "Class V" },
  { value: "VI", label: "Class VI" },
  { value: "VII", label: "Class VII" },
  { value: "VIII", label: "Class VIII" },
  { value: "IX", label: "Class IX" },
  { value: "X", label: "Class X" },
];

const indianStates = [
  { value: "andhra-pradesh", label: "Andhra Pradesh" },
  { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal-pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil-nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar-pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "andaman-nicobar", label: "Andaman and Nicobar Islands" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "dadra-nagar-haveli", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "delhi", label: "Delhi" },
  { value: "jammu-kashmir", label: "Jammu and Kashmir" },
  { value: "ladakh", label: "Ladakh" },
  { value: "lakshadweep", label: "Lakshadweep" },
  { value: "puducherry", label: "Puducherry" },
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    classLevel: "",
    city: "",
    state: "",
    school: "",
    parentMobile: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.classLevel) err.classLevel = "Class is required";
    if (!form.city) err.city = "City is required";
    if (!form.state) err.state = "State is required";
    if (!form.school) err.school = "School is required";
    if (!form.parentMobile || !/^\d{10}$/.test(form.parentMobile))
      err.parentMobile = "Valid 10-digit mobile # required";
    if (!form.password || form.password.length < 8)
      err.password = "Password must be at least 8 characters";
    if (form.password && passwordStrength(form.password) < 50)
      err.password = "Password is too weak";
    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";
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
      const syntheticEmail = `${form.parentMobile}@rankgenie.in`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        syntheticEmail,
        form.password
      );
      const user = userCredential.user;
      await setDoc(doc(firestore, "students", user.uid), {
        uid: user.uid,
        name: form.name,
        classLevel: form.classLevel,
        parentMobile: form.parentMobile,
        city: form.city,
        state: form.state,
        school: form.school,
        email: syntheticEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
      });
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setError({ submit: err.message });
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
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    🎉 Welcome Aboard!
                  </Typography>
                  <Typography variant="h6" textAlign="center">
                    Congratulations, <strong>{form.name}</strong>! Your account has been created successfully.
                  </Typography>
                  <Typography color="text.secondary" textAlign="center">
                    You can now log in using your parent's mobile number and password to start your learning journey.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    href="/login"
                    sx={{ 
                      borderRadius: 3, 
                      px: 5, 
                      py: 1.5,
                      background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
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
                  background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h5" 
                    sx={{
                      fontWeight: 700,
                      color: "#5e35b1",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    👤 Student Information
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
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
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
                              <SchoolIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      >
                        {classOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
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
                              <LocationOnIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      />
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
                              <MapIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      >
                        {indianStates.map((state) => (
                          <MenuItem key={state.value} value={state.value}>
                            {state.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                              <SchoolIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
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
                  background: "linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)",
                  border: "1px solid rgba(255, 152, 0, 0.2)",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h5" 
                    sx={{
                      fontWeight: 700,
                      color: "#e65100",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    🔐 Account Security
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="parentMobile"
                        label="Parent's Mobile Number"
                        value={form.parentMobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.parentMobile && error.parentMobile)}
                        helperText={touched.parentMobile && error.parentMobile}
                        required
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="password"
                        type={showPwd ? "text" : "password"}
                        label="Password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.password && error.password)}
                        helperText={touched.password && error.password}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPwd(!showPwd)}
                                edge="end"
                              >
                                {showPwd ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      />
                      {form.password && (
                        <Box sx={{ mt: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={pwdScore}
                                color={pwdStrength.color}
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: "rgba(0,0,0,0.1)",
                                }}
                              />
                            </Box>
                            <Typography fontSize={12} color={`${pwdStrength.color}.main`} fontWeight="bold" minWidth={60}>
                              {pwdStrength.label}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="confirmPassword"
                        type={showCPwd ? "text" : "password"}
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!(touched.confirmPassword && error.confirmPassword)}
                        helperText={touched.confirmPassword && error.confirmPassword}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowCPwd(!showCPwd)}
                                edge="end"
                              >
                                {showCPwd ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {error.submit && (
                <Box
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)",
                    border: "1px solid #f44336",
                  }}
                >
                  <Typography color="error.main" fontWeight="bold">
                    ❌ {error.submit}
                  </Typography>
                </Box>
              )}

              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                mt={4}
              >
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
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
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