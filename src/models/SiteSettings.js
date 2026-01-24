// src/models/SiteSettings.js
import mongoose from "mongoose";

// socialMedia will accept ANY keys (facebook, youtube, tiktok, etc.)
const SocialMediaSchema = new mongoose.Schema(
  {
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" },
    instagram: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    telegram: { type: String, default: "" },
    threads: { type: String, default: "" },
    snapchat: { type: String, default: "" },
    reddit: { type: String, default: "" },
  },
  { _id: false, strict: false }
);

// SMTP details
const SmtpSchema = new mongoose.Schema(
  {
    host: { type: String, default: "" },
    user: { type: String, default: "" },
    pass: { type: String, default: "" },
    port: { type: String, default: "" },
  },
  { _id: false }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    // Basic info
    contact_email: { type: String, default: "" },
    contact_phone: { type: String, default: "" },
    office_address: { type: String, default: "" },
    youtube: { type: String, default: "" },

    // Content pages
    aboutUs: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
    refundPolicy: { type: String, default: "" },
    disclaimer: { type: String, default: "" },
    cookiesPolicy: { type: String, default: "" },
    termsConditions: { type: String, default: "" },

    // Social media
    socialMedia: { type: SocialMediaSchema, default: {} },

    // SMTP
    smtp: { type: SmtpSchema, default: {} },

    // Bonus System
    bonusAmount: { type: Number, default: 0 },
    bonusUserLimit: { type: Number, default: 0 },

    // Withdrawal Settings
    minWithdrawalLimit: { type: Number, default: 0 },
    otpMode: { type: String, enum: ["static", "dynamic"], default: "static" }, // static or dynamic

    RAZORPAY_KEY_ID: { type: String, default: "" },
    RAZORPAY_KEY_SECRET: { type: String, default: "" },
    RAZORPAY_TEST_KEY_ID: { type: String, default: "" },
    RAZORPAY_TEST_KEY_SECRET: { type: String, default: "" },
    RAZORPAY_PAYMENT_MODE: { type: String, enum: ["live", "test"], default: "live" }, // live or test,
    buyButtonMode: { type: String, enum: ["manual", "gateway"], default: "gateway" },
    qrPaymentVerficationMode: { type: String, enum: ["auto", "manual"], default: "manual" },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
