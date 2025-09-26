const express = require("express");
const router = express.Router();
const Art = require("../models/Art");

// Test route
router.get("/test", (req, res) => res.send("Art routes working"));

// POST: Add new artwork
router.post("/", (req, res) => {
  Art.create(req.body)
    .then(() => res.json({ msg: "Art added successfully" }))
    .catch(() => res.status(400).json({ msg: "Failed to add art" }));
});

// GET: All artworks
router.get("/", (req, res) => {
  Art.find()
    .then((arts) => res.json(arts))
    .catch(() => res.status(400).json({ msg: "No art found" }));
});

// GET: Single artwork by ID
router.get("/:id", (req, res) => {
  Art.findById(req.params.id)
    .then((art) => res.json(art))
    .catch(() => res.status(400).json({ msg: "Cannot find this art" }));
});

// PUT: Update artwork
router.put("/:id", (req, res) => {
  Art.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(() => res.json({ msg: "Update successful" }))
    .catch(() => res.status(400).json({ msg: "Update failed" }));
});

// DELETE: Remove artwork
router.delete("/:id", (req, res) => {
  Art.findByIdAndDelete(req.params.id)
    .then(() => res.json({ msg: "Deleted successfully" }))
    .catch(() => res.status(400).json({ msg: "Delete failed" }));
});

module.exports = router;
