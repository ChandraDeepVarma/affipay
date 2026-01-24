import mongoose from "mongoose";
import Customer from "@/models/Customer";
import Plan from "@/models/Plan";
const ManualSubscriptionRequestSchema = new mongoose.Schema(
    {
        // User info
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        // Plan info
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },

        planName: String,
        planPrice: Number,

        // Payment info
        utrNumber: {
            type: String,
            required: true,
            trim: true,
        },

        paymentScreenshotBase64: {
            type: String, // optional (if you add screenshot upload later)
            default: null,
        },

        // Status flow
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },

        adminRemarks: {
            type: String,
            default: null,
        },

        // Activation tracking
        activatedAt: {
            type: Date,
            default: null,
        },

        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "usersubscriptions",
            default: null,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

export default mongoose.models.ManualSubscriptionRequest ||
    mongoose.model("ManualSubscriptionRequest", ManualSubscriptionRequestSchema);
