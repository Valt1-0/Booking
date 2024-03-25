const { AUTH_SERVICE } = require("../config");
const { CreateChannel, SubscribeMessage, PublishMessage } = require("../utils");
const UserService = require("../services/user-service");

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
  app.post("/register", async (req, res) => {
    const user = await service.registerUser(req.body);
    const payload = { data: {
      firstname: req.body?.firstname,
      lastname: req.body?.lastname,
      userId: user.data?._id,
      email: req.body?.email,
      password: req.body?.password,
      role: "user",
    }, event: "CREATE_AUTH" };
    PublishMessage(channel, AUTH_SERVICE, JSON.stringify(payload));
    res.status(user.statusCode).json({userInfo : user.data});
  });


  app.put("/:userId",  async (req, res) => { 
    const user = await service.updateUser(req.body);
    res.status(user.statusCode).json(user.data);
  } );
  app.delete("/:userId", async (req, res) => { 
    const user = await service.deleteUser(req.body);
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
