import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaHome, FaBoxOpen } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
};


  const isAuthenticated = !!localStorage.getItem("token"); 

  return (
    <nav>
      <ul>
        <li><Link to="/"><FaHome /> Dashboard</Link></li>
        <li><Link to="/profile"><FaUserCircle /> Profile</Link></li>
        <li><Link to="/items"><FaBoxOpen />  Items</Link></li>
        <li><Link to="/cart"><FaShoppingCart /> My Cart</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/deliver-items">Deliver Items</Link></li>
        <li><Link to="/add-item">Add Item</Link></li>
        <li><Link to="/support">Support</Link></li>
        <li><Link to="/seller-reviews/:sellerId">Reviews</Link></li>
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
