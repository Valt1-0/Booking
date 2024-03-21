const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.API_PORT,
  DB_URL: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};