// src/pages/api/users/adduser.js   
import dbConnect from '@/lib/mongoose';
import User from "@/models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";

export default async function handler(req, res){
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    await dbConnect();

    const { name, email, phone, password, isActive ,pinataLimit, crustLimit, walrusLimit, destoreLimit} = req.body;
    console.log("Incoming body:", req.body);
    console.log(pinataLimit,crustLimit,walrusLimit,destoreLimit)

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (pinataLimit < 0 || crustLimit < 0 || walrusLimit < 0 || destoreLimit < 0) {
        return res.status(400).json({ message: "Storage limits cannot be negative" });
    }

    // Validate password strength here
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters and contain at least one uppercase letter, one number, and one special character"
        });
    }
    try {
        // Check duplicate email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Check duplicate phone
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(409).json({ message: "Phone already exists" });
        }

        // Generate salt
        const salt = crypto.randomBytes(16).toString('hex');
        // Generate hash using salt
        const hash = crypto
            .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
            .toString('hex');

        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);
    //         pinataLimit: {type: Number,default: 0 },
    // crustLimit: {type: Number, default: 0 },
    // walrusLimit: {type: Number, default: 0 },
    // destoreLimit: {type: Number, default: 0 },

        const newUser = new User({
            name,
            email,
            phone,
            salt,
            hash,
            isActive,
            subscrstatus: "inactive", // Default subscription status
   pinataLimit: Number(pinataLimit),
crustLimit: Number(crustLimit),
walrusLimit: Number(walrusLimit),
destoreLimit: Number(destoreLimit),
        });
        console.log("new user : ",newUser)

        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}




