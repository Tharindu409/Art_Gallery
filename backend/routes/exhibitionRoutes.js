const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit"); // 📌 For PDF generation

const Exhibition = require("../models/Exhibition");
const UserController = require("../controllers/exhibitionController");

// 📌 New Route: Download ALL exhibitions as PDF (must be BEFORE :id)
router.get("/all/download/pdf", async (req, res) => {
  try {
    const exhibitions = await Exhibition.find();

    if (!exhibitions || exhibitions.length === 0) {
      return res.status(404).json({ message: "No exhibitions found" });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    const filename = "exhibitions.pdf";

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("📋 Exhibitions Report", { align: "center" });
    doc.moveDown();

    exhibitions.forEach((exhibition, index) => {
      doc.fontSize(14).text(`Exhibition #${index + 1}`, { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12).text(`ID: ${exhibition._id}`);
      doc.text(`Title: ${exhibition.title || "N/A"}`);
      doc.text(`Description: ${exhibition.description || "N/A"}`);
      doc.text(`Start Date: ${exhibition.startdate || "N/A"}`);
      doc.text(`End Date: ${exhibition.enddate || "N/A"}`);
      doc.text(`Venue: ${exhibition.venue || "N/A"}`);
      doc.text(`Status: ${exhibition.status || "N/A"}`);

      doc.moveDown();
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    res.status(500).json({ message: "Error generating PDF" });
  }
});

// Existing routes
router.get("/", UserController.getAllExhibitions);
router.post("/", UserController.addExhibition);
router.get("/:id", UserController.getbyId);
router.put("/:id", UserController.updateExhibition);
router.delete("/:id", UserController.deleteExhibition);

module.exports = router;
