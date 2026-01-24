import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const settings = await SiteSettings.findOne(
        {},
        "privacyPolicy refundPolicy cookiesPolicy disclaimer"
      );

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "No policy data found",
        });
      }

      return res.status(200).json({
        success: true,
        data: settings,
      });
    }

    if (req.method === "POST") {
      const { privacyPolicy, refundPolicy, cookiesPolicy, disclaimer } =
        req.body;

      let settings = await SiteSettings.findOne({});

      if (!settings) {
        settings = new SiteSettings({
          privacyPolicy,
          refundPolicy,
          cookiesPolicy,
          disclaimer,
        });
      } else {
        if (privacyPolicy) settings.privacyPolicy = privacyPolicy;
        if (refundPolicy) settings.refundPolicy = refundPolicy;
        if (cookiesPolicy) settings.cookiesPolicy = cookiesPolicy;
        if (disclaimer) settings.disclaimer = disclaimer;
      }

      await settings.save();

      return res.status(200).json({
        success: true,
        message: "Policies updated",
        data: settings,
      });
    }

    res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Policies API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
