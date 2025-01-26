// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { authenticateToken, authorizeAdmin } = require("./auth");

/**
 * GET /api/events
 * Public route: returns all events.
 */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // sort by date ascending
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching events." });
  }
});

/**
 * GET /api/events/:id
 * Public route: returns a single event by ID.
 */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching the event." });
  }
});

/**
 * POST /api/events
 * Admin-only route: creates a new event.
 */
router.post("/", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, date, description, maxParticipants } = req.body;

    // Convert the incoming date string to a JavaScript Date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const newEvent = new Event({
      title,
      date: parsedDate,
      description,
      maxParticipants: maxParticipants || undefined,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error creating the event." });
  }
});

/**
 * PUT /api/events/:id
 * Admin-only route: updates an event by ID.
 */
router.put("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { title, date, description, maxParticipants } = req.body;

    // If a date was sent, parse it. Otherwise, do not overwrite the existing date.
    let updateData = { title, description, maxParticipants };

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format." });
      }
      updateData.date = parsedDate;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // return the updated document
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.json({ message: "Event updated successfully.", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error updating the event." });
  }
});

/**
 * DELETE /api/events/:id
 * Admin-only route: deletes an event by ID.
 */
router.delete("/:id", authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting the event." });
  }
});

/**
 * POST /api/events/:id/register
 * Public route: allows anyone to register for the event by providing name/email.
 */
router.post("/:id/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required for registration." });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // If maxParticipants is set, check if the event is full
    if (event.maxParticipants && event.registrations.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Registration is full for this event." });
    }

    // Add the new registration
    event.registrations.push({ name, email });
    await event.save();

    res.json({ message: "Successfully registered for the event.", registrations: event.registrations });
  } catch (error) {
    console.error("Error registering for the event:", error);
    res.status(500).json({ message: "Server error registering for the event.", error: error.message });
  }
});

module.exports = router;
