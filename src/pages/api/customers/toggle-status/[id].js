// src/pages/api/customers/toggle-status/[id].js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  if (req.method !== "PATCH")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbConnect();
    const { id } = req.query;

    const user = await Customer.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      isActive: user.isActive,
      message: user.isActive ? "User Activated" : "User Deactivated",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
