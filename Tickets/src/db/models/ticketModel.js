const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Reference to the event
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who bought the ticket
  available: { type: Boolean, default: true }, // Indicate if the ticket is available
  price: { type: Number, required: true },
  purchaseDate: { type: Date, required: true, default: Date.now }, // Date of ticket purchase
  purchaseMethod: { type: String, required: true,  enum: ['CB', 'Virement', 'Autre'], 
  default: 'CB' }, // Method of purchase
  status: { type: String, required: true, default: "pending" }, // Status of the ticket
});

module.exports = mongoose.model("Ticket", ticketSchema);
