// models/Album.js
const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  // This key allows for nesting. A top-level "catalog" will have parent: null.
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', AlbumSchema);