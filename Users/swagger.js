const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});
require("dotenv").config();

const { API_DOMAINE } = process.env;
const domaine = API_DOMAINE || "localhost";

const doc = {
  info: {
    version: "1.0.0",
    title: "User Services Documentation",
    description: "",
  },
  host: `${domaine}:3002`,
  basePath: "/",
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description:
          "Authentication via token stored in a cookie named 'token'.",
      },
    },
  },
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: "Users",
      description: "Users routes",
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/routes/userRoutes.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);