const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },
  starttime: {
    type: String, // Use String for time (e.g. "14:30")
    required: true,
  },
  endtime: {
    type: String, // Use String for time (e.g. "16:00")
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  image: { type: String }, // URL of image
  status: {
    type: String,
    enum: ["upcoming", "ended", "showing"],
    required: true,
  },
});

module.exports = mongoose.model("ExhibitionModel", userSchema);
