const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const { MONGODB_URI } = process.env;

exports.connect = async () => {
  await mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Successfully connected to database " + mongoose.connection.name);
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
