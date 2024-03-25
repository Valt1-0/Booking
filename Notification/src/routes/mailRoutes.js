const mailController = require("../controller/MailController");
const { CreateChannel, SubscribeMessage } = require("../utils");
const NotificationService = require("../services/notification-service");
module.exports = async (app) => {
  const channel = await CreateChannel();
  const service = new NotificationService();

  SubscribeMessage(channel, service);
  app.post("/mail", async (req, res) => {
    const mail = await service.sendMail;
    res.status(mail.statusCode).json(mail.data);
  });
};
