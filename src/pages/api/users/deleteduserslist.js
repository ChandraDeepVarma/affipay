// src/pages/api/users/deleteduserslist.js
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbConnect();

  try {
    const deletedUsers = await User.find(
      { isDeleted: true },
      "name email phone status deletedAt"
    ).sort({ updatedAt: -1 });
    res.status(200).json(deletedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
