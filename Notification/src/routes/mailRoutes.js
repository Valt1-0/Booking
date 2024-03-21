const express = require("express");
const mailController = require('../controller/MailController')

const router = express.Router();

router.post("/", mailController.sendMail);

module.exports = router;
