const mongoose = require("mongoose"); 


const orderSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", 
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min:0,
    },
    otp: {
        type: String,
        required: true,
    },
    plainOtp: {
        type: String, 
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
    },
});

module.exports = mongoose.model("Order", orderSchema); 
