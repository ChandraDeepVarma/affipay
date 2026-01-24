import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      fromDate,
      toDate,
      loginFilter, // last24h
      planFilter,
    } = req.query;

    const limitNum = Number(limit) || 10;
    const skip = (Number(page) - 1) * limitNum;

    const query = { deleted: false };


    /* ============================
       Search filter
    ============================ */
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    /* ============================
       Created date filter
    ============================ */
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate + "T23:59:59");
    }

    /* ============================
       Login filter
    ============================ */
    if (loginFilter) {
      const now = Date.now();
      let fromTime = null;

      switch (loginFilter) {
        case "last1h":
          fromTime = new Date(now - 1 * 60 * 60 * 1000);
          break;

        case "last24h":
          fromTime = new Date(now - 24 * 60 * 60 * 1000);
          break;

        case "last7d":
          fromTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;

        case "last30d":
          fromTime = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;

        case "never":
          query.lastLoginAt = { $exists: false };
          break;
      }

      if (fromTime) {
        query.lastLoginAt = { $gte: fromTime };
      }
    }


    /* ============================
   Plan filter
============================ */
    if (planFilter === "purchased") {
      query.planId = { $exists: true, $ne: null };
    }

    if (planFilter === "not_purchased") {
      query.$or = [
        ...(query.$or || []),
        { planId: { $exists: false } },
        { planId: null }
      ];
    }

    // Plan specific filter: plan:<planId>
    else if (planFilter?.startsWith("plan:")) {
      const planName = planFilter.replace("plan:", "");
      query.planName = planName;
    }

    /* ============================
       Total count
    ============================ */
    const total = await Customer.countDocuments(query);

    /* ============================
       Data fetch
    ============================ */
    const users = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const distinctPlanNames = await Customer.distinct("planName", {
      deleted: false,
      planName: { $ne: null, $ne: "" },
    });

    return res.json({
      success: true,
      users,
      distinctPlanNames,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Get users API error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
