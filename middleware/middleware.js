const jwt = require("jsonwebtoken");


const middleware = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        console.log("here")
        return res.status(401).send('Access Denied');
    }
    try {
        console.log("token received",token);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Pass control to the next middleware function
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = middleware;