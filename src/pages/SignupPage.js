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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
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
  { value: "I", label: "I" },
  { value: "II", label: "II" },
  { value: "III", label: "III" },
  { value: "IV", label: "IV" },
  { value: "V", label: "V" },
  { value: "VI", label: "VI" },
  { value: "VII", label: "VII" },
  { value: "VIII", label: "VIII" },
  { value: "IX", label: "IX" },
  { value: "X", label: "X" },
];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    classLevel: "",
    city: "",
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
        bgcolor: "#f6f8fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 5,
            p: { xs: 2, sm: 5 },
            maxWidth: 580,
            width: "100%",
            boxShadow: "0 10px 36px 0 rgba(80,130,250,.13)",
          }}
        >
          <Typography variant="h4" fontWeight={900} color="primary" align="center" mb={1}>
            Student Signup
          </Typography>
          <Typography fontSize={18} color="text.secondary" textAlign="center" mb={3}>
            Create your new account
          </Typography>
          <Divider sx={{ mb: 4 }} />

          {submitted ? (
            <Stack alignItems="center" spacing={3} py={3}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h5" fontWeight={700} color="primary">
                Signup Successful!
              </Typography>
              <Typography>
                Welcome, <b>{form.name}</b>. You can now log in using parent mobile number and your password.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href="/login"
                sx={{ borderRadius: 2, px: 5, mt: 2 }}
              >
                Go to Login
              </Button>
            </Stack>
          ) : (
            <form autoComplete="off" onSubmit={handleSubmit}>
              {/* Section 1: Student Info */}
              <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
                Student Info
              </Typography>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Full Name"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: error.name && touched.name ? "2px solid #f44336" : "1px solid #d3d3d3",
                      marginBottom: "6px",
                      background: "#f8f9fa",
                    }}
                  />
                  {touched.name && error.name && (
                    <Typography fontSize={12} color="error">
                      {error.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <select
                    name="classLevel"
                    value={form.classLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: error.classLevel && touched.classLevel ? "2px solid #f44336" : "1px solid #d3d3d3",
                      color: form.classLevel ? "#222" : "#888",
                      marginBottom: "6px",
                      background: "#f8f9fa",
                    }}
                  >
                    <option value="">Select Class</option>
                    {classOptions.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  {touched.classLevel && error.classLevel && (
                    <Typography fontSize={12} color="error">
                      {error.classLevel}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="City"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: error.city && touched.city
                        ? "2px solid #f44336"
                        : "1px solid #d3d3d3",
                      marginBottom: "6px",
                      background: "#f8f9fa",
                    }}
                  />
                  {touched.city && error.city && (
                    <Typography fontSize={12} color="error">
                      {error.city}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input
                    name="school"
                    value={form.school}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="School"
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: error.school && touched.school
                        ? "2px solid #f44336"
                        : "1px solid #d3d3d3",
                      marginBottom: "6px",
                      background: "#f8f9fa",
                    }}
                  />
                  {touched.school && error.school && (
                    <Typography fontSize={12} color="error">
                      {error.school}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />

              {/* Section 2: Account Info */}
              <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
                Account Info
              </Typography>
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12}>
                  <input
                    name="parentMobile"
                    value={form.parentMobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Parent's Mobile #"
                    required
                    maxLength={10}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      border: error.parentMobile && touched.parentMobile
                        ? "2px solid #f44336"
                        : "1px solid #d3d3d3",
                      marginBottom: "6px",
                      background: "#f8f9fa",
                    }}
                  />
                  {touched.parentMobile && error.parentMobile && (
                    <Typography fontSize={12} color="error">
                      {error.parentMobile}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box position="relative">
                    <input
                      name="password"
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Password"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 42px 12px 12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: error.password && touched.password
                          ? "2px solid #f44336"
                          : "1px solid #d3d3d3",
                        marginBottom: "6px",
                        background: "#f8f9fa",
                      }}
                    />
                    <IconButton
                      aria-label={showPwd ? "Hide password" : "Show password"}
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 6,
                        top: 8,
                        color: "#888",
                      }}
                    >
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                  {touched.password && error.password && (
                    <Typography fontSize={12} color="error">
                      {error.password}
                    </Typography>
                  )}
                  {form.password && (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={pwdScore}
                          color={pwdStrength.color}
                          sx={{ height: 7, borderRadius: 3 }}
                        />
                      </Box>
                      <Typography fontSize={12} color={`${pwdStrength.color}.main`} minWidth={74}>
                        {pwdStrength.label}
                      </Typography>
                    </Stack>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box position="relative">
                    <input
                      name="confirmPassword"
                      type={showCPwd ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm Password"
                      required
                      style={{
                        width: "100%",
                        padding: "12px 42px 12px 12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: error.confirmPassword && touched.confirmPassword
                          ? "2px solid #f44336"
                          : "1px solid #d3d3d3",
                        marginBottom: "6px",
                        background: "#f8f9fa",
                      }}
                    />
                    <IconButton
                      aria-label={showCPwd ? "Hide" : "Show"}
                      onClick={() => setShowCPwd((s) => !s)}
                      edge="end"
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 6,
                        top: 8,
                        color: "#888",
                      }}
                    >
                      {showCPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                  {touched.confirmPassword && error.confirmPassword && (
                    <Typography fontSize={12} color="error">
                      {error.confirmPassword}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              {error.submit && (
                <Typography fontSize={13} color="error" mb={1}>
                  {error.submit}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                mt={2}
                mb={1}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  disabled={submitting}
                  sx={{ borderRadius: 2, px: 5, fontWeight: "bold" }}
                >
                  {submitting ? "Signing up..." : "Sign Up"}
                </Button>
                <Tooltip title="Cancel Signup and go to Home">
                  <Button
                    type="button"
                    variant="text"
                    size="large"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      fontWeight: "bold",
                      color: "#888",
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