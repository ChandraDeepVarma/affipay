import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const { transactionId, status, remarks } = req.body;

        if (!transactionId || !status || !remarks) {
            return res.status(400).json({
                success: false,
                message: "Missing data (transactionId, status, remarks required)",
            });
        }

        const allowed = ["pending", "packed", "shipped", "delivered", "cancelled", "rejected"];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const now = new Date();

        /* ============================
           1) Update Transaction
        ============================ */

        const update = {
            giftDeliveryStatus: status,
            giftDeliveryDetails: remarks,
            $push: {
                giftDeliveryHistory: { status, remarks, at: now },
            },
        };

        if (status === "shipped") update.giftShippedAt = now;
        if (status === "delivered") update.giftDeliveredAt = now;

        const txn = await Transaction.findOneAndUpdate(
            { _id: transactionId, scenario: "gift_claim" },
            update,
            { new: true }
        );

        if (!txn) {
            return res.status(404).json({ success: false, message: "Gift transaction not found" });
        }

        /* ============================
           2) Update Customer claimedGifts
        ============================ */

        await Customer.updateOne(
            {
                _id: txn.userId,
                "claimedGifts._id": txn.giftClaimId,
            },
            {
                $set: {
                    "claimedGifts.$.status": status,
                    "claimedGifts.$.updatedAt": now,
                },
            }
        );

        return res.json({ success: true, transaction: txn });

    } catch (err) {
        console.error("Gift status update error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
