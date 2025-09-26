const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  name: String,
  offerPrice: Number,
  contact: String,
  note: String,
  bidTime: { type: Date, default: Date.now },
});

const biddingSessionSchema = new mongoose.Schema({
  art: { type: mongoose.Schema.Types.ObjectId, ref: "Art", required: true },
  startingPrice: Number,
  bids: [bidSchema],
  bidEndDate: Date,
  bidEndTime: String,
  status: {
    type: String,
    enum: ["Open", "Closed", "Completed", "Cancelled"],
    default: "Open",
  },
});

module.exports = mongoose.model("BiddingSession", biddingSessionSchema);
