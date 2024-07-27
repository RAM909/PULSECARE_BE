const express = require('express');
const router = express.Router();
const { doctorReq } = require('../models/doctorreq');
const { User } = require('../models/usermodel');
const { Appointmentreq } = require('../models/appointmentreq');
const app = express();

router.post("/book-appointment", async (req, res) => {
  try {
    const { info } = req.body;
    console.log(info);

    const newreq = new Appointmentreq({
      doctorId: info.doctorId,
      patientId: info.patientId,
      date: info.date,
      time: info.time,
      patientName: info.name,
      description: info.problem,
      phoneno: info.phone,
      patientemail: info.email,
      doctoremail: info.doctoremail,
      doctorname: info.doctorname,
      doctorphoto: info.doctorphoto,
      patientphoto: info.patientphoto
    });

    await newreq.save();

    res.status(200).json({ message: "Appointment request successfully send" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});

router.get("/get-appointment-req-doctor", async (req, res) => {
  try {
    const { id } = req.query;
    console.log("id", id);
    const data = await Appointmentreq.find({ doctorId: id });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching appointment requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-appointment-req-patient", async (req, res) => {
  try {
    const { id } = req.query;
    console.log("id", id);
    const data = await Appointmentreq.find({
      patientId: id,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching appointment requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);

router.post("/update-appointment", async (req, res) => {
  try {
    const { id, status } = req.body;
    console.log(id, status);
    const data = await appointmentreq.findByIdAndUpdate(id, { status });
    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/approve-appointment", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const data = await Appointmentreq.findByIdAndUpdate(id, { status: "accepted" });
    res.status(200).json({ message: "Appointment approved successfully" });
  } catch (error) {
    console.error("Error approving appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);

router.post("/cancel-appointment-patient", async (req, res) => {
  try {
    const { id, cancelreason } = req.body;
    console.log(id);
    const data = await Appointmentreq.findByIdAndUpdate
      (id, { status: "cancelled", cancelledBy: "patient", cancelreason: cancelreason });
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);

router.post("/cancel-appointment-doctor", async (req, res) => {
  try {
    const { id, cancelreason } = req.body;
    console.log(id);
    const data = await Appointmentreq.findByIdAndUpdate
      (id, { status: "cancelled", cancelledBy: "doctor", cancelreason: cancelreason });
    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);

module.exports = router;
