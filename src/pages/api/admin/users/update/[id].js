import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "PATCH")
        return res.status(405).json({ error: "Method not allowed" });

    try {
        await dbConnect();
        const { id } = req.query;

        const {
            fullName,
            email,
            phone,
            pinCode,
            address,
            dob,
            isActive,
            upiId,
            bankAccount,
            ifscCode,
            accountHolderName,
            password,
        } = req.body;

        // Check if email or phone already exists in another user
        const existing = await User.findOne({
            _id: { $ne: id },
            $or: [{ email }, { phone }],
        });

        if (existing)
            return res
                .status(400)
                .json({ error: "Email or phone number already exists" });

        const updates = {
            fullName,
            email,
            phone,
            pinCode,
            address,
            dob,
            isActive,
            upiId,
            bankAccount,
            ifscCode,
            accountHolderName,
        };

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true,
        });

        if (!updatedUser)
            return res.status(404).json({ error: "User not found" });

        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message || "Internal server error",
        });
    }
}
