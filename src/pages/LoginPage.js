import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link, Snackbar, Alert } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSnackbar({ open: true, message: "Login successful!", severity: "success" });
      navigate("/");
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ background: "#f3f6fa" }}>
      <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
        Master of Alphabet
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        National Level English Language Skills Competition
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, minWidth: 320, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>Welcome Back!</Typography>
        <Typography variant="body2" textAlign="center" mb={2}>Sign in to continue to your challenges</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Link href="#" variant="body2" onClick={() => alert("Forgot password flow here")}>
            Forgot password?
          </Link>
          <Link href="/register" variant="body2">
            Register
          </Link>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}