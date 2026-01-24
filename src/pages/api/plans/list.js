import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export default async function handler(req, res) {
    if (req.method !== "GET")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        await dbConnect();
        const plans = await Plan.find().sort({ updatedAt: -1 });
        return res.status(200).json({ success: true, plans });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
