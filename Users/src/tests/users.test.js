const request = require("supertest");
const startServer = require("../../app"); // Replace with the correct path to your Express app file
const mongoose = require("mongoose");
const assert = require("assert");

let userId = ""; // Declare userId with let instead of const
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

describe("User", () => {
  let app;

  before(async () => {
    app = await startServer(); // Start the Express server before running tests
   // await new Promise((resolve) => mongoose.connection.once("open", resolve));
    // await new Promise((resolve) => {
    // mongoose.connection.collections["users"].drop(function (err) {
    //   console.log("collection dropped");
    //   resolve();
    // });
    // });
    // await new Promise((resolve) => mongoose.connection.once("open", resolve));
    // console.log('test started');
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

    assert(response.body);
    // Add further assertions based on what your API should return
  });

  it("should get all users", async () => {
    const response = await request(app).get("/").expect(200);
    assert(response.body);
    // Add further assertions based on what your API should return
  });

  it("should get a user by userId", async () => {
    const response = await request(app)
      .get(`/getById`)
      .query({ userId: userId })
      .expect(200);
    assert(response.body);
    // Add further assertions based on what your API should return
  });

  it("should update a user by userId", async () => {
    let auth;

await new Promise(async (resolve, reject) => {
  for (let i = 0; i < 10; i++) {
    try {
       auth = await Authenticate("test@example.com", "Password123!");
      if (auth && auth.token) {
        console.log("Authentication successful");
        resolve(auth);
        return;
      } else {
        console.log("Authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
    // Attendre 2 secondes avant le prochain essai
    await new Promise((r) => setTimeout(r, 200));
  }
  resolve();
});


  if (!auth) throw new Error("Authentication failed");
   token =  await auth.token;
    const updatedUser = {
      firstname: "Test",
      lastname: "User",
      email: "test@example.com",
      password: "Password123!",
      phone: "1234567890",
      role: "user",
    };

    const response = await request(app)
      .put(`/update`)
      .set("Authorization", `Bearer ${token}`)
      .query({ userId: userId })
      .send(updatedUser)
      .expect(200);

    assert(response.body);
    // Add further assertions based on what your API should return
  });

  it("should delete a user by userId", async () => {
    const response = await request(app)
      .delete(`/delete`)
      .set("Authorization", `Bearer ${token}`)
      .query({ userId: userId })
      .expect(200);
    assert(response.body);
    // Add further assertions based on what your API should return
  });
});
