// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to authenticate and verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Middleware to check if the user is an admin
const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

// Route: Signup
router.post("/signup", async (req, res) => {
  const { username, email, password, isAdmin = false } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Route: Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Protected Route Example
router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected route accessible only to authenticated users.",
    user: req.user,
  });
});

// Admin-Only Route Example
router.get("/admin-only", authenticateToken, authorizeAdmin, (req, res) => {
  res.json({
    message: "This is an admin-only route accessible only to admins.",
    user: req.user,
  });
});

// Route: Get Current User
router.get("/current", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Route: Logout (optional)
router.post("/logout", (req, res) => {
  // Simply inform client to clear the token
  res.json({ message: "Logged out successfully." });
});

module.exports = {
  router,
  authenticateToken,
  authorizeAdmin,
};
