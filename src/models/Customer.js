import mongoose from "mongoose";

const CustomerSlabSchema = new mongoose.Schema(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    reward: { type: Number, required: true },
  },
  { _id: false },
);

const CustomerReferralSchema = new mongoose.Schema(
  {
    count: { type: Number, required: true },
    amount: { type: Number, required: true },
    gift: { type: String },
  },
  { _id: false },
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
    gender: { type: String, default: null },
    profileImage: {
      url: { type: String, default: null },
      name: { type: String, default: null },
    },

    // Active / Inactive from UI dropdown
    isActive: { type: Boolean, default: true },
    

    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // Bank / Payment details (optional)
    upiId: { type: String }, // from UI
    bankAccount: { type: String },
    ifscCode: { type: String },
    accountHolderName: { type: String },
    bankName: { type: String },

    
    

   
    profileUpdated: { type: Boolean, default: false },
    bankDetailsUpdated: { type: Boolean, default: false },

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

    lastLoginAt: { type: Date, default: null },
    lastLoginInfo: {
      ip: { type: String, default: null },
      city: { type: String, default: null },
      device: { type: String, default: null },
    },
  },
  { timestamps: true },
);
customerSchema.index({ lastLoginAt: -1 });
customerSchema.index({ deleted: 1, createdAt: -1 });
customerSchema.index({ lastLoginAt: 1 });

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
