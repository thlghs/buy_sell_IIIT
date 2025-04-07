const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


router.post("/place", auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        const orders = await Promise.all(
            cart.items.map(async (item) => {
                const otp = crypto.randomBytes(3).toString("hex");
                const hashedOtp = await bcrypt.hash(otp, 10);

                const order = new Order({
                    transactionId: crypto.randomUUID(),
                    buyer: req.user.id,
                    seller: item.seller,
                    item: item._id,
                    amount: item.price,
                    otp: hashedOtp,
                    plainOtp: otp, 
                    status: "pending",
                });

                await order.save();
                return order;
            })
        );

        cart.items = [];
        await cart.save();

        res.status(201).json({ success: true, orders });
    } catch (error) {
        console.error("Error in /orders/place:", error.message);
        res.status(500).json({ error: error.message });
    }
});


router.put("/regenerate-otp/:id", auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.buyer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        const newOtp = crypto.randomBytes(3).toString("hex");
        const hashedOtp = await bcrypt.hash(newOtp, 10);

        order.otp = hashedOtp;
        order.plainOtp = newOtp; 
        await order.save();

        res.status(200).json({ message: "OTP regenerated successfully", plainOtp: newOtp });
    } catch (error) {
        console.error("Error regenerating OTP:", error.message);
        res.status(500).json({ error: error.message });
    }
});




router.get("/buyer", auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id }).populate("item").populate("seller", "firstName lastName email");

        orders.forEach(async (order) => {
            order.plainOtp = null; 
            await order.save();
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/seller", auth, async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user.id}).populate("item").populate("buyer", "firstName lastName email");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("buyer", "firstName lastName email")
            .populate("seller", "firstName lastName email")
            .populate("item", "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/user", auth, async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id })
            .populate("item", "name price category")
            .populate("seller", "firstName lastName email");

        const groupedOrders = {
            pending: orders.filter((order) => order.status === "pending").map((order) => ({
                _id: order._id,
                item: order.item,
                seller: order.seller,
                amount: order.amount,
                otp: order.otp,
                status: order.status,
            })),
            completed: orders.filter((order) => order.status === "completed").map((order) => ({
                _id: order._id,
                item: order.item,
                seller: order.seller,
                amount: order.amount,
                status: order.status,
            })),
        };

        res.status(200).json(groupedOrders);
    } catch (error) {
        console.error("Error fetching user orders:", error.message);
        res.status(500).json({ error: error.message });
    }
});


router.put("/complete/:id", auth, async (req, res) => {
    try {
      const { otp } = req.body;
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        console.log("Order not found");
        return res.status(404).json({ message: "Order not found" });
      }
  
      if (order.seller.toString() !== req.user.id) {
        console.log("Unauthorized access");
        console.log("Order seller:", order.seller);
        console.log("Current user:", req.user.id);
        return res.status(403).json({ message: "Unauthorized or order not found" });
      }
  
      const isOtpValid = await bcrypt.compare(otp, order.otp);
      if (!isOtpValid) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      order.status = "completed";
      await order.save();
  
      res.status(200).json({ message: "Order completed successfully" });
    } catch (error) {
      console.error("Error in completing order:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  
  

module.exports = router;

