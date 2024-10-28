// src/pages/MyListingsPage.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../styles/MyListingsPage.css";

function MyListingsPage() {
  const [userItems, setUserItems] = useState([]);
  const navigate = useNavigate();

  const fetchUserItems = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserItems(items);
      }
    } catch (error) {
      console.error("Error fetching user items: ", error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, "products", itemId));
      setUserItems(userItems.filter(item => item.id !== itemId));
      alert("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting item: ", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, []);

  return (
    <div className="my-listings-container">
      <h2>My Listings</h2>
      <button onClick={() => navigate("/home")}>Back to Home</button>
      {userItems.length ? (
        <ul>
          {userItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.category} - ₹{item.price}
              <button onClick={() => handleDelete(item.id)} className="delete-button">
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items listed yet.</p>
      )}
    </div>
  );
}

export default MyListingsPage;
