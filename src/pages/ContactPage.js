import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Box,
  Link,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Fade,
  useTheme,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const SOCIALS = [
  {
    href: 'https://x.com/MasterOfAlphabet',
    label: 'X',
    icon: <XIcon sx={{ fontSize: 28, color: '#222' }} />,
    color: '#222',
  },
  {
    href: 'https://facebook.com/MasterOfAlphabet',
    label: 'Facebook',
    icon: <FacebookIcon sx={{ fontSize: 28, color: '#1976d2' }} />,
    color: '#1976d2',
  },
  {
    href: 'https://instagram.com/MasterOfAlphabet',
    label: 'Instagram',
    icon: <InstagramIcon sx={{ fontSize: 28, color: '#d6249f' }} />,
    color: '#d6249f',
  },
  {
    href: 'https://linkedin.com/company/MasterOfAlphabet',
    label: 'LinkedIn',
    icon: <LinkedInIcon sx={{ fontSize: 28, color: '#0a66c2' }} />,
    color: '#0a66c2',
  },
  {
    href: 'https://youtube.com/@MasterOfAlphabet',
    label: 'YouTube',
    icon: <YouTubeIcon sx={{ fontSize: 30, color: '#f00' }} />,
    color: '#f00',
  },
  {
    href: 'https://wa.me/18005551234',
    label: 'WhatsApp',
    icon: <WhatsAppIcon sx={{ fontSize: 28, color: '#25d366' }} />,
    color: '#25d366',
  },
];

export default function ContactPage() {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const subjectOptions = [
    { value: 'support', label: 'Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'inquiry', label: 'General Inquiry' },
    { value: 'partnership', label: 'Partnership' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    if (success) setSuccess(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1300);
  };

  // For a more lively card background
  const gradientCard =
    "linear-gradient(120deg, #e1eaff 0%, #f6faff 100%)";

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pb: 8, background: '#f6f8fc' }}>
      {/* Animated background wave */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 0,
          height: { xs: 150, sm: 180 },
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1600 200"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={theme.palette.primary.light} />
              <stop offset="100%" stopColor="#e3f2fd" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 Q400,220 800,120 T1600,120 V220 H0Z"
            fill="url(#wave-gradient)"
            opacity="0.7"
          />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 7, textAlign: "center", position: 'relative' }}>
          <Typography
            variant={isSm ? "h3" : "h2"}
            sx={{
              fontWeight: 900,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, #1976d2 90%)`,
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              letterSpacing: -1.2,
            }}
          >
            Get in Touch
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 2,
              maxWidth: 660,
              mx: "auto",
              fontWeight: 400,
              fontSize: { xs: 17, sm: 20 }
            }}
          >
            Have a question, feedback, or partnership idea? We're always excited to connect with you. Reach out and let’s start a conversation!
          </Typography>
          {/* Social Media Links */}
          <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {SOCIALS.map(social => (
              <Tooltip key={social.label} title={social.label}>
                <IconButton
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: '#fff',
                    border: `2px solid ${social.color}`,
                    transition: 'background 0.2s, transform 0.18s',
                    mx: 0.5,
                    '&:hover': {
                      bgcolor: social.color,
                      color: '#fff',
                      transform: 'translateY(-4px) scale(1.08)',
                      '& svg': { color: '#fff' }
                    }
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>
        <Grid container spacing={5}>
          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={1250}>
              <Card
                sx={{
                  height: "100%",
                  p: 0,
                  boxShadow: 8,
                  borderRadius: 5,
                  background: gradientCard,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <CardContent sx={{ px: { xs: 3, md: 5 }, py: { xs: 4, md: 6 } }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "primary.main", letterSpacing: -1 }}>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 3, borderColor: theme.palette.primary.light }} />
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                    <LocationOn color="primary" sx={{ mr: 2, mt: 0.5, fontSize: 30 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
                      <b>Master of Alphabet HQ</b><br />
                      123 Alphabet Avenue<br />
                      Education City, EC 12345
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Phone color="primary" sx={{ mr: 2, fontSize: 26 }} />
                    <Link
                      href="tel:+18005551234"
                      color="primary"
                      underline="hover"
                      variant="body1"
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 1,
                        transition: "color 0.2s",
                        "&:hover": { color: "secondary.main" }
                      }}
                    >
                      +1 (800) 555-1234
                    </Link>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Email color="primary" sx={{ mr: 2, fontSize: 26 }} />
                    <Link
                      href="mailto:support@masterofalphabet.com"
                      color="primary"
                      underline="hover"
                      variant="body1"
                      sx={{
                        fontSize: 18,
                        fontWeight: 700,
                        wordBreak: "break-all",
                        transition: "color 0.2s",
                        "&:hover": { color: "secondary.main" }
                      }}
                    >
                      support@masterofalphabet.com
                    </Link>
                  </Box>
                  <Divider sx={{ my: 4 }} />
                  {/* Google Map Embed */}
                  <Box
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 2,
                      mb: 2,
                      border: '2px solid #e3eafc'
                    }}
                  >
                    <iframe
                      title="Master of Alphabet HQ Location"
                      width="100%"
                      height="180"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps?q=123+Alphabet+Avenue+Education+City+EC+12345&output=embed"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15, mt: 2 }}>
                    <i>We usually respond within 1-2 business days.</i>
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
          {/* Feedback Form */}
          <Grid item xs={12} md={7}>
            <Fade in timeout={900}>
              <Card
                sx={{
                  boxShadow: 12,
                  borderRadius: 5,
                  px: { xs: 1, md: 2 },
                  background: "#fff"
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: "primary.main", mb: 1, letterSpacing: -1 }}>
                    Send Us a Message
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Fill out the form below and we’ll get back to you soon.
                  </Typography>
                  <Fade in={success} timeout={400}>
                    <div>
                      {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                          Your message has been sent successfully!
                        </Alert>
                      )}
                    </div>
                  </Fade>
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          variant="outlined"
                          autoComplete="off"
                          InputProps={{
                            sx: { fontWeight: 500 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          variant="outlined"
                          autoComplete="off"
                          InputProps={{
                            sx: { fontWeight: 500 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.subject}>
                          <InputLabel id="subject-label">Subject</InputLabel>
                          <Select
                            labelId="subject-label"
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            variant="outlined"
                          >
                            {subjectOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.subject && (
                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                              {errors.subject}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Message"
                          name="message"
                          multiline
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          variant="outlined"
                          autoComplete="off"
                          InputProps={{
                            sx: { fontWeight: 500, fontSize: 16 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={submitting}
                          startIcon={submitting ? <CircularProgress size={20} /> : null}
                          sx={{
                            px: 8,
                            py: 2,
                            fontWeight: 800,
                            fontSize: 18,
                            letterSpacing: 1,
                            borderRadius: 3,
                            boxShadow: "0 4px 20px 0 rgba(80,130,250,.13)",
                            transition: "background 0.2s"
                          }}
                        >
                          {submitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}