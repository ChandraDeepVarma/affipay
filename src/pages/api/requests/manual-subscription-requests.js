import dbConnect from "@/lib/mongoose";
import ManualSubscriptionRequest from "@/models/ManualSubscriptionRequest";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const requests = await ManualSubscriptionRequest.find()
            .sort({ createdAt: -1 })
            .populate("userId", "fullName email phone")
            .populate("planId", "planName price")
            .lean();

        const data = requests.map(r => ({
            id: r._id,

            user: {
                id: r.userId?._id,
                name: r.userId?.fullName || "-",
                email: r.userId?.email || "-",
                phone: r.userId?.phone || "-",
            },

            plan: {
                id: r.planId?._id,
                name: r.planName || r.planId?.planName,
                price: r.planPrice || r.planId?.price,
            },

            utrNumber: r.utrNumber,
            screenshot: r.paymentScreenshotBase64,

            status: r.status,
            adminRemarks: r.adminRemarks,
            activatedAt: r.activatedAt,

            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }));

        return res.status(200).json({ success: true, data });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
