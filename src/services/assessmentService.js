// ============================================================================
// Firebase Configuration & Utilities
// ============================================================================
// File: src/services/assessmentService.js

import { firestore, serverTimestamp } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// Use firestore from your existing firebase.js
const db = firestore;

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate random 2-letter suffix (uppercase)
 */
const generateRandomSuffix = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars.charAt(Math.floor(Math.random() * 26)) + 
         chars.charAt(Math.floor(Math.random() * 26));
};

/**
 * Extract last 5 digits from phone number
 */
const getPhoneLast5 = (phone) => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Get last 5 digits
  return digits.slice(-5);
};

/**
 * Generate Assessment ID
 * Format: <First1><Last1>-<Grade>-<Phone5><Random2>
 * Example: AS-5-43210XK
 */
export const generateAssessmentId = (fullName, grade, mobile) => {
  try {
    // Split name and get initials
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[nameParts.length - 1] || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    // Get phone last 5 digits
    const phoneLast5 = getPhoneLast5(mobile);
    
    // Generate random 2-letter suffix
    const randomSuffix = generateRandomSuffix();
    
    // Construct ID: AS-5-43210XK
    const assessmentId = `${firstInitial}${lastInitial}-${grade}-${phoneLast5}${randomSuffix}`;
    
    return assessmentId;
  } catch (error) {
    console.error('Error generating assessment ID:', error);
    // Fallback to timestamp-based ID
    return `FALLBACK-${Date.now()}`;
  }
};

/**
 * Check if assessment ID already exists in Firestore
 */
export const checkIdExists = async (assessmentId) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking ID existence:', error);
    return false;
  }
};

/**
 * Generate unique assessment ID (retry if collision)
 */
export const generateUniqueAssessmentId = async (fullName, grade, mobile) => {
  let attempts = 0;
  let assessmentId = generateAssessmentId(fullName, grade, mobile);
  
  // Try up to 5 times to generate unique ID
  while (attempts < 5) {
    const exists = await checkIdExists(assessmentId);
    if (!exists) {
      return assessmentId;
    }
    // Collision - regenerate with different random suffix
    assessmentId = generateAssessmentId(fullName, grade, mobile);
    attempts++;
  }
  
  // Fallback if all attempts failed
  return `${assessmentId}-${Date.now()}`;
};

// ============================================================================
// TOUCH POINT 1: Save Registration Data (Before Module Selection)
// ============================================================================

/**
 * Save initial registration data when user confirms and goes to module selection
 * This captures leads even if they don't complete the assessment
 */
export const saveRegistrationData = async (assessmentId, data) => {
  try {
    const assessmentRef = doc(db, 'assessments', assessmentId);
    
    const assessmentDoc = {
      assessmentId,
      status: "registered", // registered → module-started → completed
      
      // Student Info
      studentData: {
        fullName: data.studentData.fullName,
        grade: data.studentData.grade,
        mobile: data.studentData.mobile,
        email: data.studentData.email || null,
        schoolName: data.studentData.schoolName || null,
        section: data.studentData.section || null,
        rollNumber: data.studentData.rollNumber || null,
      },
      
      userType: data.userType, // 'parent' or 'school'
      
      // Empty at this stage
      rankingData: null,
      currentModule: null,
      moduleResults: [],
      
      // Timestamps
      registeredAt: serverTimestamp(),
      moduleStartedAt: null,
      completedAt: null,
      lastActivity: serverTimestamp(),
    };
    
    await setDoc(assessmentRef, assessmentDoc);
    
    return { success: true, assessmentId };
  } catch (error) {
    console.error('Error saving registration data:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// TOUCH POINT 2: Update When Module Started
// ============================================================================

/**
 * Update assessment status when user clicks on a specific module
 */
export const updateModuleStarted = async (assessmentId, moduleName) => {
  try {
    const assessmentRef = doc(db, 'assessments', assessmentId);
    
    await updateDoc(assessmentRef, {
      status: "module-started",
      currentModule: moduleName,
      moduleStartedAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating module started:', error);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// FIRESTORE OPERATIONS (EXISTING - Touch Point 3)
// ============================================================================

/**
 * Save new assessment to Firestore
 */
export const saveNewAssessment = async (assessmentId, data) => {
  try {
    const assessmentRef = doc(db, 'assessments', assessmentId);
    
    const assessmentDoc = {
      assessmentId,
      
      // Student Info
      studentData: {
        fullName: data.studentData.fullName,
        grade: data.studentData.grade,
        mobile: data.studentData.mobile,
        email: data.studentData.email || null,
        schoolName: data.studentData.schoolName || null,
        section: data.studentData.section || null,
        rollNumber: data.studentData.rollNumber || null,
      },
      
      userType: data.userType, // 'parent' or 'school'
      
      // Ranking Data (one-time, applies to all modules)
      rankingData: data.rankingData || null,
      
      // Module Results (array)
      moduleResults: [
        {
          module: data.module,
          completedAt: data.endTime,
          rawScore: data.rawScore,
          totalQuestions: data.totalQuestions,
          percentage: data.percentage,
          weightedIndex: data.spellingIndex, // or readingIndex, etc.
          skillLevel: data.skillLevel,
          clusterScores: data.clusterScores,
          achievementUnlocked: data.achievementUnlocked,
          achievementName: data.achievementName,
          completionTimeMinutes: Math.floor(data.duration / 60),
          startTime: data.startTime,
          endTime: data.endTime,
          answers: data.answers, // Individual question answers
        }
      ],
      
      // Metadata
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    };
    
    await setDoc(assessmentRef, assessmentDoc);
    
    return { success: true, assessmentId };
  } catch (error) {
    console.error('Error saving assessment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add module result to existing assessment
 */
export const addModuleResult = async (assessmentId, moduleData) => {
  try {
    const assessmentRef = doc(db, 'assessments', assessmentId);
    const docSnap = await getDoc(assessmentRef);
    
    if (!docSnap.exists()) {
      throw new Error('Assessment not found');
    }
    
    const currentData = docSnap.data();
    
    // Add new module result
    const newModuleResult = {
      module: moduleData.module,
      completedAt: moduleData.endTime,
      rawScore: moduleData.rawScore,
      totalQuestions: moduleData.totalQuestions,
      percentage: moduleData.percentage,
      weightedIndex: moduleData.spellingIndex,
      skillLevel: moduleData.skillLevel,
      clusterScores: moduleData.clusterScores,
      achievementUnlocked: moduleData.achievementUnlocked,
      achievementName: moduleData.achievementName,
      completionTimeMinutes: Math.floor(moduleData.duration / 60),
      startTime: moduleData.startTime,
      endTime: moduleData.endTime,
      answers: moduleData.answers,
    };
    
    await updateDoc(assessmentRef, {
      moduleResults: [...currentData.moduleResults, newModuleResult],
      lastUpdated: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error adding module result:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch assessment by ID
 */
export const fetchAssessment = async (assessmentId) => {
  try {
    const docRef = doc(db, 'assessments', assessmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: docSnap.data()
      };
    } else {
      return {
        success: false,
        error: 'Assessment not found'
      };
    }
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify phone number matches assessment
 */
export const verifyPhoneNumber = (assessmentData, enteredPhone) => {
  const storedPhone = assessmentData.studentData.mobile;
  // Remove all non-digit characters for comparison
  const cleanStored = storedPhone.replace(/\D/g, '');
  const cleanEntered = enteredPhone.replace(/\D/g, '');
  
  return cleanStored === cleanEntered;
};

/**
 * Get completed modules for an assessment
 */
export const getCompletedModules = (assessmentData) => {
  if (!assessmentData || !assessmentData.moduleResults) {
    return [];
  }
  return assessmentData.moduleResults.map(result => result.module);
};

/**
 * Check if module already completed
 */
export const isModuleCompleted = (assessmentData, moduleName) => {
  const completedModules = getCompletedModules(assessmentData);
  return completedModules.includes(moduleName);
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Mask phone number for display (show only last 5 digits)
 * Example: +91 98765 43210 → ******43210
 */
export const maskPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  const last5 = digits.slice(-5);
  return '*'.repeat(digits.length - 5) + last5;
};

/**
 * Format assessment ID for display
 */
export const formatAssessmentId = (id) => {
  return id.toUpperCase();
};

/**
 * Validate assessment ID format
 * Format: AB-5-12345CD (2 letters, dash, 1-2 digits, dash, 5 digits + 2 letters)
 */
export const validateAssessmentIdFormat = (id) => {
  const pattern = /^[A-Z]{2}-\d{1,2}-\d{5}[A-Z]{2}$/i;
  return pattern.test(id);
};

// Export db for direct access if needed
export { db };