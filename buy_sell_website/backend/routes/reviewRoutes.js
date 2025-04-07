const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/auth");


router.post("/add", auth, async (req, res) => {
    try {
        const { seller, order, rating, description } = req.body;

        const newReview = new Review({
            buyer: req.user.id,
            seller,
            order,
            rating,
            description
        });

        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/seller/:sellerId", auth, async (req, res) => {
    try {
        const reviews = await Review.find({ seller: req.params.sellerId })
            .populate("buyer", "firstName lastName email");

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
