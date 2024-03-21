const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  localization: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: { type: String },
  organizer: { type: String, required: true }, // Nom de l'organisateur
  ticketPrice: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 0 },
  isCancelled: { type: Boolean, default: false }, // Indicateur si l'événement est annulé
  performers: [{ type: String }], // Liste des artistes / interprètes participants
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);