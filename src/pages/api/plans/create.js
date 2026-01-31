import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { planName, price, validityDays, benefits, overview, isActive } = req.body;

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

    const plan = await Plan.create({
      planName,
      price: Number(price),
      validityDays: Number(validityDays),
      benefits: Array.isArray(benefits) ? benefits : [],
      overview: overview || "",
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (err) {
    console.error("Create plan error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
