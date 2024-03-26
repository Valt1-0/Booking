const User = require("../db/models/userModel");
const { FormateData } = require("../utils");
class UserService {
  getAllUsers = async (userInputs) => {
    try {
      const users = await User.find()
        .select("-__v")
        .limit(10)
        .sort({ _id: -1 });

      return FormateData({ data: users });
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };

  getUser = async (userInputs) => {
    const { userId } = userInputs;

    try {
      const user = await User.findById(userId).select("-__v");
      if (!user) return FormateData({ msg: "No user exists with this ID !" });

      return FormateData({ data: user });
    } catch (error) {
      console.error("Error in getUser:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };

  registerUser = async (userInputs) => {
    const { firstname, lastname, email, phone, password } = userInputs;

    try {
      const isNewUser = await User.emailAlreadyUse(email);
      if (!isNewUser)
        return FormateData({
          msg: "User already exists. Please log in.",
          statusCode: 409,
        });

      const user = await User.create({
        firstname,
        lastname,
        email,
        phone,
      });

      //   fetch("http://localhost:3003/", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       userId: user._id,
      //       email,
      //       password,
      //       role: "user",
      //     }),
      //   });
      return FormateData({ data: user });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };

  updateUser = async (userInputs) => {
    const { firstname, lastname, email, phone, userId } = userInputs;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        {_id: userId},
        { firstname, lastname, email, phone },
        { new: true }
      );

      if (!updatedUser)
        return FormateData({ msg: "User not found", statusCode: 404 });

      return FormateData({ data: updatedUser });
    } catch (error) {
      console.error("Error in updateUser:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };

  deleteUser = async (userInputs) => {
    const { email } = userInputs;

    if (!email)
      return FormateData({ msg: "Please provide an email.", statusCode: 400 });

    try {
      const deletedUser = await User.findOneAndDelete({ email });

      if (!deletedUser)
        return FormateData({ msg: "User not found", statusCode: 404 });

      return FormateData({ msg: "User has been deleted successfully!" });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };
}
module.exports = UserService;
