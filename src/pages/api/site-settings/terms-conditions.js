// pages/api/site-settings/terms-conditions.js
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const settings = await SiteSettings.findOne({}, "termsConditions");

      if (!settings || !settings.termsConditions) {
        return res.status(404).json({
          success: false,
          message: "Terms & Conditions not found",
        });
      }

      return res.status(200).json({
        success: true,
        termsConditions: settings.termsConditions,
      });
    }

    if (req.method === "POST") {
      const { termsConditions } = req.body;

      if (!termsConditions || typeof termsConditions !== "string") {
        return res.status(400).json({
          success: false,
          message: "Terms & Conditions content is required",
        });
      }

      let settings = await SiteSettings.findOne({});
      if (!settings) {
        settings = new SiteSettings({ termsConditions });
      } else {
        settings.termsConditions = termsConditions;
      }
      await settings.save();

      return res.status(200).json({
        success: true,
        message: "Terms & Conditions updated",
        termsConditions: settings.termsConditions,
      });
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Terms & Conditions API Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
