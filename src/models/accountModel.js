const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountName: { type: String, required: true }, // Ajout du champ accountName
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: String, default: 0 }, // Fix: Added the missing data type 'Number'
});

module.exports = mongoose.model("Account", accountSchema);
