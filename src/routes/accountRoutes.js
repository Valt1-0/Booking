const express = require("express");

const {
  getAccount,
  getAllAccounts,
  getAccountsByUserId,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controller/accountController");
const { isAuth } = require("../middleware/auth");


const router = express.Router();

router.get("/get",isAuth, getAccount);
router.get("/getUserAccounts",isAuth, getAccountsByUserId);
router.get("/getAll",isAuth, getAllAccounts);
router.post("/create",isAuth, createAccount);
router.put("/update",isAuth, updateAccount);
router.delete("/delete",isAuth, deleteAccount);

module.exports = router;
