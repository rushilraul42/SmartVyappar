import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/PremiumPage.css";

function PremiumPage() {
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          console.log("Fetched user data:", userDoc.data()); // Log fetched data for debugging
          if (userDoc.data().premium) {
            setIsPremium(true);
          }
        } else {
          console.error("User document does not exist");
        }
      } else {
        console.error("User not logged in");
      }
    };
    fetchUserData();
  }, []);

  const handleGetPremiumClick = () => {
    navigate("/fake-payment"); // Redirect to Fake Payment Page
  };

  return (
    <div className="premium-page">
      <h2>Upgrade to Premium</h2>
      {isPremium ? (
        <div className="premium-activated">
          <h3>Premium Account Activated!</h3>
          <p>Enjoy your premium features:</p>
          <ul>
            <li>Featured on Home Page</li>
            <li>Ad-Free Experience</li>
            <li>Priority Support</li>
          </ul>
        </div>
      ) : (
        <div className="premium-upgrade">
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-cell">Feature</div>
              <div className="comparison-cell">Normal Account</div>
              <div className="comparison-cell">Premium Account</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Product Visibility</div>
              <div className="comparison-cell normal-account">Standard</div>
              <div className="comparison-cell premium-account">Featured on Home Page</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Ad-Free Experience</div>
              <div className="comparison-cell normal-account">No</div>
              <div className="comparison-cell premium-account">Yes</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Priority Support</div>
              <div className="comparison-cell normal-account">No</div>
              <div className="comparison-cell premium-account">Yes</div>
            </div>
          </div>
          <button onClick={handleGetPremiumClick} className="get-premium-button">
            Get Premium
          </button>
        </div>
      )}
    </div>
  );
}

export default PremiumPage;
