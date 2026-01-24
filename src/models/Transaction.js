// src/models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    refId: { type: String, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    paymentId: { type: String }, // Razorpay or external Payment ID
    orderId: { type: String }, // Razorpay or external Order ID
    subscriptionId: { type: String },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    name: String,
    phone: String,
    amount: Number,
    walletAmount: Number,
    type: { type: String, enum: ["credit", "debit"], required: true },
    status: {
      type: String,
      enum: ["success", "pending", "failed", "rejected"],
      default: "pending",
    },
    scenario: {
      type: String,
      default: "wallet-update",
      // Examples: 'wallet-update', 'subscription', 'withdrawal-request'
    },
    remarks: String,
    giftDeliveryStatus: {
      type: String,
      enum: ["pending", "packed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    giftDeliveryDetails: {
      type: String,
      default: null,
    },
    giftDeliveryHistory: [
      {
        status: String,        // pending | shipped | delivered
        remarks: String,
        at: Date
      }
    ],
    giftClaimId: {
      type: mongoose.Schema.Types.ObjectId,   // ✅ MUST be ObjectId
      ref: "Customer.claimedGifts",
      default: null,
      index: true,
    },
    giftShippedAt: Date,
    giftDeliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
