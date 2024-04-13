const {API_PORT } = require('./src/config')
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mailRoutes = require("./src/routes/mailRoutes");


/**
 * * EXPRESS
 */

const app = express();


app.use(
  cors({
    origin: [`https://localhost:3002`, "http://localhost:3002"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    sameSite: "none",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mailRoutes(app);

/**
 * * SWAGGER
 */

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * * Listening
 */
app.listen(API_PORT, () => {
  console.log("Server running on :", `https://localhost:${API_PORT}`);
});
