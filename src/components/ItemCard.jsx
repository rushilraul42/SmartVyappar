// src/components/ItemCard.jsx
import React, { useState } from "react";
import "../styles/ItemCard.css";

function ItemCard({ title, description, fullDescription, imageUrl, onActionClick, actionLabel }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="item-card">
      {imageUrl && <img src={imageUrl} alt={title} className="item-card-image" />} {/* Display product image */}
      <h3>{title}</h3>
      <p>{description}</p>
      
      {/* Button to toggle full description visibility */}
      <button onClick={toggleExpand} className="btn">
        {isExpanded ? "Hide Details" : "Show Details"}
      </button>
      
      {/* Conditionally render full description */}
      {isExpanded && <p className="full-description">{fullDescription}</p>}
      
      {/* Action button, e.g., "Add to Cart" */}
      {actionLabel && (
        <button onClick={onActionClick} className="btn">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ItemCard;
