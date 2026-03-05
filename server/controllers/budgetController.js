const Budget = require("../models/Budget");

// @desc    Get budget for logged-in user
// @route   GET /api/budget
const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ user: req.user._id });
    res.json(budget || { amount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set or update budget
// @route   POST /api/budget
const setBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id },
      {
        amount,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudget, setBudget };
