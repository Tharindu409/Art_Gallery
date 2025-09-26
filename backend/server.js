const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // For environment variables

// Import Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const artGalleryRoutes = require("./routes/artgalleryRoutes");
const exhibitionRoutes = require("./routes/exhibitionRoutes");
const biddingRoutes = require("./routes/biddingRoutes");
const orderRoutes = require("./routes/orderRoutes"); // Added for orders

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Handle large payloads (images, receipts)
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/arts", artGalleryRoutes);
app.use("/api/exhibitions", exhibitionRoutes);
app.use("/api/bidding", biddingRoutes);
app.use("/api/orders", orderRoutes); // Orders route

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://visurawathsala1_db_user:sjRvVFHuhvbKPyrD@ceylongalleria.bp7t3qj.mongodb.net/?retryWrites=true&w=majority&appName=CeylonGalleria";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// Serve static files if needed (for production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
