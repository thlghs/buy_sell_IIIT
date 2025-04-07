const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
