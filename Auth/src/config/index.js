const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  API_PORT: process.env.API_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  AUTH_SERVICE: process.env.AUTH_SERVICE_QUEUE,
  USER_SERVICE: process.env.USER_SERVICE_QUEUE,
  NOTIFICATION_SERVICE: process.env.NOTIFICATION_SERVICE_QUEUE,
};