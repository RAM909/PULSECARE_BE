const express = require('express');
const router = express.Router();
const { doctorReq } = require('../models/doctorreq');
const { User } = require('../models/usermodel');
const {appointmentreq} = require('../models/appointmentreq');
const app = express();

router.post("/book-appointment", async (req, res) => {
    try {
      const { info } = req.body;
      console.log(info);
  
      const newreq = new appointmentreq({
        doctorId: info.doctorId,
        patientId: info.patientId,
        date: info.date,
        time: info.time,
        description: info.problem,
        phoneno: info.phoneno,
        patientemail: info.patientemail,
        doctoremail: info.doctoremail
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
      console.log("id",id);
      const data = await appointmentreq.find({ doctorId: id });
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching appointment requests:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/get-appointment-req-patient", async (req, res) => {
    try {
      const { id } = req.query;
      console.log("id",id);
      const data = await appointmentreq.find({
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

module.exports = router;
