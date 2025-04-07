const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@(iiit\.ac\.in|students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/, 
    },
    password: { type: String, required: true },
    age: { type: Number, required: true, min:0},
    contactNumber: { 
        type: Number, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);  
            },
            message: props => `${props.value} is not a valid 10-digit contact number!`
        }
    },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    reviews: [{ type: String }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
