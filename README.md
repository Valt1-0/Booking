# Booking

You are in charge of building a new system to handle concerts and events tickets.
You already know that your system will be used by both small business (maybe a school organizing an event) or by international star for a "tour".

Your SaaS system should be able to handle that workload and be optimized as best as you can.

## Requirement

Docker

## Microservices

- **Users** : This microservice is used to manage users, such as registering and creating accounts, updating, and deleting.
- **Events** : This microservice is used to manage events.
- **Auth** : This microservice is used for user authentication, such as login.
- **Tickets** : This microservice is used to manage tickets, allowing users to buy single or multiple tickets.
- **Notification** : This microservice is used for sending email notifications.

![image](https://github.com/Valt1-0/Booking/assets/44736220/8f766a0b-d8c1-45ce-bc1e-324a1b9f2c74)

## Installation

To install the Booking system, follow these steps:

- Clone the repository: `git clone https://github.com/Valt1-0/Booking.git`
- Navigate to the project directory: `cd Booking`
- Go to Telemetry folder : `cd Telemetry`
- Setup the Docker compose : `docker compose . -d`
- Configure environment variables as needed in .env of each Microservices.

## Environment Variables

The project uses different environment files depending on the run mode:

- For starting the project in production mode, use `npm start` with the `.env` file.
- For starting the project in development mode, use `npm run dev` with the `.env.dev` file.
- For running tests, use `npm run test` with the `.env.test` file.

Here’s an example of what the `.env` file might look like:

```env
MONGODB_URI='mongodb://{credentials}@localhost:27018/DBNAME?authSource=admin&authMechanism=DEFAULT'
API_PORT="3004"
JWT_SECRET_KEY="SECRET_KEY"
MSG_QUEUE_URL='amqp://localhost:5672'
EXCHANGE_NAME='BOOKING'
AUTH_SERVICE_QUEUE='auth_service'
USER_SERVICE_QUEUE='user_service'
NOTIFICATION_SERVICE_QUEUE='notification_service'
TICKET_SERVICE_QUEUE='ticket_service'
EVENT_SERVICE_QUEUE='event_service'
```

## Tests

To run the tests, use the command `npm run test` in the folder of the microservices you want to test.


## Swagger

The Swagger documentation is auto-generated.

To generate the JSON file, go in **Swagger** folder, run first : `npm install` and after, run : `npm run start`

Available on [Swagger](localhost:4000), when docker compose is up 👍

## Containers


### Monitoring

- **Prometheus**: A monitoring system and time-series database that collects metrics from specified targets at given intervals, evaluates rule expressions, and can trigger alerts if some condition is observed to be true. Accessible at [Prometheus](localhost:9090).
- **Grafana**: An open-source platform for monitoring and observability that allows you to query, visualize, alert on, and understand your metrics no matter where they are stored. Accessible at [Grafana](localhost:3000).
- **Jaeger**: An open-source, end-to-end distributed tracing system that helps developers monitor and troubleshoot complex, microservices-based architectures. Accessible at [Jaeger](localhost:16686).
- **OTEL Collector**: The OpenTelemetry Collector offers a vendor-agnostic implementation on how to receive, process, and export telemetry data. It removes the need to run, operate, and maintain multiple agents/collectors.
- **MongoDB Exporter**: A Prometheus exporter for MongoDB metrics. It exports MongoDB metrics for Prometheus consumption.
- **CAdvisor**: An open-source container resource usage and performance analysis agent. It is developed by Google and provides container users an understanding of the resource usage and performance characteristics of their running containers.

### Gateway

- **Nginx Gateway**: A high-performance HTTP server for load balancing and API Gateway. Accessible at localhost:80.

### APIs

- **users1**: A microservice for managing user-related operations. Accessible for request at localhost:3002.
- **users2**: Another microservice for managing user-related operations. Accessible for request at localhost:4002.
- **tickets1**: A microservice for managing ticket-related operations. Accessible for request at localhost:3004.
- **tickets2**: Another microservice for managing ticket-related operations. Accessible for request at localhost:4004.
- **events1**: A microservice for managing event-related operations. Accessible for request at localhost:3001.
- **events2**: Another microservice for managing event-related operations. Accessible for request at localhost:4001.
- **auth1**: A microservice for managing authentication operations. Accessible for request at localhost:3003.
- **auth2**: Another microservice for managing authentication operations. Accessible for request at localhost:4003.
- **notification**: A microservice for managing notification operations. Accessible for request at localhost:3005.

## Databases

- **Users-db**: A database for storing user-related data.
- **Tickets-db**: A database for storing ticket-related data.
- **Events-db**: A database for storing event-related data.
- **Auth-db**: A database for storing authentication-related data.

## Queue

- **Rabbitmq**: A message-queueing software also known as a message broker or queue manager. It is designed to exchange data by way of a mechanism known as message queuing.

