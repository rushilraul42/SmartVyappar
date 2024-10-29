// src/pages/HomePage.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2 className="navbar-brand">Smart Vyapaar</h2>
        <div className="navbar-links">
          <button onClick={() => navigate("/buy")}>Buy</button>
          <button onClick={() => navigate("/rent")}>Rent</button>
          <button onClick={() => navigate("/sell")}>Sell</button>
          <button onClick={toggleAccountMenu} className="account-nav-button">Account</button>
        </div>
      </nav>
      
      {showAccountMenu && (
        <div className="account-dropdown">
          <h3>Manage Account</h3>
          <p>Email: {auth.currentUser.email}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <button onClick={() => navigate("/my-listings")}>
            My Listings
          </button>
          <button onClick={() => navigate("/cart")}>
            View Cart
          </button>
        </div>
      )}

      <div className="content">
        <h1>Welcome to Smart Vyapaar</h1>
        <p>Choose an option to proceed:</p>
      </div>
    </div>
  );
}

export default HomePage;
