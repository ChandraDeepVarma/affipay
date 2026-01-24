import mongoose from "mongoose";

const SlabSchema = new mongoose.Schema({
  from: Number,
  to: Number,
  reward: Number,
});

const ReferralSchema = new mongoose.Schema({
  count: Number,
  amount: Number,
  gift: String,
});

const PlanSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    earningType: {
      type: String,
      enum: ["limited", "unlimited"],
      default: "limited",
    },
    captchaPerDay: Number,
    minimumEarningPerDay: Number,

    slabs: [SlabSchema],
    referrals: [ReferralSchema],
    referralPerLogin: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    manualPaymentQrCode: { type: String, default: "" },
    manualPaymentInstructions: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
