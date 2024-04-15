const fs = require("fs");

if (!fs.existsSync("./doc")) {
  fs.mkdirSync("./doc");
}

const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});

const endpointsFiles = [
  {
    name: "users",
    path: "../Users/src/routes/userRoutes.js",
    envPath: "../Users/.env",
  },
  {
    name: "auth",
    path: "../Auth/src/routes/authRoutes.js",
    envPath: "../Auth/.env",
  },
  {
    name: "events",
    path: "../Events/src/routes/eventRoutes.js",
    envPath: "../Events/.env",
  },
  {
    name: "tickets",
    path: "../Tickets/src/routes/ticketRoutes.js",
    envPath: "../Tickets/.env",
  },
];

endpointsFiles.forEach((file) => {
  const envData = fs.readFileSync(file.envPath, "utf8");
  const port = envData
    .split("\n")
    .find((line) => line.startsWith("API_PORT"))
    .split("=")[1]
    .replace(/"/g, "")
    .trim();

  const schemas = {
    users: {
      users: {
        $firstname: "John",
        $lastname: "Doe",
        $email: "john@doe.com",
        $password: "Password123*/",
        $phone: "1234567890",
      },
    },
    events: {
      events: {
        $eventName: "Event Name",
        $localization: "Event Location",
        $date: "2021-12-31",
        $startTime: "10:00",
        $endTime: "18:00",
        $description: "Event Description",
        $organizer: "Event Organizer",
        $ticketPrice: 100.0,
        $capacity: 100,
        $isCancelled: false,
        $performers: ["Performer 1", "Performer 2"],
      },
    },
    tickets: {
      tickets: {
        $eventId: "60d21b706f502b2f4c092f3a",
        $userId: "60d21b706f502b2f4c092f3b",
        $available: true,
        $price: 100.0,
        $purchaseDate: "2021-12-31T10:00:00Z",
        $purchaseMethod: "CB",
        $status: "pending",
      },
    },
    auth: {
      auth: {
        $email: "john@doe.com",
        $password: "Password123*/",
      },
    },
  };

  const doc = {
    info: {
      version: "1.0.0",
      title: "API Documentation",
      description: `Documentation for ${file.name} microservice`,
    },
    host: `localhost:${port}`,
    basePath: "/",
    components: {
      schemas: schemas[file.name],
    },
    schemes: [], // by default: ['http']
    consumes: [], // by default: ['application/json']
    produces: [], // by default: ['application/json']
    tags: [
      {
        name: file.name.charAt(0).toUpperCase() + file.name.slice(1),
        description: `Routes related to ${file.name}`,
      },
    ],
  };

  const outputFile = `./doc/swagger-${file.name}.json`;
  swaggerAutogen(outputFile, [file.path], doc);
});
