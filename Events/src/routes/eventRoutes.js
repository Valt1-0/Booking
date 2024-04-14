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
    // #swagger.parameters['eventId'] = { description: 'Event Id' }

    const event = await service.getEvent(req.query);
    res.status(event.statusCode).json(event.data);
  });
  app.post("/create", isAuth, async (req, res) => {
    // #swagger.tags = ['Events']
    // #swagger.description = 'Create Event.'
    // #swagger.requestBody = {required: true,content: {"application/json": {schema: {$ref: "#/components/schemas/events"}  }}}
    const role = req.user?.role;

    if (role !== "admin" || role !== "organizer")
      return res
        .status(403)
        .json({ msg: "You are not authorized to create an event." });

    const createEvent = await service.createEvent(req.body);
    res.status(createEvent.statusCode).json(createEvent.data);
  });
  app.put("/update", isAuth, async (req, res) => {
    // #swagger.tags = ['Events']
    // #swagger.description = 'Update Event'
    // #swagger.parameters['eventId'] = { description: 'Event Id' }
    // #swagger.requestBody = {required: true,content: {"application/json": {schema: {$ref: "#/components/schemas/events"}  }}}
    const role = req.user?.role;
    if (role !== "admin" || role !== "organizer")
      return res
        .status(403)
        .json({ msg: "You are not authorized to update an event." });

    const eventInputs = {
      eventId: req.query?.eventId,
      eventData: req.body,
    };
    const updateEvent = await service.updateEvent(eventInputs);
    res.status(updateEvent.statusCode).json(updateEvent.data);
  });

  app.delete("/delete", isAuth, async (req, res) => {
    // #swagger.tags = ['Events']
    // #swagger.description = 'Delete Event by id.'
    // #swagger.parameters['eventId'] = { description: 'Event Id' }
    const role = req.user?.role;
    if (role !== "admin" || role !== "organizer")
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete an event." });

    const { eventId } = req.query;
    const deleteEvent = await service.deleteEvent(eventId);
    res.status(deleteEvent.statusCode).json(deleteEvent.data);
  });
};
