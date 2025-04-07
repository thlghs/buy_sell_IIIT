const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const auth = require("../middleware/auth");


router.get("/", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items");
        if (!cart) return res.status(200).json([]); // Empty cart
        res.status(200).json(cart.items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/", auth, async (req, res) => {
    const { itemId } = req.body;

    try {
       
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        cart.items.push(itemId);
        await cart.save();

        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.delete("/:itemId", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

       
        cart.items = cart.items.filter((item) => item.toString() !== req.params.itemId);
        await cart.save();

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
