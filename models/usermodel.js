const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    otp: {
        type: Number
    },
    role: {
        type: String,
        enum: ["user", "admin", "doctor"],
        default: "user",
        required: true
    },
    specialization: {
        type: String,
        // required: function() {
        //     return this.role === 'doctor';
        // }
    },
    experience: {
        type: Number,
        // required: function() {
        //     return this.role === 'doctor';
        // }
    },
    hospital: {
        type: String,
        // required: function() {
        //     return this.role === 'doctor';
        // }
    },
    availableDay: {
        type: [String],
        // required: function() {
        //     return this.role === 'doctor';
        // }
    },
    certificate: {
        type: String,
        // required: function() {
        //     return this.role === 'doctor';
        // }
    }
},
{ timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = { User };
