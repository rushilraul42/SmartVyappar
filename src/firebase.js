import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { collection } from "firebase/firestore";

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
export const registerUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user document in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        email: user.email,
        premium: false, // Initialize premium status to false
        // Add any other fields you want to initialize
    });
};

// Sign in an existing user
export const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Sign out the current user
export const signOutUser = () => {
    return signOut(auth);
};

// Check if a user is currently logged in
export const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const communityPostsCollection = collection(db, "communityPosts");

// Export the auth and db instances for use in other parts of the app
export { auth, db };
