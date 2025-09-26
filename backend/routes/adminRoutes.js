const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Admin Registration
router.post("/admin-register", adminController.register);

// Admin Login
router.post("/admin-login", adminController.login);

module.exports = router;
