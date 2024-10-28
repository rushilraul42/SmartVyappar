// src/pages/BuyPage.jsx
import React, { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import { db } from "../firebase"; // Importing db to fetch products from Firestore
import { collection, getDocs } from "firebase/firestore";

function BuyPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);
        const fetchedProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.category === "buy");
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = [...currentCart, { title: product.name, category: product.category, price: product.price }];
    
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div>
      <h2>Buy Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <ItemCard
            key={product.id}
            title={product.name}
            description={`${product.category} - ₹${product.price}`}
            actionLabel="Add to Cart"
            onActionClick={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

export default BuyPage;
