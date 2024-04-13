require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cookieParser());
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const { API_PORT } = process.env;

const server = app.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});

module.exports = app;
