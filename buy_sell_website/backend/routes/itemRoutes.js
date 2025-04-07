const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");



router.post("/add", auth, async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newItem = new Item({
            name,
            price,
            description,
            category,
            seller: req.user.id,  
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/", auth, async (req, res) => {
    try {
        const { category, search } = req.query;
        const userId = req.user.id; 
        const query = { seller: { $ne: userId } }; 

        
        if (category) {
            query.category = { $in: category.split(",") }; 
        }

       
        if (search) {
            query.name = { $regex: search, $options: "i" }; 
        }

        
        const items = await Item.find(query).populate("seller", "firstName lastName email");
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/category/:category", async (req, res) => {
    try {
        const items = await Item.find({ category: req.params.category }).populate("seller", "firstName lastName email");
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate("seller", "firstName lastName email");
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
