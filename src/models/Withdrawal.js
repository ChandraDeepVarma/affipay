import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    transactionId: { type: String, default: null },

    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date, default: null },

    // Admin filled
    utrNumber: { type: String, default: null },
    // Bank snapshot (IMPORTANT)
    paymentDetails: {
      upiId: { type: String, default: null },
      bankAccount: { type: String, default: null },
      ifscCode: { type: String, default: null },
      accountHolderName: { type: String, default: null },
      bankName: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Withdrawal ||
  mongoose.model("Withdrawal", withdrawalSchema);
