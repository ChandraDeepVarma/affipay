// src/modals/UserSubscription.js
import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // null for lifetime access
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserSubscription ||
  mongoose.model("UserSubscription", userSubscriptionSchema);
