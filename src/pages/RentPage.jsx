// src/pages/RentPage.jsx
import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { db } from "../firebase"; // Ensure db is imported
import { collection, getDocs } from "firebase/firestore"; // Removed addDoc since we are using localStorage
import "../styles/RentPage.css";

function RentPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRentItems = async () => {
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);
      const rentItemsList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => product.category === "rent"); // Only fetch "rent" items
      setProducts(rentItemsList);
    };

    fetchRentItems();
  }, []);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(product); // Add the selected product to the cart
    localStorage.setItem("cart", JSON.stringify(existingCart)); // Update local storage
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div>
      <h2>Rent Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <ItemCard
            key={product.id}
            title={product.name}
            description={`${product.category} - ₹${product.price}`}
            actionLabel="Add to Cart"
            onActionClick={() => handleAddToCart(product)} // Call handleAddToCart on action click
          />
        ))}
      </div>
    </div>
  );
}

export default RentPage;
