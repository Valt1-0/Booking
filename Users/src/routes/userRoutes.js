const express = require("express");

const {
  getAllUsers,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:userId", getUser);
// router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;
