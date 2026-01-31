import dbConnect from "@/lib/mongoose";
import CustomerSubscription from "@/models/CustomerSubscription";
import Plan from "@/models/Plan";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 🔐 Admin auth
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();

    const today = new Date();
    const next15Days = new Date();
    next15Days.setDate(today.getDate() + 15);

    const subscriptions = await CustomerSubscription.find();

    // ---- COUNTS ----
    const totalCustomers = new Set(subscriptions.map((s) => s.mobile)).size;

    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === "APPROVED",
    ).length;

    const pendingApprovals = subscriptions.filter(
      (s) => s.status === "PENDING",
    ).length;

    const expiredSubscriptions = subscriptions.filter(
      (s) => s.expiryDate && s.expiryDate < today,
    ).length;

    const expiringSoon = subscriptions.filter(
      (s) =>
        s.expiryDate && s.expiryDate >= today && s.expiryDate <= next15Days,
    ).length;

    // ---- PLAN WISE COUNTS ----
    const plans = await Plan.find({ isActive: true });

    const planStats = plans.map((plan) => {
      const count = subscriptions.filter(
        (s) => String(s.planId) === String(plan._id),
      ).length;

      return {
        planId: plan._id,
        planName: plan.planName,
        subscriberCount: count,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeSubscriptions,
        pendingApprovals,
        expiringSoon,
        expiredSubscriptions,
        plans: planStats,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
