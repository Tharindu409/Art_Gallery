const Admin = require("../models/Admin");

// Register Admin
exports.register = async (req, res) => {
  const { name, gmail, password } = req.body;

  // Validate required fields
  if (!name || !gmail || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  // Simple email check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(gmail)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ gmail });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists." });
    }

    // Save admin
    const newAdmin = new Admin({ name, gmail, password });
    const savedAdmin = await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", admin: savedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during admin registration." });
  }
};

exports.login = async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ gmail });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res.status(200).json({ message: "Admin login successful", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during admin login." });
  }
};
