import axios from "axios";
import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const { transactionId } = req.body;

        if (!transactionId) {
            return res.status(400).json({ success: false, message: "Transaction ID required" });
        }

        const settings = await SiteSettings.findOne({}).lean();

        if (!settings) {
            return res.status(500).json({ success: false, message: "Site settings not found" });
        }

        const keyId =
            settings.RAZORPAY_PAYMENT_MODE === "live"
                ? settings.RAZORPAY_KEY_ID
                : settings.RAZORPAY_TEST_KEY_ID;

        const keySecret =
            settings.RAZORPAY_PAYMENT_MODE === "live"
                ? settings.RAZORPAY_KEY_SECRET
                : settings.RAZORPAY_TEST_KEY_SECRET;

        if (!keyId || !keySecret) {
            return res.status(500).json({
                success: false,
                message: "Razorpay keys not configured in site settings",
            });
        }

        const txn = await Transaction.findById(transactionId);

        if (!txn) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        if (txn.scenario !== "subscription" || txn.status !== "pending") {
            return res.json({ success: false, message: "Invalid transaction state" });
        }

        if (!txn.orderId) {
            return res.json({ success: false, message: "Order ID missing" });
        }

        /* =======================
           Razorpay API Call
        ======================= */

        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

        const response = await axios.get(
            `https://api.razorpay.com/v1/orders/${txn.orderId}/payments`,
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
                timeout: 15000,
            }
        );

        const payments = response.data.items || [];

        if (!payments.length) {
            return res.json({ success: false, message: "No payment found yet" });
        }

        // Pick latest payment
        const payment = payments.sort((a, b) => b.created_at - a.created_at)[0];

        let newStatus = txn.status;

        if (payment.status === "captured") newStatus = "success";
        else if (payment.status === "failed") newStatus = "failed";
        else newStatus = "pending";

        /* =======================
           Update DB
        ======================= */

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(400).json({ success: false, msg: "Invalid plan" });
        }

        txn.status = newStatus;
        txn.paymentId = payment.id;
        txn.gatewayResponse = payment;
        if (newStatus === "success") {
            txn.remarks = `${plan.planName} subscription activated successfully`;
        } else if (newStatus === "failed") {
            txn.remarks = `${plan.planName} subscription payment failed`;
        } else {
            txn.remarks = `${plan.planName} subscription payment pending`;
        }

        await txn.save();

        return res.json({
            success: true,
            message: "Status refreshed",
            status: newStatus,
            razorpay_status: payment.status,
        });
    } catch (error) {
        console.error("Razorpay Recheck Error:", error?.response?.data || error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch Razorpay status",
        });
    }
}
