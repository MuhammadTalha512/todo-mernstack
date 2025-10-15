const express = require("express");
const { signUp, signIn, profile, logout } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn,)
router.post("/profile", authMiddleware, profile)
router.post("/logout", logout)

module.exports = router;
