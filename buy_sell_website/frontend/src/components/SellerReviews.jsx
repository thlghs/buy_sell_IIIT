import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

const SellerReviews = () => {
    const { sellerId } = useParams();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`/reviews/seller/${sellerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error.message);
            }
        };

        fetchReviews();
    }, [sellerId]);

    return (
        <div>
            <h2>Seller Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id}>
                        <p>Rating: {review.rating} ⭐</p>
                        <p>Review: {review.description}</p>
                        <p>By: {review.buyer.firstName} {review.buyer.lastName}</p>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
};

export default SellerReviews;
