const { API_PORT } = require('./src/config');
require("./src/db/mongoConnect").connect();
const express = require("express");

const userRoute = require("./src/routes/userRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();


const { init } = require("./src/instrumentation");
const { tracer } = init("Users");
const span = tracer.startSpan("usersSpan");
span.end();

const startServer = async () => {
  try {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: "application/json" }));

    await userRoute(app);

    // Server listening
    app.listen(API_PORT, () => {
      console.log(`Server Users running on port ${API_PORT}`);
    });

    return app;
  } catch (error) {
    console.log(error);
  }
};

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);

if (process.env.NODE_ENV !== "test") startServer();

module.exports = startServer;
