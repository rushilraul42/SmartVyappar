import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth } from "../firebase"; // Import auth from your firebase config
import "../styles/BuyPage.css"; // Optional: Include CSS for styling if necessary

function BuyPage() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [email, setEmail] = useState(""); // Email state
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        const fetchedProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.category === "buy");
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
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
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = [...currentCart, { title: product.name, category: product.category, price: product.price }];

    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`Added ${product.name} to cart!`);
  };

  const handleReviewSubmit = async (productId) => {
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
      setReviewText(""); // Clear review input
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Buy Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <ItemCard
              title={product.name}
              description={`${product.category} - ₹${product.price}`}
              fullDescription={product.description || "No description available"}
              imageUrl={product.imageUrl} // Pass image URL to ItemCard
              actionLabel="Add to Cart"
              onActionClick={() => handleAddToCart(product)}
            />
            <h3>Reviews</h3>
            <div>
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
                value={reviewText}
                placeholder="Your review"
                onChange={(e) => setReviewText(e.target.value)}
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

export default BuyPage;
