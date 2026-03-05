const mongoose = require("mongoose");

const paymentAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    // cash | upi | card
    type: {
      type: String,
      enum: ["cash", "upi", "card"],
      required: [true, "Account type is required"],
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentAccount", paymentAccountSchema);
