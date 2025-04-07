import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./ReviewForm.css";

const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const { orderId, sellerId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            await axios.post("/reviews/add", {
                seller: sellerId,
                order: orderId,
                rating,
                description
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Review submitted successfully!");
            navigate("/orders");  
        } catch (error) {
            console.error("Error submitting review:", error.message);
        }
    };

    return (
        <div className="review-container">
            <h2>Leave a Review</h2>
            <form onSubmit={handleSubmit} className="review-form">
                <label>Rating (out of 5):</label>
                <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={rating} 
                    onChange={(e) => setRating(e.target.value)} 
                    required 
                />
                <textarea
                    placeholder="Write your review..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit" className="submit-btn">Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewForm;
