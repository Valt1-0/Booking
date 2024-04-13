const { FormateData } = require("../utils");
const Ticket = require("../db/models/ticketModel");
const mongoose = require("mongoose");
const { PublishMessage, CreateChannel } = require("../utils");
const {NOTIFICATION_SERVICE} = require('../config');

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

 
    const  ticketId  = ticketInputs;
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
    const { eventId, userId, quantity, price } = ticketInputs;

    //payment vérification

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tickets = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = (
          await Ticket.create(
            [
              {
                eventId,
                userId,
                available: true,
                purchaseDate: new Date(),
                price,
              },
            ],
            { session }
          )
        )[0];
        tickets.push(ticket);
      }

      await session.commitTransaction();
      session.endSession();

      console.log("data 0 ", tickets);
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

  purchaseTicketValidation = async (ticketInputs, status) => {
    console.log("test", ticketInputs);
    const { tickets } = ticketInputs;
    if (!tickets.length > 0)  
      return FormateData({ msg: tickets.msg, statusCode: 404 });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const ticketIds = tickets.map((ticket) => ticket._id);
      const updatedTickets = await Ticket.updateMany(
        { _id: { $in: ticketIds } },
        { status: status },
        { session }
      );

      if (updatedTickets.nModified === 0) {
        throw new Error("No ticket found !");
      }

      await session.commitTransaction();

      return FormateData({
        data: tickets,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in purchaseTicketValidation:", error);

      await session.abortTransaction();

      return FormateData({
        msg:
          error.message === "No ticket found !"
            ? error.message
            : "Internal server error",
        statusCode: error.message === "No ticket found !" ? 404 : 500,
      });
    } finally {
      session.endSession();
    }
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

  sendMail = async (ticketInputs, userInfo, status) => {
    //Send a notification to the notification service
    console.log("Send notification to the notification service")
  const channel = await CreateChannel();
    PublishMessage(
      channel,
      NOTIFICATION_SERVICE,
      JSON.stringify({
        data: {
          tickets: ticketInputs,
          status: status,
          user: userInfo,
          email: userInfo.email
        },
        event: "TICKETS",
      })
    );
  };

  SubscribeEvents = async (payload) => {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    switch (event) {
      case "PURCHASE_TICKET_CONFIRMED":
        const ticketsConfirmed = await this.purchaseTicketValidation(
          data,
          "CONFIRMED"
        );
        console.log(ticketsConfirmed.data);
        if (
          ticketsConfirmed.statusCode >= 200 &&
          ticketsConfirmed.statusCode < 300
        ) {
          this.sendMail(ticketsConfirmed.data, data.user, "CONFIRMED");
        } else {
          this.sendMail(null, data.user, "CANCELLED");
        }
        break;
      case "PURCHASE_TICKET_FAILED":
        const ticketsCANCELLED = await this.purchaseTicketValidation(
          data,
          "CANCELLED"
        );
        if (
          ticketsCANCELLED.statusCode >= 200 &&
          ticketsCANCELLED.statusCode < 300
        ) {
          this.sendMail(ticketsCANCELLED.data, data.user, "CONFIRMED");
        } else {
          this.sendMail(null, data.user, "CANCELLED");
        }
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
