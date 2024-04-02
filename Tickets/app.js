require("dotenv").config();
require("./src/db/mongoConnect").connect();
const express = require("express");
const { PORT } = require("./src/config/");

const ticketRoute = require("./src/routes/ticketRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

ticketRoute(app);

// Server listening
app.listen(PORT, () => {
  console.log(`Server Users running on port ${PORT}`);
});


module.exports = app;
