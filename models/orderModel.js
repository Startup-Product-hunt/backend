const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    provider: { type: String, enum: ["stripe", "razorpay"], required: true },
    providerOrderId: {
      type: String,
    },
    providerPaymentId: {
      type: String,
    },
    providerSignature: {
      type: String,
    },

    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "refunded", "canceled"],
      default: "created",
    },
    errorMessage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
