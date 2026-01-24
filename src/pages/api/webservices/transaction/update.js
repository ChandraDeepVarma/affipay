import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import Customer from "@/models/Customer";
import UserSubscription from "@/models/UserSubscription";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Set CORS headers for PUT as well
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    console.log("PUT /api/webservices/transaction/update - Body:", req.body);
    const { transactionId, status, paymentId, remarks } = req.body;

    if (!transactionId || !status) {
      console.log("Update 400: Missing transactionId or status", {
        transactionId,
        status,
      });
      return res
        .status(400)
        .json({ message: "Missing transactionId or status" });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update transaction fields
    transaction.status = status;
    if (paymentId) transaction.paymentId = paymentId;
    if (remarks) transaction.remarks = remarks;
    await transaction.save();

    let subscriptionCreated = false;

    // Trigger Subscription logic ONLY if status is turning to 'success'
    const isSubscription =
      transaction.scenario &&
      transaction.scenario.toLowerCase() === "subscription";
    const isSuccess = status.toLowerCase() === "success";

    if (isSubscription && isSuccess && transaction.planId) {
      // Check if subscription already exists for this transaction to prevent duplicates
      const existingSub = await UserSubscription.findOne({
        transactionId: transaction._id,
      });

      if (!existingSub) {
        const user = await Customer.findById(transaction.userId);
        if (user) {
          // Create formal subscription record (Upgrade)
          await UserSubscription.create({
            userId: user._id,
            planId: transaction.planId,
            transactionId: transaction._id,
            razorpaySubscriptionId: transaction.subscriptionId || paymentId,
            status: "active",
            startDate: new Date(),
            endDate: null,
          });
          subscriptionCreated = true;

          // Update Customer record
          user.plan = transaction.planId;
          user.planExpiry = null;
          user.subscriptionStatus = "active";
          await user.save({ validateBeforeSave: false });
        }
      }
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
      subscriptionCreated,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
