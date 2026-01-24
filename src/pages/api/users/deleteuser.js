// src/pages/api/users/deleteuser.js
import dbConnect from '@/lib/mongoose';
import User from "@/models/User";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    await dbConnect();

    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "User ID required" });

    try {
        await User.findByIdAndUpdate(id, {
        isDeleted: true,
        // updatedAt: new Date(),  
        deletedAt: new Date()
     });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}




