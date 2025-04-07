const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");  
const chatRoutes = require("./routes/chatRoutes");
const casRoutes = require("./routes/casRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.options("*", cors()); 
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log("Request Body:", req.body);
    }
    console.log("Request Headers:", req.headers);
    next();
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});


const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cartRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const casRoutes = require("./routes/casRoutes");

app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/support", chatRoutes);
app.use("/api/cas", casRoutes);
app.use("/api/reviews", reviewRoutes);


app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Something went wrong!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
