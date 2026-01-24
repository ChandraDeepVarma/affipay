// pages/api/site-settings/privacy-policy.js
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const settings = await SiteSettings.findOne({}, "privacyPolicy");

      if (!settings || !settings.privacyPolicy) {
        return res.status(404).json({
          success: false,
          message: "Privacy policy not found",
        });
      }

      return res.status(200).json({
        success: true,
        privacyPolicy: settings.privacyPolicy,
      });
    }

    if (req.method === "POST") {
      const { privacyPolicy } = req.body;

      if (!privacyPolicy || typeof privacyPolicy !== "string") {
        return res.status(400).json({
          success: false,
          message: "Privacy policy text is required",
        });
      }

      let settings = await SiteSettings.findOne({});
      if (!settings) {
        settings = new SiteSettings({ privacyPolicy });
      } else {
        settings.privacyPolicy = privacyPolicy;
      }
      await settings.save();

      return res.status(200).json({
        success: true,
        message: "Privacy policy updated",
        privacyPolicy: settings.privacyPolicy,
      });
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Privacy Policy API Error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
}
