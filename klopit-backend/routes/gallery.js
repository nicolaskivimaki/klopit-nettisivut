// routes/gallery.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // File System module for deleting files
const Album = require("../models/Album");
const Image = require("../models/Image");
const { authenticateToken, authorizeAdmin } = require("../routes/auth");

// === Multer Configuration for Image Uploads ===
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).array("images", 10); // 'images' is the field name, limit to 10 files per upload

// =============================================
//               ALBUM ROUTES
// =============================================

// GET all albums (can filter by parent)
// Public route: e.g., /api/gallery/albums?parent=null for top-level
router.get("/albums", async (req, res) => {
  try {
    const parentId = req.query.parent === "null" ? null : req.query.parent;
    const albums = await Album.find({ parent: parentId }).sort({ title: 1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching albums." });
  }
});

// GET a single album and its content (sub-albums and images)
router.get("/albums/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: "Album not found" });

    const subAlbums = await Album.find({ parent: req.params.id });
    const images = await Image.find({ album: req.params.id });

    res.json({ album, subAlbums, images });
  } catch (err) {
     res.status(500).json({ message: "Server error fetching album content." });
  }
});

// POST a new album
// Admin-only
router.post("/albums", authenticateToken, authorizeAdmin, async (req, res) => {
  const { title, description, parent } = req.body;
  const newAlbum = new Album({
    title,
    description,
    parent: parent || null,
  });
  try {
    const savedAlbum = await newAlbum.save();
    res.status(201).json(savedAlbum);
  } catch (err) {
    res.status(400).json({ message: "Failed to create album." });
  }
});

// DELETE an album
// Admin-only
router.delete("/albums/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Note: Add logic here to delete sub-albums and images if necessary
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
    if (!deletedAlbum) return res.status(404).json({ message: "Album not found" });
    res.json({ message: "Album deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting album." });
  }
});


// =============================================
//               IMAGE ROUTES
// =============================================

// POST to upload images to a specific album
// Admin-only
router.post("/images/upload/:albumId", authenticateToken, authorizeAdmin, (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload error", error: err });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      try {
        const albumId = req.params.albumId;
        const imageDocs = req.files.map(file => ({
            url: `/uploads/${file.filename}`, // The public URL path
            album: albumId,
            caption: req.body.caption || ''
        }));
        
        const savedImages = await Image.insertMany(imageDocs);
        res.status(201).json({ message: "Images uploaded successfully", images: savedImages });
      } catch (error) {
        res.status(500).json({ message: "Database error saving images." });
      }
    });
  }
);

// DELETE an image
// Admin-only
router.delete("/images/:id", authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found." });
        }

        // 1. Delete file from the server's filesystem
        const filePath = path.join(__dirname, '..', image.url); // Adjust path to be relative to project root
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                // Don't stop; still try to delete the database record
            }

            // 2. Delete the record from MongoDB
            await Image.findByIdAndDelete(req.params.id);
            res.json({ message: "Image deleted successfully." });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting image." });
    }
});


module.exports = router;