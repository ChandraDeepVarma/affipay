import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";
import UserSubscription from "@/models/UserSubscription";

export default async function handler(req, res) {
  try {
    await dbConnect();

    // Counts from Customer model
    const customerCounts = await Customer.aggregate([
      {
        $facet: {
          totalUsers: [{ $match: { deleted: false } }, { $count: "count" }],
          activeUsers: [
            { $match: { isActive: true, deleted: false } },
            { $count: "count" },
          ],
          inactiveUsers: [
            { $match: { isActive: false, deleted: false } },
            { $count: "count" },
          ],
          deletedUsers: [{ $match: { deleted: true } }, { $count: "count" }],
        },
      },
    ]);

    // Counts from UserSubscription model
    const subscriptionCounts = await UserSubscription.aggregate([
      {
        $facet: {
          totalSubscriptions: [{ $count: "count" }],
          activeSubscriptions: [
            { $match: { status: "active" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const cResult = customerCounts[0] || {};
    const sResult = subscriptionCounts[0] || {};

    res.status(200).json({
      totalUsers: cResult.totalUsers[0]?.count || 0,
      activeUsers: cResult.activeUsers[0]?.count || 0,
      inactiveUsers: cResult.inactiveUsers[0]?.count || 0,
      deletedUsers: cResult.deletedUsers[0]?.count || 0,
      totalSubscriptions: sResult.totalSubscriptions[0]?.count || 0,
      activeSubscriptions: sResult.activeSubscriptions[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error fetching user status counts:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
