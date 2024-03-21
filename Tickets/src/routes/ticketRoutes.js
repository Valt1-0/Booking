const express = require("express");
const {
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  buyTicket,
} = require("../controller/ticketController");

const router = express.Router();

router.get("/", getAllTickets);
router.get("/:ticketId", getTicketById);
router.post("/", buyTicket);
router.put("/:ticketId", updateTicket);
router.delete("/:ticketId", deleteTicket);

module.exports = router;
