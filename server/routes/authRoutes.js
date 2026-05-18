const express = require("express");
const { registerUser, loginUser, getUserInfo } = require("../controlllers/authController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

// router.get("/getUser", protect, getUserInfo);
module.exports = router;