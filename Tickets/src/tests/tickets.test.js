const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file
const mongoose = require("mongoose");
const { CreateChannel } = require("../utils");
const assert = require("assert");

let tickets = "";
let ticketId = "";
let user = "";
let eventId = "";
let token = "";

async function Authenticate(email, password) {
  const response = await fetch("http://127.0.0.1:3003/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function getAllEvents() {
  const response = await fetch("http://127.0.0.1:3001/");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function getFirstEvent() {
  const events = await getAllEvents();
  return events[0];
}

describe("Tickets", () => {
  let app;

  before(async () => {
    app = await startServer();
    await new Promise((resolve) => mongoose.connection.once("open", resolve));
    const auth = await Authenticate("dimcorb@gmail.com", "Test1234!");
    if (!auth) throw new Error("Authentication failed");
    user = auth.userInfo;
    token = auth.token;

    const event = await getFirstEvent();
    if (!event) throw new Error("No event found");
    eventId = event._id;
  });

  it("should get all tickets", async () => {
    const response = await request(app).get("/").expect(200);
    assert(response.body);
  });

  it("should create a new ticket", async () => {
    const ticket = {
      eventId: eventId,
      userId: user.id,
      quantity: 2,
      price: 10,
    };

    const response = await request(app)
      .post("/create")
      .set("Authorization", `Bearer ${token}`)
      .send(ticket)
      .expect(200);

    tickets = response.body.ticketInfo[0];

    ticketId = response.body.ticketInfo[0]._id;

    assert(response.body);
  });

  it("should get ticket by id", async () => {
    const response = await request(app)
      .get(`/getById`)
      .query({ ticketId: ticketId })
      .expect(200);
    assert(response.body);
  });

  it("should update ticket", async () => {
    const updatedTicket = {
      eventId: eventId,
      quantity: 2,
      price: 10,
      purchaseDate: tickets.purchaseDate,
    };

    const response = await request(app)
      .put(`/update`)
      .set("Authorization", `Bearer ${token}`)
      .query({ ticketId: ticketId })
      .send(updatedTicket)
      .expect(200);

    assert(response.body);
  });

  it("should delete a ticket by id", async () => {
    const response = await request(app)
      .delete(`/delete`)
      .set("Authorization", `Bearer ${token}`)
      .query({ ticketId: ticketId })
      .expect(200);
    assert(response.body);
  });
});
