// src/pages/MyListingsPage.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "../styles/MyListingsPage.css";

function MyListingsPage() {
  const [userItems, setUserItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null); // State for tracking editing item
  const [editData, setEditData] = useState({ name: "", price: "", description: "" }); // State for edit form
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

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setEditData({ name: item.name, price: item.price, description: item.description });
  };

  const handleSave = async (itemId) => {
    try {
      const itemRef = doc(db, "products", itemId);
      await updateDoc(itemRef, {
        name: editData.name,
        price: editData.price,
        description: editData.description,
      });

      setUserItems(
        userItems.map(item =>
          item.id === itemId ? { ...item, ...editData } : item
        )
      );
      setEditingItemId(null); // Exit edit mode
      alert("Item updated successfully.");
    } catch (error) {
      console.error("Error updating item: ", error);
      alert("Failed to update item. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({ ...prevData, [name]: value }));
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
              {editingItemId === item.id ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleChange}
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                  <button onClick={() => handleSave(item.id)}>Save</button>
                  <button onClick={() => setEditingItemId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  {item.name} - {item.category} - ₹{item.price}
                  <p>{item.description}</p>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              )}
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
