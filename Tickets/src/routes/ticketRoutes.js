const TicketService = require("../services/ticket-services");
const { CreateChannel, SubscribeMessage, PublishMessage } = require("../utils");
const { EVENT_SERVICE, NOTIFICATION_SERVICE } = require("../config");
 const { isAuth } = require("../middleware/auth");

module.exports = async (app) => {
  const service = new TicketService();
  const channel = await CreateChannel();

  SubscribeMessage(channel, service);

  app.get("/", async (req, res) => {

    const allTickets = await service.getAllTickets();
    res.status(allTickets.statusCode).json(allTickets.data);
  });
  app.get("/getById", async (req, res) => {

    const { ticketId } = req.query;
    console.log(ticketId);

    const ticket = await service.getTicketById(ticketId);

    res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  });

  app.post("/create",isAuth, async (req, res) => {

    const ticketInputs = {
      ...req.body,
      user: req.user,
    };
    const ticket = await service.buyTickets(ticketInputs);
    if (ticket.statusCode >= 200 && ticket.statusCode < 300) {
      const payload = {
        data: { tickets: ticket.data, user: req.user },
        event: "VERIFICATION_PURCHASE_TICKETS_EVENT",
      };
      PublishMessage(channel, EVENT_SERVICE, JSON.stringify(payload));
    }

    res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  });

  app.put("/update", isAuth, async (req, res) => {
    const ticketInput = {
      ...req.body,
      ticketId: req.query.ticketId,
      userId: req.user.id,
    };

    const ticket = await service.updateTicket(ticketInput);

    if (ticket.statusCode >= 200 && ticket.statusCode < 300) {
      const payload = {
        data: {
          eventId: req.body?.eventId,
          userId: req.user.userId,
          quantity: req.body?.quantity,
          totalPrice: req.body?.totalPrice,
          purchaseDate: req.body?.purchaseDate,
        },
        event: "UPDATE_TICKET",
      };
    }
    res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  });

  app.delete("/delete", isAuth, async (req, res) => {

    const ticketInput = {
      ticketId: req.query.ticketId,
      user: req.user,
    };
    console.log(ticketInput);
    const ticket = await service.deleteTicket(ticketInput);
    if (ticket.statusCode >= 200 && ticket.statusCode < 300) {
      const payload = {
        data: {
          ticketId: ticketInput.ticketId,
        },
        event: "DELETE_TICKET",
      };
    }
    res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  });
};
