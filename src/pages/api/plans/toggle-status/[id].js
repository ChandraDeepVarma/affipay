import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export default async function handler(req, res) {
    if (req.method !== "PATCH")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        await dbConnect();
        const { id } = req.query;

        const plan = await Plan.findById(id);
        if (!plan) return res.status(404).json({ error: "Plan not found" });

        const newStatus = !plan.isActive;

        plan.isActive = newStatus;
        await plan.save();

        return res.status(200).json({
            success: true,
            message: `Plan ${newStatus ? "activated" : "deactivated"} successfully`,
            isActive: newStatus,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
