const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const Connection = require("./connection");
const user = require("./routes/user");
const middleware = require("./middleware/middleware");
const { cloudnairyconnect } = require("./config/cloudinary");
const doctorReq = require("./routes/doctor");
const appointment = require("./routes/appointment");
const fileUpload = require('express-fileupload');
const { file } = require("tmp");


dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
// app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }))

// PORT
const PORT = process.env.PORT; // Adding a default port for safety

// Connecting to database
Connection();
cloudnairyconnect();

// Route definition
app.use("/api/user/", user);
app.use(middleware);
app.use("/api/doctor/", doctorReq);
app.use("/api/appointment/", appointment);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
