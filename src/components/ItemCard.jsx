// src/components/ItemCard.jsx
import React from "react";
import "../styles/ItemCard.css";

function ItemCard({ title, description, onActionClick, actionLabel }) {
  return (
    <div className="item-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && (
        <button onClick={onActionClick} className="btn">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ItemCard;
