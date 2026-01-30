import dbConnect from "@/lib/mongoose";
import UserSubscription from "@/models/CustomerSubscription";
import Customer from "@/models/Customer";
import Plan from "@/models/Plan";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const subscriptions = await UserSubscription.find()
      .populate("userId", "fullName email phone")
      .populate("planId", "planName price")
      .sort({ createdAt: -1 });

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
