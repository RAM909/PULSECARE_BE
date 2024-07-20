const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { User } = require("../models/usermodel");
const { OTP } = require("../models/otpmodel"); // Import the OTP model
const router = express.Router();
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

dotenv.config();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

const sendOTP = async (email, generatedOTP) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "OTP for Verification",
            text: `Here is Your OTP for Verifying your Email: ${generatedOTP}`,
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

router.post("/register", async (req, res) => {
    try {
        const { password, email, firstname, lastname } = req.body;

        if (!password || !email || !firstname || !lastname) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otp = generateOTP();
        const otpSent = await sendOTP(email, otp);

        if (!otpSent) {
            return res.status(500).json({ message: "Failed to send OTP Try again" });
        }

        // Store the OTP in the OTP collection
        await OTP.findOneAndUpdate(
            { email },
            { otp, otpExpires: Date.now() + 300000 }, // 5 minutes expiration
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "OTP sent for email verification" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/verify", async (req, res) => {
    try {
        const { email, enteredOTP, password, firstname, lastname } = req.body;
        console.log(req.body);
        console.log(email);

        const otpRecord = await OTP.findOne({ email });
        console.log(otpRecord);
        console.log(enteredOTP);
        console.log(otpRecord.otp);

        if (!otpRecord) {
            return res.status(400).json({ message: "session expired try gaian" });
        }
        if (otpRecord.otp != enteredOTP) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (otpRecord.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            firstname,
            lastname
        });

        await newUser.save();

        // Delete OTP record after successful verification
        await OTP.deleteOne({ email });

        res.status(200).json({ message: "User verified and registered successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/googlelogin', async (req, res) => {
    try {
        const { tokenId } = req.body;
        console.log("Received tokenId:", tokenId);

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        console.log("Ticket:", ticket);

        const payload = ticket.getPayload();
        console.log(payload)
        const email1 = payload.email;
        const name = payload.name;
        const email_verified = payload.email_verified;

        console.log("Payload:", payload);

        if (email_verified && email1) {
            console.log("Email verified:", email_verified, "Email:", email1);

            const user = await User.findOne({ email: email1 });
            console.log("User found in DB:", user);

            if (user) {
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                console.log("token generated:", token);
                const { _id = _id, email = email1, firstname = firstname, lastname = lastname } = user;
                return res.status(200).json({ token, user: { _id, email, firstname, lastname }, message: "Login Successfull" });

            } else {
                console.log("payload", payload)
                console.log("email", email1)
                console.log("User not found, creating new user");
                const password = email1 + process.env.JWT_SECRET;
                const nameParts = name.split(" ");
                const newUser = new User({
                    email: email1,
                    password,
                    firstname: nameParts[0],
                    lastname: nameParts.slice(1).join(" ")
                });

                await newUser.save();
                console.log("New user created:", newUser);

                const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
                console.log("token generated:", token);
                const { _id, email, firstname, lastname } = newUser;
                return res.status(200).json({ token, user: { _id, email, firstname, lastname }, message: "Login Successfull" });
            }
        } else {
            console.log("Email not verified or email not provided");
            return res.status(400).json({ message: "Google login failed" });
        }
    } catch (error) {
        console.error("Error logging in user with Google:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        console.log("token generated:", token);
        res.status(200).json({ token, user: { _id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, role:user.role } });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
