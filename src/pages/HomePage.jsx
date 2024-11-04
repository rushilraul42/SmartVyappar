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

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Ensure the sign out is awaited
      navigate("/login"); // Redirect to login after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  useEffect(() => {
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
          <button onClick={() => navigate("/community")}>Community</button>
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
        <h1>Recommended Products</h1>
        <div className="recommended-products">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            ))
          ) : (
            <p>No recommended products at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
