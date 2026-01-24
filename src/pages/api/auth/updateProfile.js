import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, email, phone, profileImage } = req.body;

    // Find the user
    const user = await User.findById(session.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    if (profileImage && (profileImage.url || profileImage.name)) {
      user.profileImage = {
        url: profileImage.url || user.profileImage?.url || null,
        name: profileImage.name || user.profileImage?.name || null,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
