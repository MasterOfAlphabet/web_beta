// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Optional for future file storage
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByNAR8mWYEq9F9hrSqwlLuKSZLGae-R1k",
  authDomain: "master-of-alphabet.firebaseapp.com",
  projectId: "master-of-alphabet",
  storageBucket: "master-of-alphabet.appspot.com",
  messagingSenderId: "620931661204",
  appId: "1:620931661204:web:fb0d6fc0d5bc5324186381"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Optional

setPersistence(auth, browserSessionPersistence); // Only persist for current session

// Export utilities and services
export { firestore, auth, storage, serverTimestamp };
export default app;