// Firebase Configuration
// Replace these values with your actual Firebase project config

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase project configuration
// Production configuration for flyjetr-app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBi-L5v8oMYNVBjWiEAQ70RHNBJ_c-ZDDU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flyjetr-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "flyjetr-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "flyjetr-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "784055919827",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:784055919827:web:f2fd8f359f60fe88da2026"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
