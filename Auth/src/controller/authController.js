const Auth = require("../db/models/authModel");
const utils = require("../utils");

exports.createAuth = async (req, res) => {
  const { userId, email, role = "user", password } = req.body;
  try {
    const isNewUserAuth = await Auth.findOne({ userId: userId });
    if (isNewUserAuth)
      return res.status(409).send("User Already Exist. Please Login");

    const newAuth = Auth({
      userId: userId,
      email: email,
      role: role,
      password: password,
    });

    await newAuth.save();

    return res.status(200).json({ msg: "Auth Successfully Created" });
  } catch (err) {
    console.error("Error while saving the Auth document:", err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email });

    if (!user) {
      return res.status(401).send("No account exists with this email!");
    }

    const validPassword = await utils.ValidatePassword(
      password,
      user.password,
      user.salt
    );

    if (!validPassword) {
      return res.status(400).send("Email/password does not match!");
    }
    const token = await utils.GenerateSignature({
      email: user.email,
      userId: user.userId,
      role: user.role,
    });

    const userInfo = {
      id: user.userId,
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

exports.SubscribeEvents = async (payload) => {
  payload = JSON.parse(payload);

  const { event, data } = payload;

  console.log(event, data);
};
