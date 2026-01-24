import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export const config = {
  api: {
    bodyParser: true, // <-- JSON-based. No FormData.
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await dbConnect();

    const {
      planName,
      price,
      earningType,
      captchaPerDay,
      minimumEarningPerDay,
      referralPerLogin,
      slabs,
      referrals,
      manualPaymentQrCode,
      manualPaymentInstructions,
    } = req.body;

    // Basic validation
    if (!planName || !price)
      return res.status(400).json({ error: "Plan name & price are required" });

    // Create document
    const doc = await Plan.create({
      planName,
      price: Number(price),
      earningType,
      captchaPerDay: Number(captchaPerDay || 0),
      minimumEarningPerDay: Number(minimumEarningPerDay || 0),
      referralPerLogin: Number(referralPerLogin || 0),
      slabs: Array.isArray(slabs) ? slabs : [],
      referrals: Array.isArray(referrals) ? referrals : [],
      manualPaymentQrCode: manualPaymentQrCode || "",
      manualPaymentInstructions: manualPaymentInstructions || "",
    });

    return res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (err) {
    console.error("Create plan error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
}
