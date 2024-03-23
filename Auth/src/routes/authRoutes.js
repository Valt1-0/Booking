const express = require("express");

const {
    createAuth,
    loginUser,
} = require("../controller/authController");

const router = express.Router();

router.post("/", createAuth);
router.post("/login", loginUser);

module.exports = router;
