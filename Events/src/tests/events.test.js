const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file
const assert = require("assert");
let eventId;
let token;

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


describe("Event API", () => {
  let app;

  before(async () => {
    app = await startServer(); // Start the Express server before running tests
     const auth = await Authenticate("admin@admin.com", "Test1234!");
     if (!auth) throw new Error("Authentication failed");
     token = auth.token;
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

      const response = await request(app)
      .post("/create")  
      .set("Authorization", `Bearer ${token}`)
      .send(newEvent).expect(200);

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
      .set("Authorization", `Bearer ${token}`)
      .query({ eventId: eventId })
      .send(updatedEvent)
      .expect(200);

    assert(response.body);
  });

  it("should delete an event by eventId", async () => {
    const response = await request(app)
      .delete(`/delete`)
      .set("Authorization", `Bearer ${token}`)
      .query({ eventId: eventId })
      .expect(200);

    console.log(eventId);

    assert(response.body);
  });
});
