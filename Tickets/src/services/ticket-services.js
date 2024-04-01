const {
  FormateData
} = require("../utils");
const Ticket = require("../db/models/ticketModel");

class TicketService {
  constructor(channel) {
    this.channel = channel;
  }
  céé = async () => {
    try {
      const tickets = await Ticket.find().limit(10).sort({ _id: -1 });

      return FormateData({ data: tickets  });
    } catch (error) {
      console.error("Error in getAllTickets:", error);
      return FormateData({
        msg: "Internal Server Error",
        statusCode: 500,
      });
    }
  };

  getTicketById = async (ticketInputs) => {
    const { ticketId } = ticketInputs;

    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket)
        return FormateData({ msg: "No ticket exists with this ID !" });

      return FormateData({ data: ticket });
    } catch (error) {
      console.error("Error in getTicketById:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };

  buyTickets = async (ticketInputs) => {
    const { eventId, userId, quantity } = ticketInputs;

    try {
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = await Ticket.create({
          eventId,
          userId,
          available: true,
          purchaseDate: new Date(),
        });
        tickets.push(ticket);
      }

      return FormateData({
        data: tickets,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in buyTickets:", error);
      return FormateData({
        msg: "An error occurred while buying the tickets.",
        statusCode: 500,
      });
    }
  };

  updateTicket = async (ticketInputs) => {
    const { ticketId, userId, eventId, quantity, totalPrice, purchaseDate } =
      ticketInputs;

    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          eventId,
          userId,
          quantity,
          totalPrice,
          purchaseDate,
        },
        { new: true }
      );
      if (!updatedTicket)
        return FormateData({
          msg: "No account exists with this email !",
          statusCode: 404,
        });
      res.status(200).json(updatedTicket);
    } catch (error) {
      console.error("Error in updateTicket:", error);
      return FormateData({
        msg: "Internal server error",
        statusCode: 500,
      });
    }
  };

  deleteUser = async (ticketInputs) => {
    const { ticketId, user } = ticketInputs;
    try {
      const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
      if (!deletedTicket) return res.status(404).send("Ticket not found.");
      res.status(200).send("Ticket has been deleted successfully!");
    } catch (error) {
      console.error("Error in deleteTicket:", error);
      res.status(500).send("An error occurred while deleting the ticket.");
    }
  };

  SubscribeEvents = async (payload) => {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    switch (event) {
      case "CREATE_TICKET":
        this.buyTickets(data);
        break;
      case "UPDATE_TICKET":
        this.updateTicket(data);
        break;
      case "DELETE_TICKET":
        this.deleteTicket(data);
        break;
      default:
        break;
    }
  };
}

module.exports = TicketService;
