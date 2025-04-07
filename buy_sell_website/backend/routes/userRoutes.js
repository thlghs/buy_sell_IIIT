const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require('../middleware/auth');
const bcrypt = require("bcryptjs");
const axios = require("axios");

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;


const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        console.log("reCAPTCHA Response:", response.data); 
        return response.data.success;
    } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        return false;
    }
};


const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, contactNumber, recaptchaToken } = req.body;

      
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ message: "reCAPTCHA verification failed. Please try again." });
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
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.age = req.body.age || user.age;
        user.contactNumber = req.body.contactNumber || user.contactNumber;

       
        if (req.body.newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.newPassword, salt);
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ error: error.message });
    }
});


router.post("/register", registerUser);
router.get("/:id", getUserById);

module.exports = router;
