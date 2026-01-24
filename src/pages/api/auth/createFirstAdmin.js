import dbConnect from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const email = "admin@captcha2cash.com";
  const name = "Admin";
  const password = "12345678";
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const phone = "1234567890";

  try {
    const existingUser = await User.findOne({ email, isAdmin: true });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }
    // Create the admin user
    const userData = new User({
      name,
      email,
      password,
      hash,
      phone,
      salt,
      isAdmin: true,
      isActive: true,
    });

    await userData.save();
    res.status(200).json({
      success: true,
      message: "✅ Admin created successfully",
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
