// src/pages/PremiumActivatedPage.jsx
import React from "react";
import "../styles/PremiumActivatedPage.css";

function PremiumActivatedPage() {
  return (
    <div className="premium-activated-page">
      <h2>Congratulations!</h2>
      <h3>Your Premium Account is Activated!</h3>
      <p>You now have access to exclusive premium features:</p>
      <ul>
        <li>Featured on Home Page</li>
        <li>Ad-Free Experience</li>
        <li>Priority Support</li>
      </ul>
      <p>Thank you for choosing Premium. Enjoy these benefits and elevate your experience!</p>
    </div>
  );
}

export default PremiumActivatedPage;
