// src/pages/RentPage.jsx
import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth } from "../firebase"; // Import auth from your firebase config
import "../styles/RentPage.css";

function RentPage() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [email, setEmail] = useState(""); // Email state
  const [reviewTexts, setReviewTexts] = useState({}); // Store review texts for each product

  useEffect(() => {
    const fetchRentItems = async () => {
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      const rentItemsList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => product.category === "rent");
      setProducts(rentItemsList);
    };

    fetchRentItems();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsRef = collection(db, "reviews");
      const querySnapshot = await getDocs(reviewsRef);
      const fetchedReviews = {};
      querySnapshot.docs.forEach(doc => {
        const reviewData = doc.data();
        if (!fetchedReviews[reviewData.productId]) {
          fetchedReviews[reviewData.productId] = [];
        }
        fetchedReviews[reviewData.productId].push(reviewData);
      });
      setReviews(fetchedReviews);
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    // Fetch user email from authentication
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email); // Set email state from user information
    }
  }, []);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(product);
    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`Added ${product.name} to cart!`);
  };

  const handleReviewSubmit = async (productId) => {
    const reviewText = reviewTexts[productId] || ""; // Get the review text for the specific product

    if (!email || !reviewText) {
      alert("Please enter your email and review text.");
      return;
    }

    try {
      const reviewData = {
        email,
        text: reviewText,
        productId,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "reviews"), reviewData);
      setReviewTexts((prev) => ({ ...prev, [productId]: "" })); // Clear review input for that product
      alert("Review submitted!");

      // Refresh reviews
      const updatedReviews = { ...reviews };
      if (!updatedReviews[productId]) {
        updatedReviews[productId] = [];
      }
      updatedReviews[productId].push(reviewData);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error submitting review: ", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const handleReviewChange = (productId, value) => {
    setReviewTexts((prev) => ({ ...prev, [productId]: value })); // Update review text for the specific product
  };

  return (
    <div className="rent-page">
      <h2>Rent Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <ItemCard
              title={product.name}
              description={`${product.category} - ₹${product.price}`}
              fullDescription={product.description || "No description available"}
              actionLabel="Add to Cart"
              onActionClick={() => handleAddToCart(product)}
            />
            <h3>Reviews</h3>
            <div className="reviews-container">
              {reviews[product.id]?.map((review, index) => (
                <div key={index} className="review">
                  <strong>{review.email}:</strong> {review.text}
                </div>
              ))}
            </div>
            <div className="review-input">
              <input
                type="email"
                value={email} // Automatically filled with user's email
                placeholder="Your email"
                readOnly // Make email input read-only
              />
              <textarea
                value={reviewTexts[product.id] || ""} // Use specific product review text
                placeholder="Your review"
                onChange={(e) => handleReviewChange(product.id, e.target.value)} // Handle change for specific product
                required
              />
              <button onClick={() => handleReviewSubmit(product.id)}>Submit Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RentPage;
