const express = require("express");
const router = express.Router();
const {
  getSessions,
  getBids,
  createSession,
  updateSession,
  cancelSession,
  deleteSession,
} = require("../controllers/biddingController");

// 🔥 Import your model here
const BiddingSession = require("../models/BiddingSession");

// Existing routes
router.get("/", getSessions);
router.get("/:id/bids", getBids);
router.post("/", createSession);
router.put("/:id", updateSession);
router.put("/:id/cancel", cancelSession);
router.delete("/:id", deleteSession);

// 🆕 Add a bid to a bidding session
router.post("/:id/bids", async (req, res) => {
  try {
    const session = await BiddingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    session.bids.push(req.body); // req.body should include { name, offerPrice, contact, note }
    await session.save();

    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
