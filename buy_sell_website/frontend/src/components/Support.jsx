import React, { useState, useEffect } from "react";
import axios from "../api/axios";

const Support = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                setUserId(decodedToken.id);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    const sendMessage = async () => {
        if (input.trim() === ""|| !userId) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("/support/chat", {
                messages: newMessages,
                userId: userId, 
            });

            setMessages([...newMessages, { role: "assistant", content: response.data.reply }]);
        } catch (error) {
            console.error("Error communicating with the chatbot:", error);
            setMessages([...newMessages, { role: "assistant", content: "Sorry, I couldn't process your request." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div style={styles.chatContainer}>
            <h2>Support Chatbot</h2>
            <div style={styles.chatBox}>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.role === "user" ? styles.userMessage : styles.assistantMessage}>
                        {msg.content}
                    </div>
                ))}
                {loading && <p style={styles.loading}>Typing...</p>}
            </div>
            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={styles.input}
                    disabled={!userId}
                />
                <button onClick={sendMessage} style={styles.button} disabled={!userId}>
                    Send
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        width: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "black",
        color: "white",
    },
    chatBox: {
        height: "300px",
        overflowY: "auto",
        marginBottom: "10px",
        padding: "10px",
        backgroundColor: "#111",
        border: "1px solid #ddd",
        borderRadius: "4px",
    },
    userMessage: {
        textAlign: "right",
        backgroundColor: "grey",
        padding: "8px",
        borderRadius: "10px",
        marginBottom: "5px",
        display: "inline-block",
        maxWidth: "80%",
        color: "white",
    },
    assistantMessage: {
        textAlign: "left",
        backgroundColor: "#00f",
        padding: "8px",
        borderRadius: "10px",
        marginBottom: "5px",
        display: "inline-block",
        maxWidth: "80%",
        color: "white",
    },
    inputArea: {
        display: "flex",
    },
    input: {
        flex: 1,
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px 0 0 4px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "0 4px 4px 0",
        cursor: "pointer",
    },
    loading: {
        textAlign: "center",
        color: "#aaa",
    },
    error: {
        color: "red",
        marginBottom: "10px",
        textAlign: "center",
    },
};

export default Support;
