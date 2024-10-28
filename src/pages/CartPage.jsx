import React, { useState, useEffect } from "react";
import "../styles/CartPage.css"; // Correct import path

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart items from local storage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handlePurchase = () => {
    // Placeholder for purchase functionality
    alert("Proceeding to purchase!");

    // Clear cart items from local storage
    localStorage.removeItem("cart");
    setCartItems([]); // Clear state
  };

  const handleDeleteItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-header">Your Cart</h2>
      {cartItems.length > 0 ? (
        <div>
          <ul className="cart-items-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <span className="cart-item-title">{item.name}</span>
                <span className="cart-item-category">{item.category}</span>
                <span className="cart-item-price">₹{item.price}</span>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteItem(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button className="purchase-button" onClick={handlePurchase}>
            Purchase
          </button>
        </div>
      ) : (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartPage;
