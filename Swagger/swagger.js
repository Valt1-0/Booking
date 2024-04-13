const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});
const doc = {
  info: {
    version: "1.0.0",
    title: "API Documentation",
    description: "Documentation for Express microservices",
  },
  host: `localhost:4000`,
  basePath: "/",
  components: {},
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // Define tags for your routes
    {
      name: "Users",
      description: "Routes related to Users",
    },
    // {
    //   name: "Auth",
    //   description: "Routes related to Auth",
    // },
    // {
    //   name: "Events",
    //   description: "Routes related to Events",
    // },
    // {
    //   name: "Tickets",
    //   description: "Routes related to Tickets",
    // },
    // Add more tags if needed
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = [
  "../Users/src/routes/userRoutes.js",
  "../Auth/src/routes/authRoutes.js",
  "../Events/src/routes/eventRoutes.js",
  "../Tickets/src/routes/ticketRoutes.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
