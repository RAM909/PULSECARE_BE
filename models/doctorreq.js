const mongoose = require("mongoose");

const doctorReqSchema = new mongoose.Schema({
    userID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    availableDays: {
        type: [String],
        required: true
    },
    certificate: {
        type: String,
        // required: true
    },
    hospital: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    }
},
    { timstamp: true });
    
const doctorReq = mongoose.model("doctorReq", doctorReqSchema);

module.exports = {doctorReq};