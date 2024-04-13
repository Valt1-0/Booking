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
      if (!user)
        return FormateData({
          msg: "No user exists with this ID !",
          statusCode: 404,
        });

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
        { _id: userId },
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
    const { user, userId } = userInputs;
    console.log(user);
    if (!userId)
      return FormateData({ msg: "Please provide an userId.", statusCode: 400 });

    try {
      const userDelete = await User.findById(userId);

      if (!userDelete)
        return FormateData({
          msg: "No user exists with this ID !",
          statusCode: 404,
        });
      console.log(userDelete._id, user.id, user.role);
      if (user.id !== userDelete._id.toString() && user.role !== "admin")
        return FormateData({
          msg: "You are not authorized to delete this user",
          statusCode: 401,
        });

      await User.findByIdAndDelete(userDelete._id);

      return FormateData({ data: userDelete });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      return FormateData({ msg: "Internal Server Error", statusCode: 500 });
    }
  };
}
module.exports = UserService;
