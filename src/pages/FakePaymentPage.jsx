import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import "../styles/FakePaymentPage.css";

function FakePaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [pin, setPin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [upiPin, setUpiPin] = useState("");
  const navigate = useNavigate();

  const handlePaymentMethodChange = (event) => setPaymentMethod(event.target.value);

  const handleSubmit = async () => {
    const isCardValid = cardNumber.replace(/\s/g, "").length === 16;
    const isCvvValid = cvv.length === 3;
    const isPinValid = pin.length === 4;
    const isPhoneNumberValid = phoneNumber.startsWith("+91") && phoneNumber.length === 13;
    const isUpiPinValid = upiPin.length === 4;

    if (
      (paymentMethod === "card" && isCardValid && isCvvValid && isPinValid) ||
      (paymentMethod === "upi" && isPhoneNumberValid && isUpiPinValid)
    ) {
      alert("Payment successful! Premium account activated.");

      // Check if user is logged in and get uid
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        console.log("Current User ID:", userId); // Log the user ID

        // Check if the user document exists before trying to update it
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          console.log("User document exists:", userDoc.data()); // Log the existing user document data

          // Update user's premium status in Firestore
          await updateDoc(userRef, { premium: true });
          console.log("Premium status updated successfully.");
        } else {
          console.error("No user document found for UID:", userId); // Log if document does not exist
        }
      } else {
        console.error("No user is currently logged in.");
      }

      navigate("/premium"); // Redirect to Premium page after successful payment
    } else {
      alert("Please enter valid payment details.");
    }
  };

  return (
    <div className="container">
      <h2>Choose Your Payment Method</h2>
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={handlePaymentMethodChange}
          />
          Card
        </label>
        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={handlePaymentMethodChange}
          />
          UPI
        </label>
      </div>

      {paymentMethod === "card" && (
        <div className="card-details">
          <input
            type="text"
            value={cardNumber}
            maxLength="19"
            placeholder="Card Number (16 digits)"
            onChange={(e) =>
              setCardNumber(
                e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
              )
            }
          />
          <input
            type="text"
            value={cvv}
            maxLength="3"
            placeholder="CVV (3 digits)"
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
          />
          <input
            type="text"
            value={pin}
            maxLength="4"
            placeholder="PIN (4 digits)"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="upi-details">
          <input
            type="text"
            value={phoneNumber}
            maxLength="13"
            placeholder="+91 Phone Number (10 digits)"
            onChange={(e) => setPhoneNumber("+91" + e.target.value.slice(3, 13).replace(/\D/g, ""))}
          />
          <input
            type="text"
            value={upiPin}
            maxLength="4"
            placeholder="UPI PIN (4 digits)"
            onChange={(e) => setUpiPin(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      )}

      <button onClick={handleSubmit} className="confirm-button">
        Confirm Payment
      </button>
    </div>
  );
}

export default FakePaymentPage;
