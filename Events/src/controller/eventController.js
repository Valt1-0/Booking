const Event = require("../models/eventModel");

exports.getEvent = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).send("No event found with this ID!");
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the event." });
  }
  return next();
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().limit(10).sort({ _id: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching events." });
  }
  return next();
};

exports.createEvent = async (req, res, next) => {
  const eventData = req.body;

  try {
    const event = await Event.create(eventData);
    res.status(200).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the event." });
  }
  return next();
};

exports.updateEvent = async (req, res, next) => {
  const { eventId } = req.params;
  const eventData = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).send("No event found with this ID!");
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the event." });
  }
  return next();
};

exports.deleteEvent = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).send("No event found with this ID!");
    }

    res.status(200).send("Event has been deleted successfully!");
  } catch (error) {
    console.error("Error deleting event:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the event." });
  }
  return next();
};
