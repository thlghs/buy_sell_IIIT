import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import "./Items.css"; 

const Items = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const category = selectedCategories.join(","); 
      const response = await axios.get("/items", {
        params: { category, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, selectedCategories]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login'); 
    }
}, [navigate]);

  const addToCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/cart",
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="items-container">
      <h1>Shop Items</h1>

      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <div className="category-filters">
          {["Electronics", "Clothing", "Grocery"].map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                value={category.toLowerCase()}
                onChange={() => handleCategoryChange(category.toLowerCase())}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className="items-grid">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <Link to={`/items/${item._id}`} className="item-title">
              {item.name} - ₹{item.price}
            </Link>
            <p className="vendor-info">Vendor: {item.seller?.firstName} {item.seller?.lastName}</p>
            <p className="email-info">Email: {item.seller?.email}</p>
            <button className="add-to-cart-btn" onClick={() => addToCart(item._id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Items;
