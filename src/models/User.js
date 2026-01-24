// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    refId: { type: String, unique: true }, // Unique identifier for the user

    name: String,
    profileImage: {
      url: { type: String, default: null },
      name: { type: String, default: null },
    },
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    isAdmin: Boolean,
    isActive: Boolean,
    subscrstatus: { type: String, default: "inactive" },

    isDeleted: { type: Boolean, default: false }, // For soft delete
    deletedAt: { type: Date, default: null }, // Timestamp for soft delete
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Bank Details
    upiId: String,
    bankAccount: String,
    ifscCode: String,
    accountHolderName: String,

    walletBalance: { type: Number, default: 0 },
    walletCurrency: { type: String, default: "INR" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },
  },
  { timestamps: true, strict: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
