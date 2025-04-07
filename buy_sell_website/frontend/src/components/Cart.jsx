
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./Cart.css"; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const fetchCartItems = async () => {
      try {
          const token = localStorage.getItem("token");
          const response = await axios.get("/cart", {
              headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(response.data);
          calculateTotalCost(response.data);
      } catch (error) {
          console.error("Error fetching cart items:", error.message);
      }
  };

  const calculateTotalCost = (items) => {
      const total = items.reduce((sum, item) => sum + item.price, 0);
      setTotalCost(total);
  };

   
   const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
    }
  };

  const placeOrder = async () => {
      try {
          const token = localStorage.getItem("token");
          const response = await axios.post("/orders/place", {}, {
              headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
              alert("Order placed successfully!");
              setCartItems([]);
              setTotalCost(0);
          } else {
              alert("Failed to place the order.");
          }
      } catch (error) {
          console.error("Error placing order:", error.message);
          alert("Error placing order. Please try again.");
      }
  };

  useEffect(() => {
      fetchCartItems();
  }, []);

  return (
    <div className="cart-container">
      <h1 className="cart-title">My Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Total Cost: ₹{totalCost}</h2>
            <button className="place-order-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </>
      ) : (
        <p className="empty-cart-msg">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;

