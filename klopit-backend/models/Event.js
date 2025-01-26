// models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true }, // Store as Date in MongoDB
  description: { type: String, required: true },
  maxParticipants: { type: Number }, // optional
  registrations: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      registeredAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Event", EventSchema);
