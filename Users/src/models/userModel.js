const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(0)[1-9]([-. ]?[0-9]{2}){4}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Please enter a valid phone number.`,
    },
  },
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
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing, can not compare!");

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};

//Check email
userSchema.statics.emailAlreadyUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) return false;

    return true;
  } catch (error) {
    console.log("error inside isThisEmailInUse method", error.message);
    return false;
  }
};

userSchema.pre("findOneAndUpdate", async function (next) {
  const userToUpdate = await this.model.findOne(this.getQuery());
  if (this._update.password != undefined) {
    if (userToUpdate.password !== this._update.password) {
      this._update.password = await bcrypt.hash(this._update.password, 10);
    }
  }
});

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
