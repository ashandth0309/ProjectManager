import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeFirestore, memoryLocalCache, persistentLocalCache } from 'firebase/firestore';

// Replace your current Firestore initialization with:
const firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(/* settings */)
});

// OR if you want memory cache (temporary):
// const firestore = initializeFirestore(app, {
//   localCache: memoryLocalCache()
// });

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase Authentication with AsyncStorage persistence
import { getAuth } from 'firebase/auth';
export const auth = getAuth(app);
// Initialize Cloud Firestore and enable offline persistence
const db = getFirestore(app);


// Enable Firestore offline persistence
enableIndexedDbPersistence(db)
  .then(() => {
    console.log('Firestore offline persistence enabled');
  })
  .catch((err) => {
    console.warn('Firestore offline persistence error:', err.code);
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support all of the features required
      console.warn('Current environment doesn\'t support persistence');
    }
  });

// Initialize Cloud Storage
const storage = getStorage(app);

// Firebase services export


// Default export for the Firebase app
export default app;