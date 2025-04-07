const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const emailRegex = /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/;


router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, contactNumber } = req.body;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email must be an IIIT address (iiit.ac.in, students.iiit.ac.in, or research.iiit.ac.in)" });
        }

       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            contactNumber,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email must be an IIIT address (iiit.ac.in, students.iiit.ac.in, or research.iiit.ac.in)" });
        }

       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

     
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
