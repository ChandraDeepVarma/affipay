import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      scenario = "All",
      status = "All",
      deliveryStatus = "All",
      fromDate,
      toDate,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    /* ===============================
       Search filter
    =============================== */
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { phone: { $regex: search.trim(), $options: "i" } },
        { refId: { $regex: search.trim(), $options: "i" } },
      ];
    }

    /* ===============================
       Scenario filter
    =============================== */
    if (scenario && scenario !== "All") {
      query.scenario = scenario;
    }

    /* ===============================
       Status filter
    =============================== */
    if (status && status !== "All") {
      query.status = status;
    }

    /* ===============================
       Delivery Status filter
    =============================== */

    if (deliveryStatus && deliveryStatus !== "All") {
      query.giftDeliveryStatus = deliveryStatus;
    }

    /* ===============================
       Date filter (IST safe)
    =============================== */
    if (fromDate || toDate) {
      query.createdAt = {};

      if (fromDate) {
        query.createdAt.$gte = new Date(`${fromDate}T00:00:00.000+05:30`);
      }

      if (toDate) {
        query.createdAt.$lte = new Date(`${toDate}T23:59:59.999+05:30`);
      }
    }

    const skip = (page - 1) * limit;

    /* ===============================
       Parallel DB operations
    =============================== */
    const [transactions, total, scenarios, statuses] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Transaction.countDocuments(query),

      Transaction.distinct("scenario"),

      Transaction.distinct("status"),
    ]);

    /* ===============================
       Final response
    =============================== */
    return res.status(200).json({
      success: true,
      data: transactions,
      scenarios: scenarios.filter(Boolean).sort(),
      statuses: statuses.filter(Boolean).sort(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("All Transactions API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
