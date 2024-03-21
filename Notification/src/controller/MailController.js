const emailConfig = require("../../config/MailConfig");
const nodemailer = require('nodemailer');

exports.sendMail = (req, res) => {
  const { email, username, amount, senderAccountId, receiverAccountId } =
    req.body;
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.auth.user,
      pass: emailConfig.auth.pass,
    },
  });

  let mailOptions = {
    from: "no-reply@iseevision.fr",
    to: email,
    subject: "Banking Email confirmation",
    html: emailConfig.getHtml(
      username,
      amount,
      senderAccountId,
      receiverAccountId
    ),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail" });
    } else {
      console.log(
        "E-mail envoyé avec succès. Réponse du serveur :",
        info.response
      );
      res.json({ message: "E-mail envoyé avec succès" });
    }
  });
};