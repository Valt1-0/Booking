const utils = require("../utils");
const Auth = require("../db/models/authModel");

class AuthService {
  createAuth = async (authInputs) => {
    const {
      userId,
      email,
      role = "user",
      password,
      firstname,
      lastname,
    } = authInputs;

    try {
      const isNewUserAuth = await Auth.findOne({ userId: userId });
      if (isNewUserAuth)
        return utils.FormateData({
          msg: "User already exists. Please log in.",
          statusCode: 409,
        });

      const newAuth = Auth({
        userId: userId,
        email: email,
        role: role,
        password: password,
        firstname,
        lastname,
      });

      await newAuth.save();

      return utils.FormateData({ data: newAuth });
    } catch (err) {
      console.error("Error while saving the Auth document:", err);
      return utils.FormateData({
        msg: "Internal Server Error",
        statusCode: 500,
      });
    }
  };

  loginUser = async (authInputs) => {
    const { email, password } = authInputs;

    try {
      const user = await Auth.findOne({ email });

      if (!user)
        return utils.FormateData({
          msg: "No account exists with this email !",
          statusCode: 404,
        });

      const validPassword = await utils.ValidatePassword(
        password,
        user.password,
        user.salt
      );

      if (!validPassword)
        return utils.FormateData({
          msg: "Email/password does not match",
          statusCode: 401,
        });

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
      //   res.removeHeader("Authorization");
      //   // Ajouter le token dans l'en-tête de la réponse
      //   res.setHeader("Authorization", `Bearer ${token}`);

      //   res.status(200).json({ user: userInfo, token });
      return utils.FormateData({
        data: userInfo,
        token: token,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in loginUser:", error);
      return utils.FormateData({
        msg: "Internal server error",
        statusCode: 500,
      });
    }
  };

  SubscribeEvents = async (payload) => {
    payload = JSON.parse(payload);

    const { event, data } = payload;

    switch (event) {
      case "CREATE_AUTH":
        this.createAuth(data);
        break;
      default:
        break;
    }
  };
}

module.exports = AuthService;
