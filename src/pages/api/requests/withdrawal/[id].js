// src/pages/api/requests/withdrawal/[id].js
import dbConnect from "@/lib/mongoose";
import Withdrawal from "@/models/Withdrawal";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  // Ensure Customer model is registered
  if (!mongoose.models.Customer) {
    console.log(
      "Customer model not found in mongoose.models, this is unexpected given the import."
    );
    // Force registration if needed, though import should have done it
    // This block is mostly for debugging or emergency patching
  } else {
    // console.log("Customer model IS registered.");
  }

  if (req.method !== "GET") return res.status(405).json({ success: false });

  const { id } = req.query;

  // Make sure to reference Customer so it's not unused
  const _c = Customer;

  try {
    const withdrawal = await Withdrawal.findById(id)
      .populate("customerId", "fullName phone email")
      .lean();

    if (!withdrawal)
      return res.json({ success: false, msg: "Withdrawal not found" });

    return res.json({
      success: true,
      data: withdrawal,
    });
  } catch (err) {
    console.error("Error in withdrawal/[id]:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
