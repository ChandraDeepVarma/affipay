import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Plan ID is required" });
    }

    const { planName, price, validityDays, benefits, overview } = req.body;

    // ✅ Validation
    if (!planName || !price || !validityDays) {
      return res.status(400).json({
        error: "Plan name, price and validity are required",
      });
    }

    if (validityDays < 0) {
      return res.status(400).json({
        error: "Validity must be greater than 0 days",
      });
    }

    const updateDoc = {
      planName,
      price: Number(price),
      validityDays: Number(validityDays),
      benefits: Array.isArray(benefits)
        ? benefits.filter((b) => b.trim() !== "")
        : [],
      overview: overview || "",
    };

    const updated = await Plan.findByIdAndUpdate(id, updateDoc, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Plan not found" });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("Update plan error:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
}
