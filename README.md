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

## Installation

To install the Booking system, follow these steps:

- Clone the repository: `git clone https://github.com/Valt1-0/Booking.git`
- Navigate to the project directory: `cd Booking`
- Go to Telemetry folder : `cd Telemetry`
- Setup the Docker compose : `docker compose . -d`
- Configure environment variables as needed in .env of each Microservices.


## Tests

To run the tests, use the command `npm run test` in the folder of the microservices you want to tes.
