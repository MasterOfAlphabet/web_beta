// ============================================================================
// Integration: Save Assessment Results to Firebase
// ============================================================================
// Add this logic to your handleFinalSubmit in SpellingAssessment.jsx

import { 
  generateUniqueAssessmentId,
  saveNewAssessment,
  addModuleResult,
  isModuleCompleted
} from '../services/assessmentService';

/**
 * Save assessment results to Firebase
 * Call this in handleFinalSubmit BEFORE navigating to results
 */
export const saveAssessmentToFirebase = async ({
  studentData,
  userType,
  assessmentResults,
  rankingData,
  existingAssessmentId = null // If returning user
}) => {
  try {
    // Prepare data for Firebase
    const moduleData = {
      module: assessmentResults.module, // "Spelling", "Reading", etc.
      rawScore: assessmentResults.score,
      totalQuestions: assessmentResults.totalQuestions,
      percentage: assessmentResults.percentage,
      spellingIndex: assessmentResults.spellingIndex, // or readingIndex, etc.
      skillLevel: assessmentResults.skillLevel,
      clusterScores: assessmentResults.clusterScores,
      achievementUnlocked: assessmentResults.achievementUnlocked,
      achievementName: assessmentResults.achievementName,
      duration: assessmentResults.duration,
      startTime: assessmentResults.startTime,
      endTime: assessmentResults.endTime,
      answers: assessmentResults.answers,
    };

    if (existingAssessmentId) {
      // ===== RETURNING USER: Add module result to existing assessment =====
      console.log('Adding module to existing assessment:', existingAssessmentId);
      
      const result = await addModuleResult(existingAssessmentId, moduleData);
      
      if (result.success) {
        return {
          success: true,
          assessmentId: existingAssessmentId,
          isNew: false
        };
      } else {
        throw new Error(result.error);
      }
      
    } else {
      // ===== NEW USER: Create new assessment =====
      console.log('Creating new assessment...');
      
      // Generate unique ID
      const assessmentId = await generateUniqueAssessmentId(
        studentData.fullName,
        studentData.grade,
        studentData.mobile
      );
      
      console.log('Generated Assessment ID:', assessmentId);
      
      // Save to Firestore
      const result = await saveNewAssessment(assessmentId, {
        studentData,
        userType,
        rankingData,
        ...moduleData
      });
      
      if (result.success) {
        return {
          success: true,
          assessmentId: result.assessmentId,
          isNew: true
        };
      } else {
        throw new Error(result.error);
      }
    }
    
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


// ============================================================================
// USAGE EXAMPLE: Update your SpellingAssessment.jsx handleFinalSubmit
// ============================================================================

/*

// In SpellingAssessment.jsx, modify handleFinalSubmit:

const handleFinalSubmit = async () => {
  const endTimestamp = new Date().toISOString();
  setEndTime(endTimestamp);
  
  // Calculate scores...
  const clusterScores = calculateClusterScores(answers, allQuestions);
  const spellingIndex = calculateSpellingIndex(clusterScores);
  const skillLevel = getSkillLevel(spellingIndex);
  const rawScore = allQuestions.reduce(...);
  const percentage = Math.round((rawScore / totalQuestions) * 100);
  
  // Achievement badge
  const targetTime = grade <= 2 ? 75 : grade <= 5 ? 60 : 45;
  const elapsedMinutes = Math.floor((timeLimit * 60 - timer) / 60);
  const achievementUnlocked = elapsedMinutes <= targetTime && percentage >= 60;
  
  // === SAVE TO FIREBASE ===
  const firebaseResult = await saveAssessmentToFirebase({
    studentData,
    userType,
    assessmentResults: {
      module: "Spelling",
      score: rawScore,
      totalQuestions,
      percentage,
      spellingIndex,
      skillLevel,
      clusterScores,
      achievementUnlocked,
      achievementName: "Word Fluency Star",
      duration: Math.floor((new Date(endTimestamp) - new Date(startTime)) / 1000),
      startTime,
      endTime: endTimestamp,
      answers,
    },
    rankingData: null, // Will be added later on ranking page
    existingAssessmentId: studentData.assessmentId || null // If returning user
  });
  
  if (!firebaseResult.success) {
    console.error('Failed to save to Firebase:', firebaseResult.error);
    // Optionally show error to user, but still continue to results
  }
  
  // Navigate to results (add assessmentId to state)
  navigate("/results/ranking-fields", {
    state: {
      assessmentResults: {
        ...assessmentResults,
        assessmentId: firebaseResult.assessmentId // NEW: Include Assessment ID
      },
      studentData,
      userType
    }
  });
};

*/
