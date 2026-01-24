import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan";

export const config = {
  api: {
    bodyParser: true, // JSON
  },
};

export default async function handler(req, res) {
  if (req.method !== "PATCH" && req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await dbConnect();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Plan ID is required" });

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

    // Validate
    if (!planName || !price) {
      return res
        .status(400)
        .json({ error: "Plan Name and Price are required" });
    }

    // Prepare update object
    const updateDoc = {
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
    };

    // Update and return updated plan
    const updated = await Plan.findByIdAndUpdate(id, updateDoc, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Plan not found" });

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
