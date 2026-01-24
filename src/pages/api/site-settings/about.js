// pages/api/site-settings/about.js
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const settings = await SiteSettings.findOne({}, "aboutUs");

      if (!settings || !settings.aboutUs) {
        return res.status(404).json({
          success: false,
          message: "About Us content not found",
        });
      }

      return res.status(200).json({
        success: true,
        aboutUs: settings.aboutUs,
      });
    }

    if (req.method === "POST") {
      const { aboutUs } = req.body;

      if (!aboutUs || typeof aboutUs !== "string") {
        return res.status(400).json({
          success: false,
          message: "About Us content is required",
        });
      }

      let settings = await SiteSettings.findOne({});
      if (!settings) {
        settings = new SiteSettings({ aboutUs });
      } else {
        settings.aboutUs = aboutUs;
      }
      await settings.save();

      return res.status(200).json({
        success: true,
        message: "About Us content updated",
        aboutUs: settings.aboutUs,
      });
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("About Us API Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
