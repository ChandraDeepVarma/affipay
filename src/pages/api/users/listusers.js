// src/pages/api/users/listusers.js
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const users = await User.find({
            isDeleted: false,
            isAdmin: false
        }).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}