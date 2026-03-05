const Expense = require("../models/Expense");
const PaymentAccount = require("../models/PaymentAccount");

// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .populate("paymentAccount", "name type")
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { amount, category, description, paymentAccount, date } = req.body;

    if (!amount || !category) {
      return res.status(400).json({ message: "Amount and category are required" });
    }

    // Deduct from account balance if account provided
    if (paymentAccount) {
      const account = await PaymentAccount.findOne({ _id: paymentAccount, user: req.user._id });
      if (!account) return res.status(404).json({ message: "Payment account not found" });
      account.balance -= parseFloat(amount);
      await account.save();
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      description: description || "",
      paymentAccount: paymentAccount || null,
      date: date || Date.now(),
    });

    const populated = await expense.populate("paymentAccount", "name type");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Restore account balance
    if (expense.paymentAccount) {
      const account = await PaymentAccount.findById(expense.paymentAccount);
      if (account) {
        account.balance += expense.amount;
        await account.save();
      }
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, createExpense, deleteExpense };
