const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const artGalleryRoutes = require("./routes/artgalleryRoutes");
const exhibitionRoutes = require("./routes/exhibitionRoutes");
const biddingRoutes = require("./routes/biddingRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Artora API is running successfully"
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/arts", artGalleryRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/bidding", biddingRoutes);
app.use("/api/orders", orderRoutes);

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });