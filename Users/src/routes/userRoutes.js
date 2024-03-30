const { AUTH_SERVICE } = require("../config");
const { CreateChannel, SubscribeMessage, PublishMessage } = require("../utils");
const UserService = require("../services/user-service");
const { validateUser } = require("../middleware/userValidator");
module.exports = async (app) => {
  const service = new UserService();
  const channel = await CreateChannel();

  app.get("/", async (req, res) => {
    const allUser = await service.getAllUsers();
    res.status(allUser.statusCode).json(allUser.data);
  });
  app.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    const user = await service.getUser(userId);

    res.status(user.statusCode).json({ userInfo: user.data });
  });
  // router.post("/login", loginUser);
  app.post("/register", validateUser, async (req, res) => {
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

  app.put("/:userId", async (req, res) => {
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
  app.delete("/:userId", async (req, res) => {
    const userInput = {
      ...req.body,
      userId: req.params.userId,
      user: req.user,
      token: req.headers.authorization,
    };
    const user = await service.deleteUser(userInput);
    res.status(user.statusCode).json(user.data);
  });
};

//const router = express.Router();

// (async () => {
//   const channel = await CreateChannel();
//   SubscribeMessage(channel, userController);
//   // const payload = {
//   //   data: {
//   //     firstname: "test",
//   //     lastname: "test",
//   //     userId: "65ff1835a713ede92438015a",
//   //     email: "test@example.com",
//   //     password: "testdsqdsd363636dqsQDD*",
//   //     role: "user",
//   //   },
//   //   event: "CREATE_AUTH",
//   // };
//   // PublishMessage(channel, AUTH_SERVICE, JSON.stringify(payload));

//   router.get("/", getAllUsers);
//   router.get("/:userId", getUser);
//   // router.post("/login", loginUser);
//   router.post("/register", registerUser);
//   router.put("/:userId", updateUser);
//   router.delete("/:userId", deleteUser);
// })();

// module.exports = router;
