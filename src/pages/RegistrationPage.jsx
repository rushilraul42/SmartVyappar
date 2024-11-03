// src/components/RegistrationForm.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase"; // Import Firestore (db) and auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create the user with email and password
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Set up Firestore document for the new user with default fields
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        cart: [],
        purchaseHistory: []
      });

      // Navigate to home page or another appropriate page after registration
      navigate("/home");
    } catch (error) {
      console.error("Registration Error: ", error.message);
      setError("Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="registration-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default RegistrationForm;
