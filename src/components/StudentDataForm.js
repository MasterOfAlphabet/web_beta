import React, { useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Button,
  Typography,
  MenuItem,
  Stack,
} from "@mui/material";

const classOptions = [
  { value: "I-II", label: "Class I-II" },
  { value: "III-V", label: "Class III-V" },
  { value: "VI-X", label: "Class VI-X" },
];

export default function StudentDataForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: "",
    classLevel: "",
    parentMobile: "",
    city: "",
    school: "",
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState({});

  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.classLevel) err.classLevel = "Class is required";
    if (!form.parentMobile || !/^\d{10}$/.test(form.parentMobile))
      err.parentMobile = "Valid 10-digit mobile # required";
    if (!form.city) err.city = "City is required";
    if (!form.school) err.school = "School is required";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={2} mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Student Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error.name && touched.name}
            helperText={touched.name && error.name}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Class"
            select
            name="classLevel"
            value={form.classLevel}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error.classLevel && touched.classLevel}
            helperText={touched.classLevel && error.classLevel}
            fullWidth
            required
          >
            {classOptions.map((op) => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Parent's Mobile #"
            name="parentMobile"
            value={form.parentMobile}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error.parentMobile && touched.parentMobile}
            helperText={touched.parentMobile && error.parentMobile}
            fullWidth
            required
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error.city && touched.city}
            helperText={touched.city && error.city}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="School"
            name="school"
            value={form.school}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error.school && touched.school}
            helperText={touched.school && error.school}
            fullWidth
            required
          />
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="center" mt={3}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          sx={{ borderRadius: 2, px: 5, fontWeight: "bold" }}
        >
          {submitting ? "Submitting..." : "Start Test"}
        </Button>
      </Stack>
    </Box>
  );
}