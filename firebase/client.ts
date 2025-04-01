// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACNRkJBatOGFDGPz6_HqC4xKlVGsiIkCQ",
  authDomain: "prepwise-922ff.firebaseapp.com",
  projectId: "prepwise-922ff",
  storageBucket: "prepwise-922ff.firebasestorage.app",
  messagingSenderId: "650184535833",
  appId: "1:650184535833:web:5268b2ccc61a08ea571f88",
  measurementId: "G-YVJPGZW21W"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getAuth(app);
