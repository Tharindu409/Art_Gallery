const User = require("../models/User");

// Register
exports.register = async (req, res) => {
  const { name, gmail, password, phone, country, role, profileImage } =
    req.body;

  if (!name || !gmail || !password || !phone || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!gmailRegex.test(gmail))
    return res.status(400).json({ error: "Invalid email format" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone))
    return res.status(400).json({ error: "Invalid phone number" });

  try {
    const newUser = new User({
      name,
      gmail,
      password,
      phone,
      country,
      role: role || "user", // Default to user
      profileImage: profileImage || "",
    });

    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login
exports.login = async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password)
    return res.status(400).json({ error: "Email and password are required." });

  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });

  try {
    const user = await User.findOne({ gmail });
    if (!user || user.password !== password)
      return res.status(400).json({ error: "Invalid email or password." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error during login." });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Admin update failed" });
  }
};
exports.deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Admin delete failed" });
  }
};
