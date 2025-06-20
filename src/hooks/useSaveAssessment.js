// src/hooks/useSaveAssessment.js
import { useState } from "react";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../services/firebase";

const generateAssessmentId = (moduleName) => {
  const prefix = moduleName.toLowerCase().replace(/[^a-z]/g, "").slice(0, 6);
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}_${timestamp}_${random}`;
};

const useSaveAssessment = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const saveAssessment = async ({
    studentId,
    moduleName,
    moduleLabel,
    categoriesData
  }) => {
    setSaving(true);
    setError(null);
    setSuccessId(null);

    try {
      const assessmentId = generateAssessmentId(moduleName);
      const now = new Date();

      // Calculate overall stats
      const overall = Object.values(categoriesData).reduce(
        (acc, { score = 0, maximumPossibleScore = 0, totalNumberOfQuestions = 0 }) => {
          acc.score += score;
          acc.maximumPossibleScore += maximumPossibleScore;
          acc.totalNumberOfQuestions += totalNumberOfQuestions;
          return acc;
        },
        { score: 0, maximumPossibleScore: 0, totalNumberOfQuestions: 0 }
      );

      // Save assessment to individual document
      const assessmentDoc = {
        assessmentId,
        studentId,
        moduleName,
        moduleLabel,
        assessmentDate: now.toISOString(),
        overall,
        categories: categoriesData
      };

      const studentPath = `students/${studentId}/assessments/${assessmentId}`;
      await setDoc(doc(firestore, studentPath), assessmentDoc);

      // Update master document with history
      const masterRef = doc(firestore, `students/${studentId}/assessments/master`);
      const moduleKey = moduleName;

      const newRecord = {
        assessmentId,
        assessmentDate: now.toISOString()
      };

      const masterSnap = await getDoc(masterRef);
      if (masterSnap.exists()) {
        const data = masterSnap.data();
        const current = data.assessmentHistory?.[moduleKey] || [];
        const updatedHistory = {
          ...data.assessmentHistory,
          [moduleKey]: [newRecord, ...current]
        };

        await updateDoc(masterRef, {
          assessmentHistory: updatedHistory,
          lastUpdated: serverTimestamp()
        });
      } else {
        await setDoc(masterRef, {
          studentId,
          assessmentHistory: {
            [moduleKey]: [newRecord]
          },
          lastUpdated: serverTimestamp()
        });
      }

      setSuccessId(assessmentId);
      return assessmentId;
    } catch (err) {
      console.error("Assessment save error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return { saveAssessment, saving, error, successId };
};

export default useSaveAssessment;
