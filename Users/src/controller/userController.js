const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

exports.getAllUsers = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur est autorisé à accéder à la liste des utilisateurs
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res
        .status(403)
        .send("You are not authorized to access this resource!");
    }

    const users = await User.find()
      .select("-password -__v")
      .limit(10)
      .sort({ _id: -1 });

    const usersInfo = users.map((user) => ({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }));

    res.status(200).json(usersInfo);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).send("An error occurred while fetching users");
  }
};

exports.getUser = async (req, res, next) => {
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

    const user = await User.findById(userId).select("-password -__v");
    if (!user) return res.status(404).send("No account exists with this ID!");

    const userInfo = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).send("Internal server error!");
  }
  return next();
};


exports.registerUser = async (req, res, next) => {
  const { firstname, lastname, email, phone, role, password } = req.body;

  const isNewUser = await User.emailAlreadyUse(email);
  if (!isNewUser)
    return res.status(409).send("User Already Exist. Please Login");

  const user = await User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    phone: phone,
    role: role,
    password: password,
  });

  await user.save();

  const userInfo = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    password: user.password,
  };

  res.status(200).json(userInfo);
  return next();
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("No account exists with this email!");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send("Email/password does not match!");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const userInfo = {
      id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    };

    // Supprimer le token précédent de l'en-tête de la réponse s'il existe
    res.removeHeader("Authorization");
    // Ajouter le token dans l'en-tête de la réponse
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({ user: userInfo, token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).send("Internal server error!");
  }
};

exports.updateUser = async (req, res, next) => {
  const { firstname, lastname, email, role, phone } = req.body;
  const userId = req.user._id; // Récupérer l'ID de l'utilisateur actuel

  let id = req.query.id;

  try {
    // Vérifier si l'utilisateur est autorisé à effectuer la mise à jour
    if (
      req.user.role !== "admin" &&
      req.user.role !== "employee" &&
      userId !== id
    ) {
      return res
        .status(403)
        .send("You are not authorized to update this user.");
    }

    const isNewUser = await User.emailAlreadyUse(email);
    if (!isNewUser)
      return res.status(409).send("User Already Exist. Please Login");

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        role: role,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "An error occurred while updating the user.",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { email } = req.query;
  const userId = req.user._id;

  if (email != undefined) {
    try {
      if (id !== undefined) {
        if (
          id !== userId &&
          req.user.role !== "admin" &&
          req.user.role !== "employee"
        ) {
          return res
            .status(403)
            .send("You cannot delete an account other than your own");
        }
      }
      const user = await User.findOneAndDelete({ email: email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("Account is now deleted !");
    } catch (error) {
      return res.status(500).send("Server error: " + error.message);
    }
  } else {
    return res.status(400).send("Please provide an email");
  }
  return next();
};
