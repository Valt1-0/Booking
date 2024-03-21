const Account = require("../models/accountModel");

exports.getAccount = async (req, res, next) => {
  const { accountNumber } = req.query;

  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res
        .status(404)
        .send("No account exists with this account number!");
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the account." });
  }
  return next();
};

exports.getAccountsByUserId = async (req, res, next) => {
  const { userId } = req.query;

  try {
    // Vérifier si l'utilisateur est autorisé à accéder aux informations de l'utilisateur demandé
    if (
      req.user.role !== "admin" &&
      req.user.role !== "employee" &&
      req.user._id !== userId
    ) {
      return res
        .status(403)
        .send("You are not authorized to access this resource!");
    }

    // Rechercher les comptes associés à l'ID utilisateur
    const accounts = await Account.find({ userId }).limit(10).sort({ _id: -1 });

    if (!accounts || accounts.length === 0) {
      return res
        .status(404)
        .json({ message: "No accounts found for this user." });
    }

    // Retourner les comptes trouvés
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts by user ID:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching accounts." });
  }
  return next();
};

exports.getAllAccounts = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est autorisé à accéder à la liste des utilisateurs
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res
        .status(403)
        .send("You are not authorized to access this resource!");
    }

    const accounts = await Account.find().limit(10).sort({ _id: -1 });
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching accounts." });
  }
  return next();
};

exports.createAccount = async (req, res, next) => {
  const { accountName, accountNumber, balance } = req.body;
  const userId = req.user._id;

  try {
    if (!userId) {
      return res.status(404).json({ message: "User not found." });
    }

    const account = await Account.create({
      userId: userId,
      accountName: accountName,
      accountNumber: accountNumber,
      balance: balance,
    });

    res.status(200).json(account);
  } catch (error) {
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the account." });
  }
  return next();
};

exports.updateAccount = async (req, res, next) => {
  const accountNumber = req.query.accountNumber;

  try {
    const updatedAccount = await Account.findOneAndUpdate(
      { accountNumber: accountNumber },
      req.body,
      { new: true }
    );

    if (!updatedAccount) {
      return res
        .status(404)
        .send("No account exists with this account number!");
    }

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the account." });
  }
  return next();
};

exports.deleteAccount = async (req, res, next) => {
  const { accountNumber } = req.query;

  try {
    const account = await Account.findOneAndDelete({ accountNumber });
    if (!account) {
      return res
        .status(404)
        .send("No account exists with this account number!");
    }

    res.status(200).send("Account has been deleted successfully!");
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
  return next();
};
