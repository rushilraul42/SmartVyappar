// src/App.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CommunityPage from "./pages/CommunityPage"; // Import at the top
import HomePage from "./pages/HomePage";
import BuyPage from "./pages/BuyPage";
import RentPage from "./pages/RentPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import SellPage from "./pages/SellPage";
import MyListingsPage from "./pages/MyListingsPage";
import CartPage from "./pages/CartPage";
import PremiumPage from "./pages/PremiumPage";
import FakePaymentPage from "./pages/FakePaymentPage";
import PremiumActivatedPage from "./pages/PremiumActivatedPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect to /home if authenticated, else show LoginPage */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <LoginPage />} />
        
        {/* Only show RegistrationPage if user is not logged in */}
        <Route path="/register" element={user ? <Navigate to="/home" /> : <RegistrationPage />} />

        {/* Private Routes (Require Authentication) */}
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/buy" element={user ? <BuyPage /> : <Navigate to="/" />} />
        <Route path="/rent" element={user ? <RentPage /> : <Navigate to="/" />} />
        <Route path="/sell" element={user ? <SellPage /> : <Navigate to="/" />} />
        <Route path="/my-listings" element={user ? <MyListingsPage /> : <Navigate to="/" />} />
        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/" />} />
        <Route path="/premium" element={user ? <PremiumPage /> : <Navigate to="/" />} />
        <Route path="/fake-payment" element={user ? <FakePaymentPage /> : <Navigate to="/" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/community" element={user ? <CommunityPage /> : <Navigate to="/" />} />
        {/* Premium Activated Page should be private as well */}
        <Route path="/premium-activated" element={user ? <PremiumActivatedPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
