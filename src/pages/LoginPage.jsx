// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const provider = new GoogleAuthProvider();

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Google Sign-In Error: ", error.message);
      setError("Google Sign-In failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Smart Vyapaar Login</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit">Login</button>
      </form>

      <button onClick={handleGoogleLogin} className="google-signin-button">
        Sign in with Google
      </button>

      <p>
        Don’t have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="signup-link"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
