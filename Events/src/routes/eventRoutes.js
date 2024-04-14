const { CreateChannel, SubscribeMessage } = require("../utils");
const EventService = require("../services/event-service");
const { validateEvent } = require("../middleware/eventValidator");

module.exports = async (app) => {
  const channel = await CreateChannel();
  const service = new EventService(channel);

  SubscribeMessage(channel, service);

  app.get("/", async (req, res) => {
    // #swagger.tags = ['Events']
    // #swagger.description = 'Get all events.'
    const allEvents = await service.getAllEvents(req.body);
    res.status(allEvents.statusCode).json(allEvents.data);
  });
  app.get("/getById", async (req, res) => {
    // #swagger.tags = ['Events']
    // #swagger.description = 'Get Event by id.'
    const event = await service.getEvent(req.params);
    res.status(event.statusCode).json(event.data);
  });
  app.post("/create", async (req, res) => {
    // #swagger.tags = ['Events']
    // #swagger.description = 'Create Event.'
    const createEvent = await service.createEvent(req.body);
    res.status(createEvent.statusCode).json(createEvent.data);
  });
  app.put("/update", (req, res) => {
    // #swagger.tags = ['Events']

    // #swagger.description = 'Update Event'
    const eventInputs = {
      eventId: req.params.eventId,
      eventData: req.body,
    };
    const updateEvent = service.updateEvent(eventInputs);
    res.status(updateEvent.statusCode).json(updateEvent.data);
  });

  app.delete("/delete", async (req, res) => {
    // #swagger.tags = ['Events']

    // #swagger.description = 'Delete Event by id.'
    const { eventId } = req.params;
    const deleteEvent = await service.deleteEvent(eventId);
    res.status(deleteEvent.statusCode).json(deleteEvent.data);
  });
};
