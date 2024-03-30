const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Reference to the event
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who bought the ticket
  available: { type: Boolean, default: true }, // Indicate if the ticket is available
  // totalPrice: { type: Number, required: true }, // Total price of the tickets
  purchaseDate: { type: Date, required: true, default: Date.now }, // Date of ticket purchase
});

module.exports = mongoose.model("Ticket", ticketSchema);
