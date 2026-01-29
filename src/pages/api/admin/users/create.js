import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const {
      name,
      email,
      phone,
      password,

      dob,
      gender,
      addressLine1,
      addressLine2,
      city,
      pinCode,

      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      joiningDate,
      remarks,
      isVerified,
      isActive,
      profileImage,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const exists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (exists) {
      return res.status(400).json({ error: "Email or phone already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      hash,

      dob,
      gender,
      addressLine1,
      addressLine2,
      city,
      pinCode,

      bloodGroup,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
      },
      joiningDate,
      remarks,

      isAdmin: false,
      isVerified: Boolean(isVerified),
      isActive: Boolean(isActive),
      profileImage: profileImage || { url: null, name: null },
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
}

// import dbConnect from "@/lib/mongoose";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export default async function handler(req, res) {
//     if (req.method !== "POST")
//         return res.status(405).json({ error: "Method not allowed" });

//     try {
//         await dbConnect();
//         const {
//             fullName,
//             email,
//             phone,
//             password,
//             pinCode,
//             address,
//             dob,
//             isActive,
//             upiId,
//             bankAccount,
//             ifscCode,
//             accountHolderName,
//         } = req.body;

//         // Check duplicates (email or phone)
//         const exists = await User.findOne({ $or: [{ email }, { phone }] });
//         if (exists)
//             return res
//                 .status(400)
//                 .json({ error: "Email or phone number already exists" });

//         const hashed = await bcrypt.hash(password, 10);

//         const newUser = await User.create({
//             fullName,
//             email,
//             phone,
//             password: hashed,
//             pinCode,
//             address,
//             dob,
//             isActive,
//             upiId,
//             bankAccount,
//             ifscCode,
//             accountHolderName,
//         });

//         return res.status(201).json({
//             success: true,
//             data: newUser,
//             message: "User created successfully",
//         });
//     } catch (err) {
//         return res.status(500).json({ error: err.message || "Server error" });
//     }
// }
