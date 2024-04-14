const {
  FormateData,
  PublishMessage,
  ValidatePassword,
  GenerateSignature,
} = require("../utils");
const Auth = require("../db/models/authModel");
const { NOTIFICATION_SERVICE } = require("../config");

class AuthService {
  constructor(channel) {
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

      //Send a notification to the notification service
      PublishMessage(
        this.channel,
        NOTIFICATION_SERVICE,
        JSON.stringify({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
          },
          event: "CREATE_USER",
        })
      );

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
    console.log("test");
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
        id: user.userId,
        role: user.role,
      });

      const userInfo = {
        id: user.userId,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role,
      };

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

  updateUser = async (authInputs) => {
    const {
      userId,
      email,
      password,
      firstname,
      lastname,
      role = "user",
    } = authInputs;

    try {
      const user = await Auth.findOne({ userId });

      if (!user)
        return FormateData({
          msg: "No account exists with this email !",
          statusCode: 404,
        });
      await Auth.findByIdAndUpdate(user._id, { email, password, role });

      //Send a notification to the notification service
      PublishMessage(
        this.channel,
        NOTIFICATION_SERVICE,
        JSON.stringify({
          data: {
            firstname: firstname,
            lastname: lastname,
            email: email,
          },
          event: "UPDATE_USER",
        })
      );
    } catch (error) {
      console.error("Error in updateUser:", error);
      return FormateData({
        msg: "Internal server error",
        statusCode: 500,
      });
    }
  };

  deleteUser = async (authInputs) => {
    try {
      const { userId } = authInputs;
      const user = await Auth.findOne({ userId });

      if (!user)
        return FormateData({
          msg: "No account exists with this email !",
          statusCode: 404,
        });

      await Auth.findByIdAndDelete(user._id);
      return FormateData({
        msg: "User deleted successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error in deleteUser:", error);
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
      case "CREATE_USER":
        this.createAuth(data);
        break;
      case "UPDATE_USER":
        this.updateUser(data);
        break;
      case "DELETE_USER":
        this.deleteUser(data);
        break;
      default:
        break;
    }
  };
}

module.exports = AuthService;
