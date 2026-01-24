import dbConnect from "@/lib/mongoose";
import Withdrawal from "@/models/Withdrawal";
import Customer from "@/models/Customer";
import Transaction from "@/models/Transaction";
import { sendSms } from "@/utils/smsGateway";

/* ================================
   Ledger helper
================================ */
async function createTransaction({
  userId,
  amount,
  type,
  scenario,
  remarks,
  refId,
  affectWallet = true,
}) {
  const customer = await Customer.findById(userId);

  const newWallet =
    type === "credit"
      ? customer.walletAmount + amount
      : customer.walletAmount - amount;

  await Transaction.create({
    userId,
    refId,
    name: customer.fullName || customer.email || "Unknown",
    phone: customer.phone || null,
    amount,
    walletAmount: affectWallet ? newWallet : customer.walletAmount,
    type,
    scenario,
    status: "success",
    remarks,
  });

  if (affectWallet) {
    await Customer.findByIdAndUpdate(userId, {
      $inc: { walletAmount: type === "credit" ? amount : -amount },
    });
  }
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { withdrawalId, action } = req.body;

    if (!withdrawalId || !["approve", "reject"].includes(action)) {
      return res.json({ success: false, msg: "Invalid request" });
    }

    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return res.json({ success: false, msg: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.json({
        success: false,
        msg: "This withdrawal is already processed",
      });
    }

    const amount = withdrawal.amount;
    const customerId = withdrawal.customerId;

    /* ============================
       APPROVE
    ============================ */
    if (action === "approve") {
      const { utrNumber, remarks } = req.body;

      if (!utrNumber?.trim()) {
        return res.json({ success: false, msg: "UTR number is required" });
      }

      const existingUtr = await Withdrawal.findOne({
        utrNumber: utrNumber.trim(),
      });

      if (existingUtr) {
        return res.json({ success: false, msg: "UTR number already exists" });
      }

      // Ledger entry only (NO wallet change)
      await createTransaction({
        userId: customerId,
        amount,
        type: "debit",
        scenario: "withdrawal",
        remarks: remarks || "Withdrawal approved",
        refId: withdrawal.transactionId,
        affectWallet: false,
      });

      // Reduce on-hold wallet
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { onHoldWalletAmount: -amount },
      });

      await Withdrawal.findByIdAndUpdate(withdrawalId, {
        status: "approved",
        processedAt: new Date(),
        utrNumber: utrNumber.trim(),
        remarks,
      });

      /* ===== Send SMS (Approved) ===== */
      const customer = await Customer.findById(customerId).lean();

      const TEMPLATE_APPROVED = "207452";
      const today = new Date().toLocaleDateString("en-GB");

      const variables = `${customer.fullName || "User"}|${amount}|${today}`;

      const smsResult = await sendSms(
        customer.phone,
        variables,
        TEMPLATE_APPROVED
      );

      if (!smsResult.success) {
        console.error("[WITHDRAWAL APPROVE SMS FAILED]", smsResult.error);
      }

      return res.json({
        success: true,
        msg: "Withdrawal approved successfully",
      });
    }

    /* ============================
       REJECT (REFUND)
    ============================ */
    if (action === "reject") {
      // Refund to wallet
      await createTransaction({
        userId: customerId,
        amount,
        type: "credit",
        scenario: "withdrawal_refund",
        remarks: "Withdrawal rejected – refund issued",
        refId: withdrawal.transactionId,
        affectWallet: true,
      });

      // Reduce on-hold wallet
      await Customer.findByIdAndUpdate(customerId, {
        $inc: { onHoldWalletAmount: -amount },
      });

      await Withdrawal.findByIdAndUpdate(withdrawalId, {
        status: "rejected",
        processedAt: new Date(),
      });

      /* ===== Send SMS (Rejected) ===== */
      const customer = await Customer.findById(customerId).lean();

      const TEMPLATE_REJECTED = "207451";
      const variables = `${customer.fullName || "User"}|${amount}`;

      const smsResult = await sendSms(
        customer.phone,
        variables,
        TEMPLATE_REJECTED
      );

      if (!smsResult.success) {
        console.error("[WITHDRAWAL REJECT SMS FAILED]", smsResult.error);
      }

      return res.json({
        success: true,
        msg: "Withdrawal rejected and amount refunded",
      });
    }

  } catch (error) {
    console.error("Withdrawal action error:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}
