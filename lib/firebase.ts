import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "internbridge-app.firebaseapp.com",
  projectId: "internbridge-app",
  storageBucket: "internbridge-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

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
export { app, auth, db, storage };

// Default export for the Firebase app
export default app;