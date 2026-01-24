// src/pages/api/customers/deleteuser/[id].js

import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query; // pages API: params are in req.query

  if (req.method === "DELETE") {
    try {
      // soft-delete
      const user = await Customer.findByIdAndUpdate(
        id,
        { deleted: true, deletedAt: new Date() },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User moved to trash", user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.setHeader("Allow", ["DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
