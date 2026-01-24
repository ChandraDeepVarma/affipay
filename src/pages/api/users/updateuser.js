// src/pages/api/users/updateuser.js
import dbConnect from '@/lib/mongoose';
import User from "@/models/User";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    await dbConnect();

    const { _id, name, email, phone, password, isActive,pinataLimit,crustLimit,walrusLimit,destoreLimit } = req.body;
    try {
        if (!_id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Check if email already exists in a different user
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== _id) {
                return res.status(409).json({ message: "Email already exists" });
            }
        }
        // Check if phone exists on another user
        if (phone) {
            const existingPhoneUser = await User.findOne({ phone, _id: { $ne: _id } });
            if (existingPhoneUser) {
                return res.status(409).json({ message: "Phone already exists" });
            }
        }

        const updateData = {};

        // Only add fields to updateData if they exist in the request body
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (isActive !== undefined) updateData.isActive = isActive;
        // Update storage limits
        if (pinataLimit !== undefined) updateData.pinataLimit = Number(pinataLimit);
        if (crustLimit !== undefined) updateData.crustLimit = Number(crustLimit);
        if (walrusLimit !== undefined) updateData.walrusLimit = Number(walrusLimit);
        if (destoreLimit !== undefined) updateData.destoreLimit = Number(destoreLimit);

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        // Update user and return the updated document
        const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
