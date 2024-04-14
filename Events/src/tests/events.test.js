const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file
const assert = require("assert");
let eventId = "";

describe("Event API", () => {
  let app;

  before(async () => {
    app = await startServer(); // Start the Express server before running tests
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

      const response = await request(app).post("/create").send(newEvent).expect(200);

      eventId = await response.body._id;

      console.log("eventId:", eventId, response.body);

      assert(response.body);
    });


  it("should get all events", async () => {
    const response = await request(app).get("/").expect(200);
    assert(response.body);
  });

  it("should get an event by eventId", async () => {
    const response = await request(app)
      .get(`/getById`)
      .query({ eventId })
      .expect(200);
    assert(response.body);


  });



  it("should update an event by eventId", async () => {
    const updatedEvent = {
      eventName: "Beauregard",
      localization: "Caen",
      date: "2024-04-01",
      startTime: 213123,
      endTime: 31323,
      description: "David Ghetto update",
      organizer: "John Doe",
      ticketPrice: 20,
      capacity: 100,
      isCancelled: false,
      performers: "Mitry Dim's",
    };

    const response = await request(app)
      .put(`/update`)
      .query({eventId: eventId})
      .send(updatedEvent)
      .expect(200);

    assert(response.body);
  });

  it("should delete an event by eventId", async () => {
    const response = await request(app)
      .delete(`/delete`)
      .query({eventId: eventId})
      .expect(200);

    console.log(eventId);

    assert(response.body);
  });
});
