const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/paymentAccountController");

router.use(protect);
router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
