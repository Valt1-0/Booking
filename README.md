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

## Tests

To run the tests, use the command `npm run test` in the folder of the microservices you want to test.
