const express = require("express");
const swaggerUi = require("swagger-ui-express");

const usersSwagger = require("./doc/swagger-users.json");
const ticketsSwagger = require("./doc/swagger-tickets.json");
const eventsSwagger = require("./doc/swagger-events.json");
const authSwagger = require("./doc/swagger-auth.json");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

//Get port in .env file
const SWAGGER_PORT = 4000;

// Swagger
app.use('/users', swaggerUi.serveFiles(usersSwagger), swaggerUi.setup(usersSwagger));
app.use('/tickets', swaggerUi.serveFiles(ticketsSwagger), swaggerUi.setup(ticketsSwagger));
app.use('/events', swaggerUi.serveFiles(eventsSwagger), swaggerUi.setup(eventsSwagger));
app.use('/auth', swaggerUi.serveFiles(authSwagger), swaggerUi.setup(authSwagger));

// Server listening
app.listen(SWAGGER_PORT, () => {
  console.log(`Server Swagger running on port ${SWAGGER_PORT}`);
});