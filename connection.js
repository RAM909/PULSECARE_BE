const mongoose = require("mongoose");


const Connection = async () => {
    // const URL = `mongodb://127.0.0.1:27017/materialbuy`;
    const URL = process.env.STAGING_DB_URL;
    try {
        await mongoose.connect(URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
    }
};

module.exports = Connection;
