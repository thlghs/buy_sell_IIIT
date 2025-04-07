const express = require("express");
const router = express.Router();
const ChatSession = require("../models/ChatSession");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const axios = require("axios");


const detectWebsiteQuery = (message) => {
    const patterns = [
        { keyword: ["cart", "my cart"], action: "FETCH_CART" },
        { keyword: ["pending orders", "my orders"], action: "FETCH_ORDERS" },
        { keyword: ["profile", "my details"], action: "FETCH_PROFILE" },
    ];

    for (let pattern of patterns) {
        if (pattern.keyword.some(k => message.toLowerCase().includes(k))) {
            return pattern.action;
        }
    }
    return null;
};


router.post("/chat", async (req, res) => {
    const { messages, userId } = req.body;
    const userMessage = messages[messages.length - 1]?.content;

    try {
      
        let session = await ChatSession.findOne({ userId });
        if (!session) {
            session = new ChatSession({ userId, messages: [] });
        }

      
        session.messages.push({ sender: "user", text: userMessage });
        await session.save();

       
        const websiteAction = detectWebsiteQuery(userMessage);
        if (websiteAction) {
            let botReply = "Sorry, I couldn't find the information.";

            switch (websiteAction) {
                case "FETCH_CART":
                    const cart = await Cart.findOne({ user: userId }).populate("items");
                    if (cart && cart.items.length > 0) {
                        botReply = "Here are the items in your cart:\n" +
                            cart.items.map(item => `- ${item.name} (₹${item.price})`).join("\n");
                    } else {
                        botReply = "Your cart is empty.";
                    }
                    break;

                case "FETCH_ORDERS":
                    const orders = await Order.find({ buyer: userId, status: "pending" }).populate("item");
                    if (orders.length > 0) {
                        botReply = "Here are your pending orders:\n" +
                            orders.map(order => `- ${order.item.name} (₹${order.amount})`).join("\n");
                    } else {
                        botReply = "You have no pending orders.";
                    }
                    break;

                case "FETCH_PROFILE":
                    const user = await User.findById(userId);
                    if (user) {
                        botReply = `Here are your profile details:\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nContact: ${user.contactNumber}`;
                    }
                    break;

                default:
                    botReply = "I'm not sure how to help with that.";
            }

           
            session.messages.push({ sender: "bot", text: botReply });
            await session.save();
            return res.status(200).json({ reply: botReply });
        }

      
        const conversationHistory = session.messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
        }));

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: conversationHistory },
            { headers: { "Content-Type": "application/json" } }
        );

        const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "No response from AI.";

     
        session.messages.push({ sender: "bot", text: botReply });
        await session.save();

        res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Sorry, I couldn't process your request." });
    }
});

module.exports = router;
