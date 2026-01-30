import mongoose from "mongoose";

const CustomerSubscriptionSchema = new mongoose.Schema(
  {
    // Employee who created this
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Customer info
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    city: { type: String },
    pincode: { type: String },

    // Plan info (snapshot for safety)
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    validityDays: { type: Number, required: true },

    // Payment
    paymentUTR: { type: String, required: true },
    paymentDate: { type: Date, required: true },

    remarks: { type: String },

    // Status flow
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "EXPIRED"],
      default: "PENDING",
    },

    // Admin actions (later)
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: { type: Date, default: null },

    expiryDate: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.CustomerSubscription ||
  mongoose.model("CustomerSubscription", CustomerSubscriptionSchema);

// If admin later edits plan price → old subscriptions stay correct.
