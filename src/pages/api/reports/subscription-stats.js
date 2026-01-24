import dbConnect from "@/lib/mongoose";
import UserSubscription from "@/models/UserSubscription";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const stats = await UserSubscription.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = monthNames.map((month, index) => {
      const monthData = stats.find((s) => s._id === index + 1);
      return {
        x: month,
        y: monthData ? monthData.count : 0,
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching subscription stats:", error);
    res.status(500).json({
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
