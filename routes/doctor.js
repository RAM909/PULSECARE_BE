const express = require('express');
const router = express.Router();
const { doctorReq } = require('../models/doctorreq');
const { User } = require('../models/usermodel');
const app = express();
const cloudinary = require("cloudinary").v2;

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

router.post("/apply-doctor", async (req, res) => {
  try {
    const { userID, name, specialization, hospital, availableDays } = req.body;
    console.log(name, specialization, hospital, availableDays);
    const certificateFile = req.files?.certificate;
    console.log(certificateFile);

    //   if (!certificateFile) {
    //     return res.status(400).json({ message: "Certificate file is required" });
    //   }

    // Upload certificate to Cloudinary
    // const certificateUploadResult = await uploadImageToCloudinary(certificateFile.data, "certificates");
    const certificateUploadResult = await cloudinary.uploader.upload(certificateFile.tempFilePath);

    console.log(certificateUploadResult);

    // Find the existing user and update the role and doctor's fields
    console.log(userID)
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingreq = await doctorReq.findOne({ userID: userID });
    if (existingreq) {
      return res.status(400).json({ message: "Application already submitted" });
    }

    const newreq = new doctorReq({
      specialization: specialization,
      hospital: hospital,
      availableDays: availableDays,
      certificate: certificateUploadResult.secure_url,
      userID: userID,
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