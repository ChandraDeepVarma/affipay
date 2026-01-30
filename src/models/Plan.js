import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    price: { type: Number, required: true },

    validityDays: {
      type: Number,
      required: true,
      min: 30,
      max: 360,
    },

    benefits: {
      type: [String],
      default: [],
    },

    overview: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
