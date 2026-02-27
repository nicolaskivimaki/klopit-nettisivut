// models/Image.js
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  // The URL path where the image is publicly accessible.
  url: { type: String, required: true },
  cloudinaryPublicId: { type: String },
  caption: { type: String },
  // A reference to the album it belongs to.
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);
