// src/pages/SellPage.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import "../styles/SellPage.css";

function SellPage() {
  const [productName, setProductName] = useState("");
  const [isRent, setIsRent] = useState(false);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  // Check if the user is premium when the component loads
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().premium) {
          setIsPremium(true);
        }
      }
    };
    checkPremiumStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is authenticated
    if (!auth.currentUser) {
      setError("You must be logged in to list a product.");
      return;
    }

    try {
      const userId = auth.currentUser.uid; // Get the current user's ID
      const productData = {
        name: productName,
        category: isRent ? "rent" : "buy",
        price: isRent ? `${price} per week` : price,
        timestamp: new Date(),
        userId, // Add userId field
        featured: isPremium, // Mark as featured if user is premium
      };

      const productsRef = collection(db, "products");
      await addDoc(productsRef, productData);

      alert("Product listed successfully!");
      setProductName("");
      setIsRent(false);
      setPrice("");
      setError("");
    } catch (error) {
      console.error("Error adding product: ", error);
      setError("Failed to list product. Please try again.");
    }
  };

  return (
    <div className="sell-page">
      <h2>List Your Product</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="radio-group">
          <label>Category:</label>
          <label>
            <input
              type="radio"
              value="sell"
              checked={!isRent}
              onChange={() => setIsRent(false)}
            />
            Sell
          </label>
          <label>
            <input
              type="radio"
              value="rent"
              checked={isRent}
              onChange={() => setIsRent(true)}
            />
            Rent
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {isRent ? " per week" : ""}
          </label>
        </div>
        <button type="submit">List Product</button>
      </form>
    </div>
  );
}

export default SellPage;
