require("dotenv").config();
require("./src/db/mongoConnect").connect();
const express = require("express");
//Get port in .env file
const { PORT } = require('./src/config');


const authRoute = require("./src/routes/authRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

app.use("/", authRoute);



// Server listening
app.listen(PORT, () => {
  console.log(`Server Users running on port ${PORT}`);
});

module.exports = app;
