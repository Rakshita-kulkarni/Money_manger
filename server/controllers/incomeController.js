const Income = require("../models/Income");
const PaymentAccount = require("../models/PaymentAccount");

// @route GET /api/income
const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user._id })
      .populate("paymentAccount", "name type")
      .sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/income
const createIncome = async (req, res) => {
  try {
    const { amount, paymentAccount, description, date } = req.body;
    if (!amount || !paymentAccount) {
      return res.status(400).json({ message: "Amount and payment account are required" });
    }

    // Add to account balance
    const account = await PaymentAccount.findOne({ _id: paymentAccount, user: req.user._id });
    if (!account) return res.status(404).json({ message: "Payment account not found" });
    account.balance += parseFloat(amount);
    await account.save();

    const income = await Income.create({
      user: req.user._id,
      amount,
      paymentAccount,
      description: description || "",
      date: date || Date.now(),
    });

    const populated = await income.populate("paymentAccount", "name type");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/income/:id
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
    if (!income) return res.status(404).json({ message: "Income not found" });

    // Reverse the balance
    const account = await PaymentAccount.findById(income.paymentAccount);
    if (account) {
      account.balance -= income.amount;
      await account.save();
    }

    await income.deleteOne();
    res.json({ message: "Income deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIncome, createIncome, deleteIncome };
