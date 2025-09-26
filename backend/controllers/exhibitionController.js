const Exhibition = require("../models/Exhibition");

// Get all exhibitions
const getAllExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find();
    if (!exhibitions || exhibitions.length === 0) {
      return res.status(404).json({ message: "No exhibitions found" });
    }
    return res.status(200).json({ exhibitions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching exhibitions" });
  }
};

// Add a new exhibition
const addExhibition = async (req, res) => {
  const {
    title,
    description,
    startdate,
    enddate,
    starttime,
    endtime,
    venue,
    status,
  } = req.body;
  try {
    const exhibition = new Exhibition({
      title,
      description,
      startdate,
      enddate,
      starttime,
      endtime,
      venue,
      status,
      image: req.body.image || "", // default empty string if not provided
    });

    await exhibition.save();
    return res.status(201).json({ exhibition });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Unable to add exhibition", error: err.message });
  }
};

// Get by ID
const getbyId = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }
    return res.status(200).json({ exhibition });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching exhibition" });
  }
};

// Update exhibition
const updateExhibition = async (req, res) => {
  try {
    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedExhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }
    return res.status(200).json({ exhibition: updatedExhibition });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating exhibition" });
  }
};

// Delete exhibition
const deleteExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findByIdAndDelete(req.params.id);
    if (!exhibition) {
      return res.status(404).json({ message: "Exhibition not found" });
    }
    return res.status(200).json({ message: "Exhibition deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting exhibition" });
  }
};

module.exports = {
  addExhibition,
  getAllExhibitions,
  getbyId,
  updateExhibition,
  deleteExhibition,
};
