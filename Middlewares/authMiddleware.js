const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                message: "Unauthorised user!"
            })
        }

        const verifiedToken = await jwt.verify(token, process.env.SECRET_KEY);

        if (!verifiedToken) {
            return res.status(401).json({
                message: "Invalid token!"
            })
        }

        req.body.userId = verifiedToken.userId;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token!",
            erroeMessage: error
        });
    }
}

module.exports = verifyToken;