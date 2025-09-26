const BiddingSession = require("../models/BiddingSession");
const Art = require("../models/Art");

exports.getSessions = async (req, res) => {
  const sessions = await BiddingSession.find().populate("art");
  res.json(sessions);
};

exports.getBids = async (req, res) => {
  const session = await BiddingSession.findById(req.params.id);
  res.json(session ? session.bids : []);
};

exports.createSession = async (req, res) => {
  const { artId, startingPrice, bidEndDate, bidEndTime } = req.body;
  const session = await BiddingSession.create({
    art: artId,
    startingPrice,
    bidEndDate,
    bidEndTime,
  });
  res.json(session);
};

exports.updateSession = async (req, res) => {
  const session = await BiddingSession.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(session);
};

exports.cancelSession = async (req, res) => {
  const session = await BiddingSession.findByIdAndUpdate(
    req.params.id,
    { status: "Cancelled" },
    { new: true }
  );
  // Also update art status
  await Art.findByIdAndUpdate(session.art, { status: "Not Listed" });
  res.json(session);
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await BiddingSession.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    // Optionally, update the art status if needed
    await Art.findByIdAndUpdate(session.art, { status: "Not Listed" });

    res.json({ msg: "Bidding session deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
