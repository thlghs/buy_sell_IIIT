import React, { useState, useEffect } from "react";
import axios from "../api/axios";

const OrdersHistory = () => {
    const [buyerOrders, setBuyerOrders] = useState([]);
    const [sellerOrders, setSellerOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            try {
                const [buyerResponse, sellerResponse] = await Promise.all([
                    axios.get("/orders/buyer", { headers }),
                    axios.get("/orders/seller", { headers }),
                ]);

                setBuyerOrders(buyerResponse.data);
                setSellerOrders(sellerResponse.data);
            } catch (error) {
                console.error("Error fetching orders:", error.message);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Orders History</h1>
            <div>
                <h2>Orders Placed</h2>
                <ul>
                    {buyerOrders.map((order) => (
                        <li key={order._id}>
                            Item: {order.item.name}, Amount: ₹{order.amount}, Seller: {order.seller.firstName} {order.seller.lastName} 
                            ({order.seller.email})
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Orders Received</h2>
                <ul>
                    {sellerOrders.map((order) => (
                        <li key={order._id}>
                            Buyer: {order.buyer.firstName} {order.buyer.lastName} 
                            ({order.buyer.email})
                            
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrdersHistory;
