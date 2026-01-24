import mongoose from "mongoose";

const SubscriptionConfigSchema = new mongoose.Schema({
    storageProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StorageProviders",
        required: true,
    },
    // storageProviderName: {
    //   type: String,
    //   required: true,
    // },
    config: [
        {
            price: { type: Number, required: true },
            size: { type: Number, required: true },
            isActive: { type: Boolean, default: true },
        }

    ],

}, { timestamps: true });
export default mongoose.models.SubscriptionConfig || mongoose.model("SubscriptionConfig", SubscriptionConfigSchema);