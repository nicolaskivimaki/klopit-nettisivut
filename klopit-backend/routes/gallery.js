// routes/gallery.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Readable } = require("stream");
const { v2: cloudinary } = require("cloudinary");

const Album = require("../models/Album");
const Image = require("../models/Image");
const { authenticateToken, authorizeAdmin } = require("../routes/auth");

const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || "klopit-gallery";
const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
const hasCloudinaryConfig =
  hasCloudinaryUrl ||
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  if (hasCloudinaryUrl) {
    cloudinary.config(process.env.CLOUDINARY_URL);
    cloudinary.config({ secure: true });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error("Only JPEG, PNG and WEBP images are allowed."));
      return;
    }
    cb(null, true);
  },
}).array("images", 10);

const uploadBufferToCloudinary = (file, albumId) =>
  new Promise((resolve, reject) => {
    const folder = `${cloudinaryFolder}/${albumId}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

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
      return res.status(400).json({ message: "File upload error", error: err.message || err });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    if (!hasCloudinaryConfig) {
      return res.status(500).json({
        message: "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.",
      });
    }

    try {
      const albumId = req.params.albumId;
      const uploadResults = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file, albumId))
      );

      const imageDocs = uploadResults.map((result) => ({
        url: result.secure_url,
        cloudinaryPublicId: result.public_id,
        album: albumId,
        caption: req.body.caption || "",
      }));

      const savedImages = await Image.insertMany(imageDocs);
      res.status(201).json({ message: "Images uploaded successfully", images: savedImages });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ message: "Image upload failed." });
    }
  });
});

// DELETE an image
// Admin-only
router.delete("/images/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    if (image.cloudinaryPublicId && hasCloudinaryConfig) {
      try {
        await cloudinary.uploader.destroy(image.cloudinaryPublicId, { resource_type: "image" });
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    } else if (image.url.startsWith("/uploads/")) {
      // Legacy cleanup for old local files.
      const relativeUrl = image.url.startsWith("/") ? image.url.slice(1) : image.url;
      const safeRelativePath = path.normalize(relativeUrl);
      const filePath = path.join(__dirname, "..", safeRelativePath);

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting legacy local file:", unlinkErr.message);
        }
      });
    }

    await Image.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting image." });
  }
});

module.exports = router;
