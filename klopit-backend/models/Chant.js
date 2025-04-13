const mongoose = require("mongoose");

const chantSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lyrics: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

console.log("Chant model loaded");
module.exports = mongoose.model("Chant", chantSchema);