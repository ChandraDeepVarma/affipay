import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import Customer from "@/models/Customer";
import UserSubscription from "@/models/UserSubscription";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Set CORS headers for POST as well
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const {
      userId,
      amount,
      type,
      scenario,
      paymentId,
      subscriptionId,
      status,
      remarks,
      planId,
      orderId,
      razorpay_payment_id,
      razorpay_subscription_id,
    } = req.body;

    // Support both direct and razorpay naming conventions
    const effectivePaymentId = paymentId || razorpay_payment_id;
    const effectiveSubscriptionId = subscriptionId || razorpay_subscription_id;

    if (!userId || !amount || !type) {
      return res.status(400).json({
        message: "Missing required fields (userId, amount, type)",
      });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. CHECK IF TRANSACTION ALREADY EXISTS (Single Record Approach)
    let transaction;
    if (effectivePaymentId) {
      transaction = await Transaction.findOne({
        userId: user._id,
        $or: [
          { paymentId: effectivePaymentId },
          { subscriptionId: effectiveSubscriptionId },
        ],
      });
    }

    if (transaction) {
      // UPDATE EXISTING
      transaction.status = status || transaction.status;
      transaction.remarks = remarks || transaction.remarks;
      if (planId) transaction.planId = planId;
      if (effectivePaymentId) transaction.paymentId = effectivePaymentId;
      if (effectiveSubscriptionId)
        transaction.subscriptionId = effectiveSubscriptionId;
      await transaction.save();
    } else {
      // CREATE NEW
      const transactionData = {
        refId: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: user._id,
        name: user.fullName || "Unknown",
        phone: user.phone || "",
        amount: Number(amount),
        walletAmount: user.walletAmount,
        type,
        scenario: scenario || "general",
        paymentId: effectivePaymentId,
        subscriptionId: effectiveSubscriptionId,
        planId: planId,
        status: status || "pending",
        remarks,
        orderId : orderId || null,
      };
      transaction = await Transaction.create(transactionData);
    }

    let subscriptionCreated = false;

    // AUTO-UPDATE CUSTOMER PLAN AND CREATE SUBSCRIPTION RECORD IF SUCCESSFUL (UPGRADE)
    const isSubscription =
      scenario && scenario.toLowerCase() === "subscription";
    const isSuccess = status && status.toLowerCase() === "success";

    if (isSubscription && isSuccess && planId) {
      // Prevent duplicate subscription records for the same transaction
      const existingSub = await UserSubscription.findOne({
        transactionId: transaction._id,
      });

      if (!existingSub) {
        // Create formal subscription record (Upgrade)
        await UserSubscription.create({
          userId: user._id,
          planId: planId,
          transactionId: transaction._id,
          razorpaySubscriptionId: effectiveSubscriptionId,
          status: "active",
          startDate: new Date(),
          endDate: null, // No expiry for upgrades
        });
        subscriptionCreated = true;

        // Update Customer record (Permanent Plan Change)
        user.plan = planId;
        user.planExpiry = null;
        user.subscriptionStatus = "active";
        await user.save({ validateBeforeSave: false });
      }
    }

    return res.status(transaction ? 200 : 201).json({
      message: transaction
        ? "Transaction updated successfully"
        : "Transaction created successfully",
      transaction,
      subscriptionCreated,
      userUpdated: subscriptionCreated,
    });
  } catch (error) {
    console.error("Error creating/updating transaction:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
