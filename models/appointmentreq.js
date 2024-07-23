const mongoose = require("mongoose");

const appointmentreqSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    patientName:{
        type : String,
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
        enum: ["pending", "accepted", "completed", "cancelled"],
        default: "pending"
    },
    payment: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
    cancelreason: {
        type: String
    },
    cancelledBy: {
        type: String,
        enum: ["doctor", "patient"]
    },
    description: {
        type: String
    },
    phoneno: {
        type: Number
    },
    doctorname: {
        type: String
    },  
    patientemail: {
        type: String
    },
    doctoremail: {
        type: String
    },
    prescription: {
        type: String
    }
},
    { timstamp: true });

const Appointmentreq = mongoose.model("appointmentreq", appointmentreqSchema);
module.exports = { Appointmentreq };