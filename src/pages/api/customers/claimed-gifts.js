import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // GET: Fetch all claimed gifts
  if (method === "GET") {
    try {
      // Find all customers who have at least one claimed gift using dot notation query or just filter after
      // We want to unwind relevant data.
      const customers = await Customer.find({
        claimedGifts: { $exists: true, $not: { $size: 0 } },
      })
        .select("fullName phone claimedGifts")
        .sort({ "claimedGifts.claimedAt": -1 });

      // Flatten the data for easier consumption by the frontend table
      let allClaims = [];
      customers.forEach((customer) => {
        if (customer.claimedGifts && customer.claimedGifts.length > 0) {
          customer.claimedGifts.forEach((gift) => {
            allClaims.push({
              customerId: customer._id,
              customerName: customer.fullName,
              customerPhone: customer.phone,
              giftId: gift._id,
              planName: gift.planName,
              milestoneCount: gift.milestoneCount,
              giftName: gift.giftName,
              status: gift.status,
              claimedAt: gift.claimedAt,
            });
          });
        }
      });

      // Sort by claimedAt descending
      allClaims.sort((a, b) => new Date(b.claimedAt) - new Date(a.claimedAt));

      return res.status(200).json({ success: true, data: allClaims });
    } catch (error) {
      console.error("Error fetching claimed gifts:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // PUT: Update status to delivered
  if (method === "PUT") {
    const { customerId, giftId, status } = req.body;

    if (!customerId || !giftId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found" });
      }

      // Find the specific gift subdocument
      const gift = customer.claimedGifts.id(giftId);
      if (!gift) {
        return res
          .status(404)
          .json({ success: false, message: "Gift record not found" });
      }

      gift.status = status;
      await customer.save();

      return res
        .status(200)
        .json({ success: true, message: "Status updated successfully" });
    } catch (error) {
      console.error("Error updating gift status:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
