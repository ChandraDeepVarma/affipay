// src/pages/api/customers/updateuser/[id].js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";
import crypto from "crypto";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const {
    fullName,
    email,
    phone,
    phoneVerified,
    pinCode,
    addressLine1,
    addressLine2,
    city,
    dob,
    tshirtSize,
    gender,
    isActive,

    // optional password
    password,

    // banking fields
    upiId,
    bankAccount,
    ifscCode,
    accountHolderName,

    referralCode,
    referralName,

    profileImage,
  } = req.body;

  try {
    const existing = await Customer.findById(id);
    if (!existing) return res.status(404).json({ error: "User not found" });

    // EMAIL CHECK
    if (email && email !== existing.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    // PHONE CHECK
    if (phone && phone !== existing.phone) {
      const phoneExists = await Customer.findOne({ phone });
      if (phoneExists) {
        return res.status(409).json({ error: "Phone already exists" });
      }
    }

    // handle password update
    let salt = existing.salt;
    let hash = existing.password;

    if (password) {
      salt = crypto.randomBytes(16).toString("hex");
      hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
    }

    // Resolve Referral
    let referrerId = existing.referredByCode; // Default to existing
    if (referralName) {
      const referrer = await Customer.findOne({ fullName: referralName });
      if (referrer) {
        referrerId = referrer._id;
      }
    }

    const updated = await Customer.findByIdAndUpdate(
      id,
      {
        fullName,
        email,
        phone,
        phoneVerified,
        pinCode,
        addressLine1,
        addressLine2,
        city,
        dob,
        tshirtSize,
        gender,
        isActive,
        profileImage,

        password: hash,
        salt,

        upiId,
        bankAccount,
        ifscCode,
        accountHolderName,

        city,
        referralCode,
        referralName: referrerId,
        referredByCode: referrerId,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    console.log("UPDATE USER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
