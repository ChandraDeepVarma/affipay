import dbConnect from "@/lib/mongoose";
import { generateReferralCode } from "@/utils/referralCode";
import Customer from "@/models/Customer";
import crypto from "crypto";

async function generateUniqueReferralCode(Customer) {
  let code;
  let exists = true;

  while (exists) {
    code = generateReferralCode();
    exists = await Customer.exists({ referralCode: code });
  }

  return code;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }


  await dbConnect();

  const {
    fullName,
    email,
    phone,
    phoneVerified,
    password,
    pinCode,
    addressLine1,
    addressLine2,
    city,
    dob,
    tshirtSize,
    gender,
    isActive,

    // Banking Details
    upiId,
    bankAccount,
    ifscCode,
    accountHolderName,

    profileImage,
  } = req.body;

  // Required fields validation
  if (!fullName || !email || !phone) {
    return res.status(400).json({
      message: "Full Name, Email, and Phone are required",
    });
  }

  // Email duplication check
  const emailExists = await Customer.findOne({ email });
  if (emailExists) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Phone duplication check
  const phoneExists = await Customer.findOne({ phone });
  if (phoneExists) {
    return res.status(409).json({ message: "Phone already exists" });
  }

  // Password hashing (PBKDF2)
  // Password hashing (PBKDF2) - only if password provided
  let salt = "";
  let hash = "";
  if (password) {
    salt = crypto.randomBytes(16).toString("hex");
    hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
  }

  try {
    const newCustomer = new Customer({
      fullName,
      email,
      phone,
      phoneVerified,
      // password: hash,
      // salt,

      pinCode,
      addressLine1,
      addressLine2,
      city,
      dob,
      tshirtSize,
      gender,
      isActive: isActive ?? true,
      profileImage,

      upiId,
      bankAccount,
      ifscCode,
      accountHolderName,
    });

    if (!newCustomer.referralCode) {
      newCustomer.referralCode = await generateUniqueReferralCode(Customer);
    }
    await newCustomer.save();

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.log("Create Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
