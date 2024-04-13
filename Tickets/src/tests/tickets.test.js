const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file
const mongoose = require("mongoose");
const { CreateChannel } = require("../utils");
let ticketId = "";

describe("Tickets", () => {
  let app;

  beforeAll(async () => {
    app = await startServer(); // Start the Express server before running tests
    // Attendre que la connexion à MongoDB soit établie
    await new Promise((resolve) => mongoose.connection.once("open", resolve));
    await CreateChannel();
  });

  it("should get all tickets", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body).toBeDefined();
  });

  // it("should get an event by eventId", async () => {
  //   const response = await request(app).get(`/${ticketId}`).expect(200);
  //   expect(response.body).toBeDefined();
  //   // Add further assertions based on what your API should return
  // });

  // it("should create a new ticket", async () => {
  //   const ticket = {
  //     eventId: "65fca71f3f3cbbfa3356ca6e",
  //     userId: "65fca71c6ea83399be7ef26a",
  //     quantity: 4,
  //   };

  //   const response = await request(app).post("/").send(ticket).expect(200);

  //   ticketId = response.body._id;

  //   console.log("eventId:", ticketId);

  //   expect(response.body).toBeDefined();
  //   // Add further assertions based on what your API should return
  // });

  // it("should update an event by eventId", async () => {
  //   const updatedEvent = {
  //     eventId,
  //     userId,
  //     quantity,
  //     price,
  //     purchaseDate,
  //     status,
  //   };

  //   const response = await request(app)
  //     .put(`/?eventId=${ticketId}`)
  //     .send(updatedEvent)
  //     .expect(200);

  //   expect(response.body).toBeDefined();
  //   // Add further assertions based on what your API should return
  // });

  // it("should delete an event by eventId", async () => {
  //   const response = await request(app)
  //     .delete(`/?eventId=${eventId}`)
  //     .expect(200);

  //   console.log(eventId);

  //   expect(response.body).toBeDefined();
  //   // Add further assertions based on what your API should return
  // });
});
