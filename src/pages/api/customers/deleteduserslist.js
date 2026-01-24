// src/pages/api/customers/deleteduserslist.js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const deletedUsers = await Customer.find(
        { deleted: true },
        "fullName email phone isActive deletedAt"
      ).sort({ updatedAt: -1 });
      res.status(200).json(deletedUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ message: "Customer ID is required" });
      }
      const deletedCustomer = await Customer.findByIdAndDelete(id);
      if (!deletedCustomer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json({ message: "Customer permanently deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ message: "Method not allowed" });
}
