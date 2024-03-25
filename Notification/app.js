require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = process.env.EXPRESS_PORT || 3005;

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
app.listen(port, () => {
  console.log(
    "Server running on :",
    `https://localhost:${port}`
  );
});
