import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbConnect();
    const { id } = req.query;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
