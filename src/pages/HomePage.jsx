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
      <h1>Welcome to Smart Vyapaar</h1>
      <p>Choose an option to proceed:</p>
      <div className="home-buttons">
        <button onClick={() => navigate("/buy")}>Buy Products</button>
        <button onClick={() => navigate("/rent")}>Rent Products</button>
        <button onClick={() => navigate("/sell")}>Sell Products</button>
      </div>

      <div className="account-section">
        <button onClick={toggleAccountMenu} className="account-button">
          Account
        </button>
        {showAccountMenu && (
          <div className="account-dropdown">
            <h3>Manage Account</h3>
            <p>Email: {auth.currentUser.email}</p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
            <button onClick={() => navigate("/my-listings")} className="my-listings-button">
              My Listings
            </button>
            <button onClick={() => navigate("/cart")} className="cart-button">
              View Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;