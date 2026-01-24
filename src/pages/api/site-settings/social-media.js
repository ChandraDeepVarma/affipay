// pages/api/site-settings/social-media.js
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const settings = await SiteSettings.findOne({}, "socialMedia").lean();

      if (!settings) {
        return res.status(200).json({ success: true, socialMedia: {} });
      }

      return res.status(200).json({
        success: true,
        socialMedia: settings.socialMedia || {}
      });
    }

    if (req.method === "POST") {
      const { socialMedia } = req.body;

      if (!socialMedia || typeof socialMedia !== "object") {
        return res.status(400).json({ success: false, message: "Social media data is required" });
      }

      let settings = await SiteSettings.findOne({});
      if (!settings) {
        settings = new SiteSettings({ socialMedia });
      } else {
        settings.socialMedia = socialMedia;
      }
      await settings.save();

      return res.status(200).json({
        success: true,
        message: "Social media links updated successfully",
        socialMedia: settings.socialMedia
      });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Social Media API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
