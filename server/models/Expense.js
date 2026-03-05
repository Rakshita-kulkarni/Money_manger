const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // category = the label/type (e.g. Food, Rent, custom)
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    // description = what specifically was spent on
    description: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be positive"],
    },
    paymentAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentAccount",
      required: [true, "Payment account is required"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
