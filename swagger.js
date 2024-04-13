const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});
const API_DOMAIN_AUTH = process.env.API_DOMAIN_AUTH || "localhost";
const API_DOMAIN_TICKET = process.env.API_DOMAIN_TICKET || "localhost";
const API_DOMAIN_USERS = process.env.API_DOMAIN_USERS || "localhost";
const API_DOMAIN_EVENTS = process.env.API_DOMAIN_EVENTS || "localhost";

const doc = {
  info: {
    version: "1.0.0",
    title: "Microservices API Documentation",
    description: "Documentation for all microservices",
  },
  host: hosts,
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    {
      name: "Auth",
      description: "Authentication routes",
    },
    {
      name: "Ticket",
      description: "Ticket routes",
    },
    {
      name: "Users",
      description: "Users routes",
    },
    {
      name: "Events",
      description: "Events routes",
    },
    // Add tags for other microservices as needed
  ],
};

const outputFile = "./swagger_all.json";
const endpointsFiles = [
  "./auth_app.js",
  "./ticket_app.js",
  "./users_app.js",
  "./events_app.js",
  // Add other microservice endpoint files here
];

// Define host for each microservice
const hosts = {
  Auth: `localhost:3003`,
  Ticket: `localhost:3004`,
  Users: `localhost:3002`,
  Events: `localhost:3004`,
};

// Generate Swagger documentation for each microservice
Object.keys(hosts).forEach((microservice) => {
  const currentDoc = {
    ...doc,
    host: hosts[microservice],
  };
  const currentOutputFile = `./swagger_${microservice.toLowerCase()}.json`;
  swaggerAutogen(currentOutputFile, endpointsFiles, currentDoc);
});
