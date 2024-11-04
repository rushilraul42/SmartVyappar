// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import "../styles/CartPage.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handlePurchaseItem = (index) => {
    const item = cartItems[index];
    alert(`Item ${item.name} bought successfully!`);

    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleBuyCart = () => {
    if (cartItems.length > 0) {
      alert("All items in the cart bought successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
    } else {
      alert("Your cart is empty.");
    }
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
                  className="purchase-item-button" 
                  onClick={() => handlePurchaseItem(index)}>
                  Purchase
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteItem(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button className="buy-cart-button" onClick={handleBuyCart}>
            Buy Cart
          </button>
        </div>
      ) : (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartPage;
