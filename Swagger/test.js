const swaggerMerge = require("swagger-merge");
const fs = require("fs");

const microservices = ["Users"]; // Remplacez par les noms de vos microservices
const outputFile = "swagger_output.json";

const swaggerFiles = microservices.map((microservice) =>
  require(`../${microservice}/swagger.json`)
);

const info = {
  version: "0.0.1",
  title: "merged swaggers",
  description: "all mighty services merged together\n",
};

const schemes = ["http"];

const mergedSwagger = swaggerMerge.merge(
  swaggerFiles,
  info,
  "/",
  "locahost",
  schemes
);

fs.writeFileSync(outputFile, JSON.stringify(mergedSwagger, null, 2));
