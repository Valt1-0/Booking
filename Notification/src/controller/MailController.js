const emailConfig = require("../config/MailConfig");
const nodemailer = require('nodemailer');
const mailTemplate = require('../../assets/templates/mails')
const {FormateData } = require('../utils');

exports.sendMail = (req, res) => {
  const { email, firstname,lastname, typeOfMail} = req.body;
  let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.auth.user,
      pass: emailConfig.auth.pass,
    },
  });

  let html;
let subject;
  switch (typeOfMail) {
  case 'userCreated' :
    html = mailTemplate.userCreated(firstname, lastname);
    subject = 'Account created';
    break;
  }
 if (subject === undefined || html === undefined) {
    console.error('Type de mail non reconnu');
    return FormateData({msg: 'type of mail not recognized'}, 400);
  }

  let mailOptions = {
    from: "no-reply@iseevision.fr",
    to: email,
    subject: subject,
    html: html,
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