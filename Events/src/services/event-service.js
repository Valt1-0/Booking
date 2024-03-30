const {
  FormateData,
  PublishMessage,
  ValidatePassword,
  GenerateSignature,
} = require("../utils");
const Event = require("../models/eventModel");
const { EVENT_SERVICE } = require("../config");

class EventService {
  constructor(channel) {
    this.channel = channel;
  }

  getEvent = async (eventInputs) => {
    const { eventId } = eventInputs;

    try {
      const event = await Event.findById(eventId);

      if (!event)
        return FormateData({
          msg: "No event found with this ID !",
          statusCode: 404,
        });

      return FormateData({ data: event, statusCode: 200 });
    } catch (error) {
      console.error("Error fetching event:", error);
      FormateData({
        msg: "An error occurred while fetching the event.",
        statusCode: 500,
      });
    }
  };

  getAllEvents = async (eventInputs) => {
    try {
      const { sort } = eventInputs;
      const events = await Event.find().limit(10).sort({ _id: -1 });
      return FormateData({ data: events, statusCode: 200 });
    } catch (error) {
      console.error("Error fetching events:", error);
      return FormateData({
        msg: "An error occurred while fetching events.",
        statusCode: 500,
      });
    }
  };

  createEvent = async (eventInputs) => {
    const eventData = eventInputs;

    try {
      const event = await Event.create(eventData);
      return FormateData({ data: event, statusCode: 200 });
    } catch (error) {
      console.error("Error creating event:", error);
      return FormateData({
        msg: "An error occurred while creating the event.",
        statusCode: 500,
      });
    }
  };

  updateEvent = async (eventInputs) => {
    const { eventId, eventData } = eventInputs;
    try {
      const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, {
        new: true,
      });

      if (!updatedEvent)
        return FormateData({
          msg: "No event found with this ID!",
          statusCode: 404,
        });

      return FormateData({ data: updatedEvent, statusCode: 200 });
    } catch (error) {
      console.error("Error updating event:", error);
      return FormateData({
        msg: "An error occurred while updating the event.",
        statusCode: 500,
      });
    }
  };

  deleteEvent = async (eventInputs) => {
    const { eventId } = eventInputs;

    try {
      const deletedEvent = await Event.findByIdAndDelete(eventId);

      if (!deletedEvent)
        return FormateData({
          msg: "No event found with this ID!",
          statusCode: 404,
        });

      return FormateData({
        data: "Event has been deleted successfully!",
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      return FormateData({
        msg: "An error occurred while deleting the event.",
        statusCode: 500,
      });
    }
  };

  SubscribeEvents = async (payload) => {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    switch (event) {
      default:
        break;
    }
  };

}

module.exports = EventService;