import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";  

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="animated-background"></div> 
            <h1>Welcome to the Dashboard!</h1>
            <div className="dashboard-grid">
                <Link to="/items" className="dashboard-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Items" />
                    <h3>Browse Items</h3>
                    <p>Explore the latest products available for purchase.</p>
                </Link>

                <Link to="/orders" className="dashboard-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/3159/3159066.png" alt="Orders" />
                    <h3>View Orders</h3>
                    <p>Track your past and current orders effortlessly.</p>
                </Link>

                <Link to="/add-item" className="dashboard-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/992/992651.png" alt="Add Item" />
                    <h3>Add New Item</h3>
                    <p>List your products for sale with ease.</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
