// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBGCVU7-UdWThx8CcwrOVUzR_XpXYWyovU",
    authDomain: "smartvyapaar-3a672.firebaseapp.com",
    projectId: "smartvyapaar-3a672",
    storageBucket: "smartvyapaar-3a672.appspot.com",
    messagingSenderId: "1014186169103",
    appId: "1:1014186169103:web:5bc28ce3d2be264e48647a",
    measurementId: "G-XK75N6MEW1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Register a new user
export const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in an existing user
export const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Export the auth and db instances for use in other parts of the app
export { auth, db };
