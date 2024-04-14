const { API_PORT } = require("./src/config");
require("./src/db/mongoConnect").connect();
const express = require("express");
//Get port in .env file

const authRoute = require("./src/routes/authRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

authRoute(app);

// Server listening
app.listen(API_PORT, () => {
  console.log(`Server Auth running on port ${API_PORT}`);
});

module.exports = app;
