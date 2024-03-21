const express = require("express");
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controller/eventController");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:eventId", getEvent);
router.post("/", createEvent);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

module.exports = router;
