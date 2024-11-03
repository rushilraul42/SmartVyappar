// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();

  const toggleAccountMenu = () => setShowAccountMenu(!showAccountMenu);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  // Fetch recommended (featured) products
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const featuredQuery = query(productsRef, where("featured", "==", true));
        const querySnapshot = await getDocs(featuredQuery);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecommendedProducts(products);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    fetchRecommendedProducts();
  }, []);

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2 className="navbar-brand">Smart <span>Vyapaar</span></h2>
        <div className="navbar-links">
          <button onClick={() => navigate("/buy")}>Buy</button>
          <button onClick={() => navigate("/rent")}>Rent</button>
          <button onClick={() => navigate("/sell")}>Sell</button>
          <div className="hello">
            <button onClick={toggleAccountMenu} className="account-nav-button">Account</button>
          </div>
        </div>
      </nav>
      
      {showAccountMenu && (
        <div className="account-dropdown">
          <h3>Manage Account</h3>
          <p>Email: {auth.currentUser?.email}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
          <button onClick={() => navigate("/my-listings")}>My Listings</button>
          <button onClick={() => navigate("/cart")}>View Cart</button>
          <button onClick={() => navigate("/premium")}>Premium</button>
        </div>
      )}

      <div className="content">
        <h1>Welcome to Smart Vyapaar</h1>
        <p>Your one-stop shop for buying, selling, and renting goods.</p>
        
        <h2>Recommended for You</h2>
        <div className="recommended-products">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: {product.price}</p>
              </div>
            ))
          ) : (
            <p>No recommended products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
