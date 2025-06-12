// StudentRegistrationModal.js
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

export default function StudentRegistrationModal({ onRegistered, onClose }) {
  const [form, setForm] = useState({
    name: "",
    city: "",
    classGroup: "",
    phone: "",
    school: ""
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateStudentId = () => {
    const tempDocRef = doc(firestore, "temp", "placeholder");
    return tempDocRef.id;
  };

  const handleRegister = async () => {
    const studentId = generateStudentId();
    const student = { ...form, studentId, registeredAt: new Date().toISOString() };

    // Save student info
    await setDoc(doc(firestore, "students", studentId), student);

    // Pass student back
    onRegistered(student);
    onClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField label="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} fullWidth />
      <TextField label="City" value={form.city} onChange={(e) => handleChange("city", e.target.value)} fullWidth />
      <TextField label="Class Group" value={form.classGroup} onChange={(e) => handleChange("classGroup", e.target.value)} fullWidth />
      <TextField label="Phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} fullWidth />
      <TextField label="School" value={form.school} onChange={(e) => handleChange("school", e.target.value)} fullWidth />
      <Button variant="contained" onClick={handleRegister}>Start Challenge</Button>
    </Box>
  );
}
