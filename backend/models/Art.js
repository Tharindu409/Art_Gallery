const mongoose = require("mongoose");

const artSchema = new mongoose.Schema({
  artCode: { type: String, required: true, unique: true }, // Unique art identifier
  title: { type: String }, // Artwork title
  artist: { type: String }, // Artist name
  medium: { type: String }, // Medium used
  dimensions: { type: String }, // Size in custom format (e.g., 24x36 inches)
  size: { type: String }, // Optional if you want a separate size field
  price: { type: Number }, // Price of artwork
  category: { type: String }, // e.g., Painting, Sculpture
  collections: [String], // Collections or series
  status: {
    type: String,
    enum: ["Direct Sale", "Bid", "Not Listed"],
    default: "Not Listed",
  },
  year: { type: Date }, // Year artwork created
  date: { type: Date, default: Date.now }, // Date added to DB
  image: { type: String }, // URL of image
  description: { type: String }, // Artwork description
  bidEndDate: { type: Date }, // Bidding deadline
  bidEndTime: { type: String }, // Bidding time
});

module.exports = mongoose.model("Art", artSchema);
