const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getIncome,
  createIncome,
  deleteIncome,
} = require("../controllers/incomeController");

router.use(protect);
router.get("/", getIncome);
router.post("/", createIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
