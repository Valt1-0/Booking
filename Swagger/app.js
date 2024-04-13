const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

//Get port in .env file
const SWAGGER_PORT = 4000;

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Server listening
app.listen(SWAGGER_PORT, () => {
  console.log(`Server Users running on port ${SWAGGER_PORT}`);
});
