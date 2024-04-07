const { FormateData } = require("../utils");
const Ticket = require("../db/models/ticketModel");

class TicketService {
  constructor(channel) {
    this.channel = channel;
  }
  getAllTickets = async () => {
    try {
      const tickets = await Ticket.find().limit(10).sort({ _id: -1 });

      return FormateData({ data: tickets });
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
    const { eventId, userId, quantity,price } = ticketInputs;

    //payment vérification

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = await Ticket.create(
          [
            {
              eventId,
              userId,
              available: true,
              purchaseDate: new Date(),
              price
            },
          ],
          { session }
        );
        tickets.push(ticket);
      }

      await session.commitTransaction();
      session.endSession();

      return FormateData({
        data: tickets,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in buyTickets:", error);

      await session.abortTransaction();
      session.endSession();
      //rollback payment transaction
      return FormateData({
        msg: "An error occurred while buying the tickets.",
        statusCode: 500,
      });
    }
  };

  purchaseTicketValidation = async (ticketInputs) => { 

    ticketInputs.map(async (ticket) => { 


    });
  };

  updateTicket = async (ticketInputs) => {
    const { ticketId, userId, eventId, quantity, price, purchaseDate, status } =
      ticketInputs;

    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          eventId,
          userId,
          quantity,
          price,
          purchaseDate,
          status,
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
      case "PURCHASE_TICKET_CONFIRMED":
        this.buyTickets(data);
        break;
      case "PURCHASE_TICKET_FAILED":
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
