const PaymentAccount = require("../models/PaymentAccount");

// @route GET /api/accounts
const getAccounts = async (req, res) => {
  try {
    const accounts = await PaymentAccount.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/accounts
const createAccount = async (req, res) => {
  try {
    const { name, type, balance } = req.body;
    if (!name || !type) return res.status(400).json({ message: "Name and type are required" });

    const account = await PaymentAccount.create({
      user: req.user._id,
      name,
      type,
      balance: balance || 0,
    });
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/accounts/:id
const updateAccount = async (req, res) => {
  try {
    const account = await PaymentAccount.findOne({ _id: req.params.id, user: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });

    const { name, type } = req.body;
    if (name) account.name = name;
    if (type) account.type = type;
    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/accounts/:id
const deleteAccount = async (req, res) => {
  try {
    const account = await PaymentAccount.findOne({ _id: req.params.id, user: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });
    await account.deleteOne();
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };
