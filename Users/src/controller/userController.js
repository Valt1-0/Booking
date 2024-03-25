const User = require("../db/models/userModel");
// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .limit(10)
      .sort({ _id: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).send("An error occurred while fetching users");
  }
};

// Récupérer un utilisateur par son ID
exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password -__v");
    if (!user) return res.status(404).send("No user exists with this ID!");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).send("Internal server error!");
  }
};

// Inscription d'un nouvel utilisateur
exports.registerUser = async (req, res, next) => {
  const { firstname, lastname, email, phone, password } = req.body;

  try {
    const isNewUser = await User.emailAlreadyUse(email);
    if (!isNewUser) return res.status(409).send("User already exists. Please log in.");

    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
    });

    fetch("http://localhost:3003/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id, email, password,role:"user" }),
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).send("An error occurred while registering the user.");
  }
};

// Mettre à jour les informations d'un utilisateur
exports.updateUser = async (req, res, next) => {
  const { firstname, lastname, email, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.query.id,
      { firstname, lastname, email, phone },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found.");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).send("An error occurred while updating the user.");
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res, next) => {
  const { email } = req.params;

  if (!email) return res.status(400).send("Please provide an email.");

  try {
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) return res.status(404).send("User not found.");

    res.status(200).send("User has been deleted successfully!");
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).send("An error occurred while deleting the user.");
  }
};

  exports.SubscribeEvents = async (payload) => {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    console.log(event, data);
  };
