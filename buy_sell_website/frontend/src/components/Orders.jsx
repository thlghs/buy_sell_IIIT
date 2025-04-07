
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./Orders.css";

const Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);  // New State
  const [activeTab, setActiveTab] = useState("pending");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      
     
      const userResponse = await axios.get("/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const sellerResponse = await axios.get("/orders/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingOrders(userResponse.data.pending);
      setCompletedOrders(userResponse.data.completed);
      setSoldOrders(sellerResponse.data); 
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const regenerateOtp = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/orders/regenerate-otp/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`New OTP: ${response.data.plainOtp}`);
      fetchOrders();
    } catch (error) {
      console.error("Error regenerating OTP:", error.message);
      alert("Failed to regenerate OTP. Try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h1>Orders History</h1>

      <div className="tab-buttons">
        <button
          className={activeTab === "pending" ? "active" : ""}
          onClick={() => setActiveTab("pending")}
        >
          Pending Orders
        </button>
        <button
          className={activeTab === "completed" ? "active" : ""}
          onClick={() => setActiveTab("completed")}
        >
          Completed Orders
        </button>
        <button
          className={activeTab === "sold" ? "active" : ""}
          onClick={() => setActiveTab("sold")}
        >
          Sold Orders
        </button>
      </div>

 
      {activeTab === "pending" && (
        <div className="order-list">
          {pendingOrders.length > 0 ? (
            pendingOrders.map((order) => (
              <div className="order-card" key={order._id}>
                <h3>{order.item.name}</h3>
                <p>Amount: ₹{order.amount}</p>
                <p>Seller: {order.seller?.firstName} {order.seller?.lastName}</p>
                <p>Email: {order.seller?.email}</p>
                <button
                  className="otp-btn"
                  onClick={() => regenerateOtp(order._id)}
                >
                  Regenerate OTP
                </button>
              </div>
            ))
          ) : (
            <p className="empty-msg">No pending orders.</p>
          )}
        </div>
      )}

      
      {activeTab === "completed" && (
        <div className="order-list">
          {completedOrders.length > 0 ? (
            completedOrders.map((order) => (
              <div className="order-card" key={order._id}>
                <h3>{order.item.name}</h3>
                <p>Amount: ₹{order.amount}</p>
              </div>
            ))
          ) : (
            <p className="empty-msg">No completed orders.</p>
          )}
        </div>
      )}

    
      {activeTab === "sold" && (
        <div className="order-list">
          {soldOrders.length > 0 ? (
            soldOrders
              .filter((order) => order.status === "completed")
              .map((order) => (
                <div className="order-card" key={order._id}>
                  <h3>Item Sold: {order.item.name}</h3>
                  <p>Amount: ₹{order.amount}</p>
                  <p>Buyer: {order.buyer.firstName} {order.buyer.lastName}</p>
                  <p>Status: {order.status}</p>
                </div>
              ))
          ) : (
            <p className="empty-msg">No items sold yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
