const { FormateData,PublishMessage } = require("../utils");
const Auth = require("../db/models/authModel");
const { NOTIFICATION_SERVICE } = require("../config");

class AuthService {
  constructor(channel)
  {
    this.channel = channel;
  }
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
        return FormateData({
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

      return FormateData({ data: newAuth });
    } catch (err) {
      console.error("Error while saving the Auth document:", err);
      return FormateData({
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
        return FormateData({
          msg: "No account exists with this email !",
          statusCode: 404,
        });

      const validPassword = await ValidatePassword(
        password,
        user.password,
        user.salt
      );

      if (!validPassword)
        return FormateData({
          msg: "Email/password does not match",
          statusCode: 401,
        });

      const token = await GenerateSignature({
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
      return FormateData({
        data: userInfo,
        token: token,
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in loginUser:", error);
      return FormateData({
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
        const payloadNotification = {
          data: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            typeOfMail: "userCreated",
          },
          event: "CREATE_USER"
        };
        //Send a notification to the notification service
        PublishMessage(
          this.channel,
          NOTIFICATION_SERVICE,
          JSON.stringify(payloadNotification)
        );
        break;
      default:
        break;
    }
  };
}

module.exports = AuthService;
