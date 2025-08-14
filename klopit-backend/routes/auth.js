const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to authenticate and verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Invalid or expired token.", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Middleware to check if the user is an admin
const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (!user.isAdmin) return res.status(403).json({ message: "Access denied. Admins only." });
    next();
  } catch (error) {
    console.error("Server error in admin authorization", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Route: Signup
router.post("/signup", async (req, res) => {
  const { username, email, password, isAdmin = false } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, isAdmin });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Route: Login — issues access and refresh tokens
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      token: accessToken,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Route: Refresh — issues new access token using refresh token
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token provided." });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ token: newAccessToken });
  } catch (error) {
    console.error("Refresh token invalid or expired:", error);
    res.status(403).json({ message: "Invalid refresh token." });
  }
});

// Route: Get Current User
router.get("/current", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Route: Logout — clears the refresh token cookie
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully." });
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

module.exports = {
  router,
  authenticateToken,
  authorizeAdmin,
};
