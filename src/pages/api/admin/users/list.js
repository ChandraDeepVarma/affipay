import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "GET")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        await dbConnect();

        const users = await User.find({isDeleted : false, isAdmin : false}).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, users });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
