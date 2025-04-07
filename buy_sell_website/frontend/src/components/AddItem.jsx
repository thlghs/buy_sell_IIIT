import React, { useState } from "react";
import axios from "../api/axios";
import "./AddItem.css";

const AddItem = () => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "electronics", 
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("/items/add", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", 
                },
            });

            setSuccessMessage(response.data.message);
            setFormData({ name: "", price: "", description: "", category: "electronics" });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to add item.");
        }
    };

    return (
        <div className="add-item-container">
            <h1>Add New Item</h1>
            {successMessage && <p className="success-msg">{successMessage}</p>}
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
            
            <form onSubmit={handleSubmit} className="add-item-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                ></textarea>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="electronics">Electronics</option>
                    <option value="grocery">Grocery</option>
                    <option value="clothing">Clothing</option>
                </select>
                <button type="submit" className="add-btn">Add Item</button>
            </form>
        </div>
    );
};

export default AddItem;
