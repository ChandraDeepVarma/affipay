import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export default async function handler(req, res) {
    if (req.method !== "DELETE")
        return res.status(405).json({ error: "Method Not Allowed" });

    try {
        await dbConnect();
        const { id } = req.query;

        const deleted = await Plan.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: "Plan not found" });

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
