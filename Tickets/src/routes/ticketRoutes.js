
const TicketService = require("../services/ticket-services");
const { CreateChannel, SubscribeMessage, PublishMessage } = require("../utils");

module.exports = async (app) => {
  const service = new TicketService();
  const channel = await CreateChannel();

  app.get("/", async (req, res) => {
    const allTickets = await service.getAllTickets();
    res.status(allTickets.statusCode).json(allTickets.data);
  });
  app.get("/:ticketId", async (req, res) => {
    const { ticketId } = req.params;

    const ticket = await service.getTicketById(ticketId);

    res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  });
  app.post("/", async (req, res) => {
    const ticket = await service.buyTickets(req.body);
    if (ticket.statusCode >= 200 && ticket.statusCode < 300) {
      const payload = {
        data: {
          eventId: req.body?.eventId,
          userId: req.user.userId,
          quantity: req.body?.quantity,
          totalPrice: req.body?.totalPrice,
          purchaseDate: req.body?.purchaseDate,
        },
        event: "BUY_TICKET",
      };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
    }
    res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  });

  app.put("/:ticketId", async (req, res) => {
    const ticketInput = {
      ...req.body,
      ticketId: req.params.ticketId,
      userId: req.user.userId,
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

  // router.delete("/:ticketId", async (req, res) => {
  //   const ticketInput = {
  //     ticketId: req.params.ticketId,
  //     user: req.user,
  //   };
  //   const ticket = await service.deleteTicket(ticketInput.ticketId);
  //   if (ticket.statusCode >= 200 && ticket.statusCode < 300) {
  //     const payload = {
  //       data: {
  //         ticketId: ticketInput.ticketId,
  //       },
  //       event: "DELETE_TICKET",
  //     };
  //   }
  //   res.status(ticket.statusCode).json({ ticketInfo: ticket.data });
  // });
};
