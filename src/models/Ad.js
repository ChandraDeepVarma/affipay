import mongoose from "mongoose";

const AdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["image_banner", "script_code"],
      required: true,
    },
    placement: {
      type: String,
      enum: ["top", "left", "right"],
      required: true,
    },
    imageUrl: { type: String }, // For image_banner
    websiteLink: { type: String }, // For image_banner
    scriptCode: { type: String }, // For script_code
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);
