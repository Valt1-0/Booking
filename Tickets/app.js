require("dotenv").config();
require("./src/db/mongoConnect").connect();
const express = require("express");

const ticketRoute = require("./src/routes/ticketRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

app.use("/", ticketRoute);

//Get port in .env file
const { API_PORT } = process.env;

// Server listening
app.listen(API_PORT, () => {
  console.log(`Server Users running on port ${API_PORT}`);
});


module.exports = app;
