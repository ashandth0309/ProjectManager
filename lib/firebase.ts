import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBkp3qmLU_Tz6Qn0zzieK5ywXKwnkMDXhw",
  authDomain: "project-manager-7af52.firebaseapp.com",
  projectId: "project-manager-7af52",
  storageBucket: "project-manager-7af52.firebasestorage.app",
  messagingSenderId: "1081525548027",
  appId: "1:1081525548027:web:f425ebbefa8b59eacb915e",
  measurementId: "G-WQG8PMEVTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence - Check if getReactNativePersistence exists
let auth;

try {
  // For Firebase v9.6.0+
  const { getReactNativePersistence } = require('firebase/auth');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Fallback for older versions
  console.warn('getReactNativePersistence not available, using getAuth');
  auth = getAuth(app);
}

// Initialize Cloud Firestore
const db = getFirestore(app);

// Enable Firestore offline persistence (optional - remove if causing issues)
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('Firestore offline persistence enabled');
  })
  .catch((err) => {
    console.warn('Firestore offline persistence error:', err.code);
  });

// Initialize Cloud Storage
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;