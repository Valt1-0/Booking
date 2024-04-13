const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file

let userId = ""; // Declare userId with let instead of const

describe("User", () => {
  let app;

  beforeAll(async () => {
    app = await startServer(); // Start the Express server before running tests
  });

  it("should register a new user", async () => {
    const newUser = {
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      password: "Password123!",
      phone: "1234567890",
    };

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(200);

    userId = response.body.userInfo._id;

    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should get all users", async () => {
    const response = await request(app).get("/").expect(200);
    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should get a user by userId", async () => {
    const response = await request(app).get(`/?userId=${userId}`).expect(200);
    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should update a user by userId", async () => {
    const updatedUser = {
      firstname: "Updated",
      lastname: "User",
      email: "updated@example.com",
      password: "Updatedpassword123/*",
      phone: "0987654321",
    };

    const response = await request(app)
      .put(`/?userId=${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });

  it("should delete a user by userId", async () => {
    const response = await request(app).delete(`/?userId=${userId}`).expect(200);
    expect(response.body).toBeDefined();
    // Add further assertions based on what your API should return
  });
});
