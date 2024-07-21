const express = require('express');
const router = express.Router();
const { doctorReq } = require('../models/doctorreq');
const { User } = require('../models/usermodel');
const app = express();

router.post("/apply-doctor", async (req, res) => {
  try {
    const { info } = req.body;
    const certificateFile = req.files?.certificate;
    console.log(info);

    //   if (!certificateFile) {
    //     return res.status(400).json({ message: "Certificate file is required" });
    //   }

    //   // Upload certificate to Cloudinary
    //   const certificateUploadResult = await uploadImageToCloudinary(certificateFile.data, "certificates");

    // Find the existing user and update the role and doctor's fields
    console.log(info.userID)
    const user = await User.findById(info.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingreq = await doctorReq.findOne({ userID: info.userID });
    if (existingreq) {
      return res.status(400).json({ message: "Application already submitted" });
    }

    const newreq = new doctorReq({
      specialization: info.specialization,
      hospital: info.hospital,
      availableDays: info.availableDays,
      // certificate: info.certificate,
      userID: info.userID,
    });

    //   user.role = "doctor";
    //   user.specialization = info.specialization;
    //   user.hospital = info.hospital;
    //   user.availableDay = info.availableDay;
    //   user.certificate = certificateUploadResult.secure_url;

    // Save the updated user to the database
    await newreq.save();

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error applying for doctor:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});

router.get("/get-doctor-req", async (req, res) => {
  try {
    const { id } = req.query;
    console.log("id", id);
    const doctorReqData = await doctorReq.findOne({ userID: id });

    if (!doctorReqData) {
      return res.status(404).json({ message: "Doctor request not found" });
    }
    res.status(200).json({ doctorReqData });
  } catch (error) {
    console.error("Error getting doctor request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);

router.get("/get-doctorbyid", async (req, res) => {

  try {
    const { id } = req.query;
    console.log("id", id);
    const doctordata = await User.findOne({ _id: id });
    console.log(doctordata);
    res.status(200).json({ doctordata });
  } catch (error) {
    console.error("Error getting doctor request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
);

router.get("/get-all-doctor", async (req, res) => {
  try {
    // Correct query syntax for finding doctors
    const data = await User.find({ role: "doctor" });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;