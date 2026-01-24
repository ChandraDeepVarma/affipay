// src/models/Faq.js
import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    display_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Faq || mongoose.model("Faq", FaqSchema);