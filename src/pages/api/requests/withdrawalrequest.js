// src/pages/api/requests/withdrawalrequest.js
import dbConnect from "@/lib/mongoose";
import Withdrawal from "@/models/Withdrawal";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false });
  }

  const withdrawals = await Withdrawal.find()
    .sort({ createdAt: -1 })
    .populate("customerId", "fullName email phone")
    .lean();

  const formatted = withdrawals.map((w) => ({
    _id: w._id,
    transactionId: w.transactionId,
    amount: w.amount,
    status: w.status,
    createdAt: w.createdAt,
    requestedAt: w.requestedAt,
    processedAt: w.processedAt,
    updatedAt: w.updatedAt,
    utrNumber: w.utrNumber,
    FullName: w.customerId?.fullName || "-",
    email: w.customerId?.email || "-",
    phone: w.customerId?.phone || "-",
    customerId: w.customerId,
  }));

  return res.json(formatted);
}
