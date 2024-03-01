const express = require("express");
const router = express.Router();
const { userRegister, userLogin, updateUser } = require("../Controllers/authController");
const verifyToken = require("../Middlewares/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/update", verifyToken, updateUser);

module.exports = router;