import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import "./ItemDetails.css"; 

const ItemDetails = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState({});
  const [message, setMessage] = useState("");

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error.message);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/cart",
        { itemId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      setMessage("Failed to add item to cart.");
    }
  };

  return (
    <div className="item-details-container">
      <div className="item-card">
        <h1>{item.name}</h1>
        <p className="description">{item.description}</p>
        <p className="price">Price: ₹{item.price}</p>
        <p className="category">Category: {item.category}</p>

        {item.seller && (
          <div className="vendor-details">
            <h3>Vendor Details:</h3>
            <p>Name: {item.seller.firstName} {item.seller.lastName}</p>
            <p>Email: {item.seller.email}</p>
          </div>
        )}

        <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ItemDetails;
