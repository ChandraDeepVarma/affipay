// // src/models/User.js

// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    profileImage: {
      url: { type: String, default: null },
      name: { type: String, default: null },
    },

    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },

    // Personal details
    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
      default: null,
    },

    // Address details
    addressLine1: {
      type: String,
      default: null,
    },
    addressLine2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    pinCode: {
      type: String,
      default: null,
    },

    // AUTH (bcrypt)
    hash: { type: String, required: true },

    // legacy fields – kept only to avoid breaking old data
    salt: { type: String, default: null },
    password: { type: String, default: null },

    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Employee-specific details
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      default: null,
    },

    emergencyContact: {
      name: { type: String, default: null },
      phone: { type: String, default: null },
    },

    joiningDate: { type: Date, default: null },
    remarks: { type: String, default: null },

    // Soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // Role system (for later)
    role: { type: String, default: "employee" },
    permissions: { type: [String], default: [] },

    // legacy / unused (ignore for now)
    subscrstatus: { type: String, default: "inactive" },
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
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema(
//   {
//     refId: { type: String, unique: true }, // Unique identifier for the user

//     name: String,
//     profileImage: {
//       url: { type: String, default: null },
//       name: { type: String, default: null },
//     },
//     email: { type: String, required: true, unique: true },
//     hash: { type: String, required: true },
//     salt: { type: String, required: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true, unique: true },
//     isAdmin: Boolean,
//     isActive: Boolean,
//     subscrstatus: { type: String, default: "inactive" },

//     // Employee-specific details
//     bloodGroup: {
//       type: String,
//       enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
//       default: null,
//     },

//     emergencyContact: {
//       name: { type: String, default: null },
//       phone: { type: String, default: null },
//     },

//     joiningDate: {
//       type: Date,
//       default: null,
//     },

//     remarks: {
//       type: String,
//       default: null,
//     },

//     isDeleted: { type: Boolean, default: false }, // For soft delete
//     deletedAt: { type: Date, default: null }, // Timestamp for soft delete
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },

//     // Bank Details
//     upiId: String,
//     bankAccount: String,
//     ifscCode: String,
//     accountHolderName: String,

//     walletBalance: { type: Number, default: 0 },
//     walletCurrency: { type: String, default: "INR" },
//     isVerified: { type: Boolean, default: false },
//     verificationToken: { type: String },
//     verificationTokenExpires: { type: Date },
//     resetPasswordToken: { type: String },
//     resetPasswordTokenExpires: { type: Date },
//   },
//   { timestamps: true, strict: true },
// );

// export default mongoose.models.User || mongoose.model("User", UserSchema);
