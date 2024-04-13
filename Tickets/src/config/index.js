const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}
 const configFile = `./.env.${process.env.NODE_ENV}`;
const result = dotEnv.config({ path: configFile });
console.log("rabbitmq", process.env.MSG_QUEUE_URL, process.env.NODE_ENV,result);

module.exports = {
  PORT: process.env.API_PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  AUTH_SERVICE: process.env.AUTH_SERVICE_QUEUE,
  USER_SERVICE: process.env.USER_SERVICE_QUEUE,
  TICKET_SERVICE: process.env.TICKET_SERVICE_QUEUE,
  EVENT_SERVICE: process.env.EVENT_SERVICE_QUEUE,
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_QUEUE,
};
