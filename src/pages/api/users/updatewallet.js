// src/pages/api/users/updatewallet.js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { userId, type, walletAmount, remarks } = req.body;

    if (!userId || !walletAmount || !type || !remarks?.trim()) {
      return res.status(400).json({
        message:
          "Missing required fields (userId, type, walletAmount, remarks)",
      });
    }

    const amount = Number(walletAmount);

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // CREDIT
    if (type === "credit") {
      user.walletAmount += amount;
    }

    // DEBIT
    if (type === "debit") {
      if (user.walletAmount < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      user.walletAmount -= amount;
    }

    await user.save({ validateBeforeSave: false });

    // Log transaction
    const transaction = await Transaction.create({
      refId: Date.now().toString(),
      userId: user._id,
      name: user.fullName,
      phone: user.phone,
      amount: walletAmount,
      walletAmount: user.walletAmount,
      type,
      scenario: "Admin Wallet Recharge",
      remarks,
      status: "success",
    });
    console.log("Transaction", transaction);
    console.log("Wallet updated", user.walletAmount);
    return res.status(200).json({
      message: "Wallet updated",
      walletAmount: user.walletAmount,
      transaction,
    });

  } catch (error) {
    console.error("Error updating wallet:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
