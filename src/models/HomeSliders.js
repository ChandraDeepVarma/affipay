import mongoose from "mongoose";

const HomeSlidersSchema = new mongoose.Schema(
  {
    image: {
      name: { type: String },
      url: { type: String },
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.HomeSliders ||
  mongoose.model("HomeSliders", HomeSlidersSchema);
