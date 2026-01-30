import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongoose";
import CustomerSubscription from "@/models/CustomerSubscription";
import Plan from "@/models/Plan";

export default async function handler(req, res) {
  try {
    // 🔐 Authenticate employee
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();

    /* =====================================================
       POST → Create new customer subscription (Employee)
    ====================================================== */
    if (req.method === "POST") {
      const {
        fullName,
        mobile,
        gender,
        address,
        city,
        pincode,
        planId,
        paymentUTR,
        paymentDate,
        remarks,
      } = req.body;

      // Basic validation
      if (!fullName || !mobile || !planId || !paymentUTR || !paymentDate) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      // Fetch & validate plan
      const plan = await Plan.findById(planId);
      if (!plan || !plan.isActive) {
        return res.status(400).json({
          message: "Invalid or inactive plan selected",
        });
      }

      // Create subscription (snapshot plan details)
      const subscription = await CustomerSubscription.create({
        employeeId: token.id,

        fullName,
        mobile,
        gender,
        address,
        city,
        pincode,

        planId: plan._id,
        planName: plan.planName,
        price: plan.price,
        validityDays: plan.validityDays,

        paymentUTR,
        paymentDate,
        remarks,

        status: "PENDING",
      });

      return res.status(201).json({
        success: true,
        data: subscription,
      });
    }

    /* =====================================================
       GET → List subscriptions created by logged-in employee
    ====================================================== */
    if (req.method === "GET") {
      const subscriptions = await CustomerSubscription.find({
        employeeId: token.id,
      }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: subscriptions,
      });
    }

    /* =====================================================
       METHOD NOT ALLOWED
    ====================================================== */
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (err) {
    console.error("CustomerSubscription API error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
