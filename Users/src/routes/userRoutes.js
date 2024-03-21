const express = require("express");

const {
  getUser,
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/getAll", isAuth, getAllUsers);
router.get("/get", isAuth, getUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/update", isAuth, updateUser);
router.delete("/delete", isAuth, deleteUser);

module.exports = router;
