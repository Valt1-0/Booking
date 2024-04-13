const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file

let eventId = "";

describe("Event API", () => {
  let app;

  beforeAll(async () => {
    app = await startServer(); // Start the Express server before running tests
  });

  it("should get all events", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should get an event by eventId", async () => {
    const response = await request(app).get(`/${eventId}`).expect(200);
    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should create a new event", async () => {
    const newEvent = {
      eventName: "Beauregard",
      localization: "Caen",
      date: "2024-04-01",
      startTime: 213123,
      endTime: 31323,
      description: "David Ghetto",
      organizer: "John Doe",
      ticketPrice: 20,
      capacity: 100,
      isCancelled: false,
      performers: "Mitry Dims",
    };

    const response = await request(app).post("/").send(newEvent).expect(200);

    eventId = response.body._id;

    console.log("eventId:", eventId);

    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should update an event by eventId", async () => {
    const updatedEvent = {
      eventName: "Beauregard",
      localization: "Caen",
      date: "2024-04-01",
      startTime: 213123,
      endTime: 31323,
      description: "zdazdadzadGhetto",
      organizer: "Jdadzade",
      ticketPrice: 20,
      capacity: 100,
      isCancelled: false,
      performers: "Mitry deded",
    };

    const response = await request(app)
      .put(`/?eventId=${eventId}`)
      .send(updatedEvent)
      .expect(200);

    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should delete an event by eventId", async () => {
    const response = await request(app)
      .delete(`/?eventId=${eventId}`)
      .expect(200);

    console.log(eventId);

    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });
});
