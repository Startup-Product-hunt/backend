const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    // price snapshot at time of purchase (protects against future price changes)
    amount: { type: Number, required: true },   // in smallest currency unit if gateway uses that
    currency: { type: String, default: 'INR' },

    // Gateway info
    provider: { type: String, enum: ['stripe', 'razorpay'], required: true },
    providerOrderId: { type: String },   // e.g., Razorpay order_id or Stripe PaymentIntent id
    providerPaymentId: { type: String }, // final payment id
    providerSignature: { type: String }, // for Razorpay verify

    status: {
      type: String,
      enum: ['created', 'pending', 'paid', 'failed', 'refunded', 'canceled'],
      default: 'created'
    },
    errorMessage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
