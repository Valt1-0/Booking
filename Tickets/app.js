const { API_PORT, MONGODB_URI } = require("./src/config");
console.log(MONGODB_URI);
require("./src/db/mongoConnect").connect();

const { init } = require("./src/instrumentation");
const { tracer } = init("Tickets");

// const span = tracer.startSpan("my-test-span");
// span.end();
const express = require("express");
const { PORT } = require("./src/config/");
const ticketRoute = require("./src/routes/ticketRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const startServer = async () => {
  try {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: "application/json" }));

    ticketRoute(app);

    // Server listening
    app.listen(PORT, () => {
      console.log(`Server Tickets running on port ${PORT}`);
    });

    return app;
  } catch (error) {
    console.error("Error starting server: ", error);
  }
};

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);

if (process.env.NODE_ENV !== "test") startServer();

module.exports = startServer;
