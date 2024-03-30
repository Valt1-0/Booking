const { CreateChannel, SubscribeMessage } = require("../utils");
const AuthService = require("../services/auth-service");
const { validateAuth } = require("../middleware/authValidator");

module.exports = async (app) => {
  const channel = await CreateChannel();
  const service = new AuthService(channel);

  SubscribeMessage(channel, service);

  app.post("/", validateAuth ,async (req, res) => {
    const createAuth = await service.createAuth(req.body);
    res.status(createAuth.statusCode).json(createAuth.data);
  });

  app.post("/login", validateAuth, async (req, res) => {
    const loginUser = await service.loginUser(req.body);
    res.removeHeader("Authorization");
    // Ajouter le token dans l'en-tête de la réponse
    res.setHeader("Authorization", `Bearer ${loginUser.otherData?.token}`);
    res
      .status(loginUser.statusCode)
      .json({ userInfo: loginUser.data, token: loginUser.otherData?.token });
  });

  app.delete("/", async (req, res) => {
    const deleteUser = await service.deleteUser(req.params.userId);
    res.removeHeader("Authorization");
    res.status(deleteUser.statusCode).json(deleteUser);
  });
};
