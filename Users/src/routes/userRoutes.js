const { AUTH_SERVICE } = require("../config");
const { CreateChannel, SubscribeMessage, PublishMessage } = require("../utils");
const UserService = require("../services/user-service");
const { validateUser } = require("../middleware/userValidator");
const { isAuth } = require("../middleware/auth");

module.exports = async (app) => {
  const service = new UserService();
  const channel = await CreateChannel();

  app.get("/", async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get All Users.'

    const allUser = await service.getAllUsers();
    res.status(allUser.statusCode).json(allUser.data);
  });

  app.get("/getById", async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Get user by id'
    // #swagger.parameters['userId'] = { description: 'User Id' }

    const { userId } = req.params;

    const user = await service.getUser(userId);

    res.status(user.statusCode).json({ userInfo: user.data });
  });

  app.post("/register", validateUser, async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Register an User'
    // #swagger.requestBody = {required: true,content: {"application/json": {schema: {$ref: "#/components/schemas/users"}  }}}

    const user = await service.registerUser(req.body);
    if (user.statusCode >= 200 && user.statusCode < 300) {
      const payload = {
        data: {
          firstname: req.body?.firstname,
          lastname: req.body?.lastname,
          userId: user.data?._id,
          email: req.body?.email,
          password: req.body?.password,
          role: "user",
        },
        event: "CREATE_USER",
      };
      PublishMessage(channel, AUTH_SERVICE, JSON.stringify(payload));
    }
    res.status(user.statusCode).json({ userInfo: user.data });
  });

  app.put("/update", isAuth, async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Update user.'
    // #swagger.parameters['userId'] = { description: 'User Id' }
    // #swagger.requestBody = {required: true,content: {"application/json": {schema: {$ref: "#/components/schemas/users"}  }}}

    const userInput = {
      ...req.body,
      userId: req.params.userId,
    };

    const user = await service.updateUser(userInput);
    if (user.statusCode >= 200 && user.statusCode < 300) {
      const payload = {
        data: {
          firstname: req.body?.firstname,
          lastname: req.body?.lastname,
          userId: user.data?._id,
          email: req.body?.email,
          password: req.body?.password,
          role: req.body?.role,
        },
        event: "UPDATE_USER",
      };

      PublishMessage(channel, AUTH_SERVICE, JSON.stringify(payload));
    }
    res.status(user.statusCode).json(user.data);
  });
  app.delete("/delete", async (req, res) => {
    // #swagger.tags = ['Users']
    // #swagger.description = 'Delete user.'
    // #swagger.parameters['userId'] = { description: 'User Id' }

    const userInput = {
      ...req.body,
      userId: req.params.userId,
      user: req.user,
      token: req.headers.authorization,
    };
    const user = await service.deleteUser(userInput);

    if (user.statusCode >= 200 && user.statusCode < 300) {
      const payload = {
        data: {
          userId: user.data?._id,
        },
        event: "DELETE_USER",
      };
      PublishMessage(channel, AUTH_SERVICE, JSON.stringify(payload));
      return res
        .status(res.statusCode)
        .json({ msg: "User deleted successfully" });
    }

    res.status(user.statusCode).json(user.data);
  });
};
