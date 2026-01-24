// src/pages/api/customers/getuser/[id].js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    // fetch only users that are NOT deleted
    const user = await Customer.findOne({ _id: id, deleted: false })
      .populate("referralName", "fullName")
      .populate("referredByCode", "referralCode");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log("GET USER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
