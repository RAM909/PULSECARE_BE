const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const Connection = require("./connection");
const user = require("./routes/user");
const middleware = require("./middleware/middleware");

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// PORT
const PORT = process.env.PORT || 3000; // Adding a default port for safety

// Connecting to database
Connection();

// Route definition
app.use("/api/user/", user);
app.use(middleware);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
