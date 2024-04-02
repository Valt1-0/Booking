const { CreateChannel, SubscribeMessage } = require("../utils");
const EventService = require("../services/event-service");
const { validateEvent } = require("../middleware/eventValidator");

module.exports = async (app) => {
  const channel = await CreateChannel();
  const service = new EventService(channel);

  SubscribeMessage(channel, service);

  app.get("/", async (req,res) => {
    const allEvents = await service.getAllEvents(req.body);
    res.status(allEvents.statusCode).json(allEvents.data);
  } );
  app.get("/:eventId", async (req,res) => {
    const event = await service.getEvent(req.params);
    res.status(event.statusCode).json(event.data);
  } );
  app.post("/", async (req, res) => {
    const createEvent = await service.createEvent(req.body);
    res.status(createEvent.statusCode).json(createEvent.data);
  });
  app.put("/:eventId", validateEvent, (req,res) => {
    const eventInputs =  {
      eventId: req.params.eventId,
      eventData: req.body,
    };
    const updateEvent = service.updateEvent(req.params, req.body);
    res.status(updateEvent.statusCode).json(updateEvent.data);
  } );

  app.delete("/:eventId", async (req,res) => {
    const deleteEvent = await service.deleteEvent(req.params);
    res.status(deleteEvent.statusCode).json(deleteEvent.data);
  });
};
