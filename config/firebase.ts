import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK84AoIMXm84IhJNcFWPCdvlzNcfgkXJE",
  authDomain: "hs-ai-flashcard.firebaseapp.com",
  projectId: "hs-ai-flashcard",
  storageBucket: "hs-ai-flashcard.appspot.com",
  messagingSenderId: "602029470080",
  appId: "1:602029470080:web:d083d0b3c4957b70409165",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);

export default app;
