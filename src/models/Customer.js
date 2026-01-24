import mongoose from "mongoose";

const CustomerSlabSchema = new mongoose.Schema(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    reward: { type: Number, required: true },
  },
  { _id: false }
);

const CustomerReferralSchema = new mongoose.Schema(
  {
    count: { type: Number, required: true },
    amount: { type: Number, required: true },
    gift: { type: String },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    // Personal details
    fullName: { type: String, trim: true }, // from UI
    email: { type: String, trim: true },
    phone: { type: String, default: null },
    phoneVerified: { type: Boolean, default: false },
    otp: { type: Number, default: null },
    otpExpiryAt: { type: Number, default: null },

    pinCode: { type: String, default: null }, // from UI
    city: { type: String, default: null },
    addressLine1: { type: String },
    addressLine2: { type: String },

    password: { type: String },
    dob: { type: Date, default: null }, // from UI
    tshirtSize: { type: String, default: null },
    gender: { type: String, default: null },
    profileImage: {
      url: { type: String, default: null },
      name: { type: String, default: null },
    },

    // Active / Inactive from UI dropdown
    isActive: { type: Boolean, default: true },
    walletAmount: {
      type: Number,
      default: 0,
    },

    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // Bank / Payment details (optional)
    upiId: { type: String }, // from UI
    bankAccount: { type: String },
    ifscCode: { type: String },
    accountHolderName: { type: String },
    bankName: { type: String },

    // Subscription Plan details
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    planName: { type: String, default: null },
    planPrice: { type: Number, default: 0 },

    earningType: {
      type: String,
      enum: ["limited", "unlimited"],
      default: "limited",
    },

    captchaPerDay: { type: Number, default: 0 },
    minimumEarningPerDay: { type: Number, default: 0 },

    referralPerLogin: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    referralRewarded: { type: Boolean, default: false },
    referralStatus: {
      totalReferred: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
      bonusAmount: { type: Number, default: 0 },
      milestonesAchieved: { type: [String], default: [] }, // [10, 20]
    },

    slabs: { type: [CustomerSlabSchema], default: [] },
    referrals: { type: [CustomerReferralSchema], default: [] },

    subscriptionStatus: {
      type: String,
      enum: ["none", "active"],
      default: "none",
    },

    razorpayPaymentId: { type: String, default: null },

    lastSettledDay: { type: String, default: null },
    lastSettledPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    profileUpdated: { type: Boolean, default: false },
    bankDetailsUpdated: { type: Boolean, default: false },
    referralLocked: { type: Boolean, default: false },

    // ---- Slab Progress Tracking ----
    currentLevel: {
      type: Number,
      default: 1, // Level 0 = no slab completed
    },

    completedSlabs: [
      {
        slabIndex: { type: Number }, // 1,2...
        creditedAmount: { type: Number },
        day: { type: String }, // YYYY-MM-DD
      },
    ],

    claimedGifts: [
      {
        planName: { type: String },
        milestoneCount: { type: Number },
        giftName: { type: String },
        status: {
          type: String,
          enum: ["pending", "delivered"],
          default: "pending",
        },
        claimedAt: { type: Date, default: Date.now },
      },
    ],
    onHoldWalletAmount: { type: Number, default: 0 },
    totalWithdrawnAmount: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
    lastLoginInfo: {
      ip: { type: String, default: null },
      city: { type: String, default: null },
      device: { type: String, default: null },
    }
  },
  { timestamps: true }
);
customerSchema.index({ lastLoginAt: -1 });
customerSchema.index({ planId: 1, deleted: 1, createdAt: -1 });
customerSchema.index({ lastLoginAt: 1 });

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
