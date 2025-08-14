require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path"); // Added for handling file paths

const app = express();
const PORT = process.env.PORT || 5001;

// === Middleware ===
app.use(express.json());
app.use(cookieParser());

// === Serve Static Files for Image Uploads ===
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === Dynamic CORS ===
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⛔ Blocked CORS request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // important if using cookies or auth
  })
);

// === Logging Middleware ===
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// === MongoDB Connection ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Routes ===
const { router: authRouter } = require("./routes/auth");
const eventsRouter = require("./routes/events");
const chantsRouter = require("./routes/chants");
const galleryRouter = require("./routes/gallery"); // Added for the new gallery feature

app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/chants", chantsRouter);
app.use("/api/gallery", galleryRouter); // Added for the new gallery feature

// === Error Handling ===
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❗ Server error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
