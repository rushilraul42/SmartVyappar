import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../utils/cloudinary"; // Adjust the path as necessary
import "../styles/SellPage.css";

function SellPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [isRent, setIsRent] = useState(false);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  const handleImageUpload = async (file) => {
    try {
      const url = await uploadImageToCloudinary(file); // Use the upload function here
      setImageUrl(url); // Save the URL from Cloudinary response
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      setError("You must be logged in to list a product.");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const productData = {
        name: productName,
        description,
        category: isRent ? "rent" : "buy",
        price: isRent ? `${price} per week` : price,
        timestamp: new Date(),
        userId,
        featured: isPremium,
        imageUrl, // Include imageUrl in the product data
      };

      const productsRef = collection(db, "products");
      await addDoc(productsRef, productData);

      alert("Product listed successfully!");
      setProductName("");
      setDescription("");
      setIsRent(false);
      setPrice("");
      setImageUrl(""); // Reset image URL
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
        <div>
          <label>About Product:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter product details here..."
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
        <div>
          <label>Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
        </div>
        <button type="submit">List Product</button>
      </form>
    </div>
  );
}

export default SellPage;
