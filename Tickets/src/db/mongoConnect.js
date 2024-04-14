const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log(MONGODB_URI);

exports.connect = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully connected to database " + mongoose.connection.name);
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
