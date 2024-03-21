const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} is not a valid password. Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.`,
    },
  },
  role: { type: String, required: true, default: "user" },
  userId: { type: Schema.Types.ObjectId, required: true },
});


module.exports = mongoose.model("Auth", authSchema);
