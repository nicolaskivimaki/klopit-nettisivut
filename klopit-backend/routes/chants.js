const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticateToken, authorizeAdmin } = require("../routes/auth");

// Import and verify the Chant model
let Chant = require("../models/Chant");
console.log("Chant initially imported:", typeof Chant, Chant);

// Ensure the model is valid; re-register if necessary
if (!Chant || typeof Chant.find !== "function") {
  console.warn("Chant is not a valid Mongoose model, re-registering...");
  const chantSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lyrics: { type: String, required: true },
    author: { type: String },
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
  Chant = mongoose.model("Chant", chantSchema);
  console.log("Chant model re-registered with Mongoose:", typeof Chant, Chant);
}

// Get all chants (Public Access)
router.get("/", async (req, res) => {
  try {
    console.log("Attempting to fetch chants with Chant:", typeof Chant.find);
    const chants = await Chant.find().sort({ createdAt: -1 });
    res.status(200).json(chants);
  } catch (error) {
    console.error("Error fetching chants:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single chant by ID (Public Access)
router.get("/:id", async (req, res) => {
  try {
    const chant = await Chant.findById(req.params.id);
    if (!chant) {
      return res.status(404).json({ message: "Chant not found" });
    }
    res.status(200).json(chant);
  } catch (error) {
    console.error("Error fetching chant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new chant (Admin Only)
router.post("/", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, lyrics, author, category } = req.body;
    const newChant = new Chant({ title, lyrics, author, category });
    await newChant.save();
    res.status(201).json(newChant);
  } catch (error) {
    console.error("Error creating chant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a chant (Admin Only)
router.put("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, lyrics, author, category } = req.body;
    const chant = await Chant.findByIdAndUpdate(
      req.params.id,
      { title, lyrics, author, category },
      { new: true }
    );
    if (!chant) {
      return res.status(404).json({ message: "Chant not found" });
    }
    res.status(200).json(chant);
  } catch (error) {
    console.error("Error updating chant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a chant (Admin Only)
router.delete("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const chant = await Chant.findByIdAndDelete(req.params.id);
    if (!chant) {
      return res.status(404).json({ message: "Chant not found" });
    }
    res.status(200).json({ message: "Chant deleted" });
  } catch (error) {
    console.error("Error deleting chant:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;