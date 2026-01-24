// src/pages/api/customers/restoreuser.js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbConnect();

  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "User ID required" });

  try {
    await Customer.findByIdAndUpdate(id, {
      deleted: false,
      deletedAt: null, // reset deleted date
      updatedAt: new Date(),
    });
    res.status(200).json({ message: "User restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
