import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
    await dbConnect();

    try {
        const { search = "", fromDate, toDate } = req.query;

        const query = { deleted: false };

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate + "T23:59:59");
        }

        const users = await Customer.find(query).sort({ createdAt: -1 }).lean();

        // ✅ CSV Header
        let csv =
            "Name,Email,Phone,Gender,Address,DOB,Status,Wallet,City,Current Plan,Plan Price,Plan Purchased Date,Subscription Status,Earning Type,Referral Code,Last Login At,Created At\n";

        users.forEach((u) => {
            const fullAddress = `${u.addressLine1 || ""} ${u.addressLine2 || ""}`.trim();

            csv +=
                `"${u.fullName || ""}",` +
                `"${u.email || ""}",` +
                `"${u.phone || ""}",` +
                `"${u.gender || ""}",` +
                `"${fullAddress}",` +
                `"${u.dob ? new Date(u.dob).toISOString().split("T")[0] : ""}",` +
                `"${u.isActive ? "Active" : "Inactive"}",` +
                `"${u.walletAmount || 0}",` +
                `"${u.city || ""}",` +
                `"${u.planName || ""}",` +
                `"${u.planPrice || 0}",` +
                `"${u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : ""}",` +
                `"${u.subscriptionStatus || ""}",` +
                `"${u.earningType || ""}",` +
                `"${u.referralCode || ""}",` +
                `"${u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : ""}",` +
                `"${u.createdAt ? new Date(u.createdAt).toISOString() : ""}"\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=users.csv");

        return res.status(200).send(csv);
    } catch (err) {
        console.error("CSV export error:", err);
        return res.status(500).json({ success: false });
    }
}
