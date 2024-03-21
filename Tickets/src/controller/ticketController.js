const Ticket = require("../models/ticketModel");
const Event = require("../models/eventModel");

// Get all tickets
exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().limit(10).sort({ _id: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error in getAllTickets:", error);
    res.status(500).send("An error occurred while fetching tickets");
  }
};

// Get a ticket by its ID
exports.getTicketById = async (req, res, next) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).send("No ticket exists with this ID!");
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error in getTicketById:", error);
    res.status(500).send("Internal server error!");
  }
};

// Buy tickets
exports.buyTicket = async (req, res, next) => {
  const { eventId, userId, quantity } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found.");
    }

    if (event.capacity < quantity) {
      return res.status(400).send("Not enough tickets available for purchase.");
    }

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

    event.capacity -= quantity;
    await event.save();

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error in buyTickets:", error);
    res.status(500).send("An error occurred while buying the tickets.");
  }
};


// Update a ticket
exports.updateTicket = async (req, res, next) => {
  const { eventId, userId, quantity, totalPrice, purchaseDate } = req.body;
  const { ticketId } = req.params;
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
    if (!updatedTicket) return res.status(404).send("Ticket not found.");
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error in updateTicket:", error);
    res.status(500).send("An error occurred while updating the ticket.");
  }
};

// Delete a ticket
exports.deleteTicket = async (req, res, next) => {
  const { ticketId } = req.params;
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
    if (!deletedTicket) return res.status(404).send("Ticket not found.");
    res.status(200).send("Ticket has been deleted successfully!");
  } catch (error) {
    console.error("Error in deleteTicket:", error);
    res.status(500).send("An error occurred while deleting the ticket.");
  }
};
