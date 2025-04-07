import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"; 
import "./DeliverItems.css";

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({}); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/orders/seller", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.filter((order) => order.status === "pending"));
      } catch (error) {
        console.error("Error fetching seller orders:", error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleOtpChange = (orderId, value) => {
    setOtpInputs((prev) => ({
      ...prev,
      [orderId]: value, 
    }));
  };


  const completeOrder = async (orderId, sellerId) => {
    try {
      const token = localStorage.getItem("token");
      const otp = otpInputs[orderId]; 
  
      if (!otp) {
        alert("Please enter the OTP to complete the order.");
        return;
      }
  
      console.log("Order ID:", orderId);
      console.log("Seller ID:", sellerId);
  
      await axios.put(
        `/orders/complete/${orderId}`,
        { otp, sellerId }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("Order completed successfully!");
  
     
      setOrders(orders.filter((order) => order._id !== orderId));
  
   
      if (sellerId) {
        navigate(`/review/${orderId}/${sellerId}`);
      } else {
        console.error("Seller ID is undefined.");
      }
    } catch (error) {
      alert("Failed to complete the order: " + (error.response?.data?.message || error.message));
    }
  };
  

  return (
    <div className="deliver-container">
      <h1>Deliver Items</h1>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <li className="order-card" key={order._id}>
              <h3>{order.item.name}</h3>
              <p><strong>Buyer:</strong> {order.buyer.firstName} {order.buyer.lastName}</p>
              <p><strong>Amount:</strong> ₹{order.amount}</p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInputs[order._id] || ""}
                onChange={(e) => handleOtpChange(order._id, e.target.value)}
              />
              <button
  className="complete-btn"
  onClick={() => completeOrder(order._id, order.seller._id)} // Pass seller._id
>
  Complete Order
</button>

            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-message">No orders to deliver.</p>
      )}
    </div>
  );
};

export default DeliverItems;
