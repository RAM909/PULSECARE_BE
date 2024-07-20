const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    payment:{
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
    prescription: {
        type: String
    }
},
    { timstamp: true });