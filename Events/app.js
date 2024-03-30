require("dotenv").config();
require("./src/db/mongoConnect").connect();
const express = require("express");

const eventRoute = require("./src/routes/eventRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

eventRoute(app);

//Get port in .env file
const { API_PORT } = process.env;

// Server listening
app.listen(API_PORT, () => {
  console.log(`Server Accounts running on port ${API_PORT}`);
});


module.exports = app;
