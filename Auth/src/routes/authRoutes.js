const { CreateChannel, SubscribeMessage } = require("../utils");
const AuthService = require("../services/auth-service");

module.exports = async (app) => {
  const channel = await CreateChannel();
  const service = new AuthService(channel);

  SubscribeMessage(channel, service);

  app.post("/login", async (req, res) => {
    const loginUser = await service.loginUser(req.body);
    res.removeHeader("Authorization");
    // Ajouter le token dans l'en-tête de la réponse
    res.setHeader("Authorization", `Bearer ${loginUser.otherData?.token}`);
    res
      .status(loginUser.statusCode)
      .json({ userInfo: loginUser.data, token: loginUser.otherData?.token });
  });

};
