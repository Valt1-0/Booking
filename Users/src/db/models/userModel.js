const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
});

// Compare password
// userSchema.methods.comparePassword = async function (password) {
//   if (!password) throw new Error("Password is missing, can not compare!");

//   try {
//     const result = await bcrypt.compare(password, this.password);
//     return result;
//   } catch (error) {
//     console.log("Error while comparing password!", error.message);
//   }
// };

//Check email
userSchema.statics.emailAlreadyUse = async function (email) {
  if (!email) throw new Error("Invalid Email");
  try {
    const user = await this.findOne({ email });
    if (user) return true;

    return false;
  } catch (error) {
    console.log("error inside isThisEmailInUse method", error.message);
    return false;
  }
};

// userSchema.pre("findOneAndUpdate", async function (next) {
//   const userToUpdate = await this.model.findOne(this.getQuery());
//   if (this._update.password != undefined) {
//     if (userToUpdate.password !== this._update.password) {
//       this._update.password = await bcrypt.hash(this._update.password, 10);
//     }
//   }
// });


module.exports = mongoose.model("User", userSchema);
