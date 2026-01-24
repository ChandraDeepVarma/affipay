import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === "GET") {
      const settings = await SiteSettings.findOne({}).lean();

      // Flatten smtp for frontend compatibility
      if (settings && settings.smtp) {
        settings.smtpHost = settings.smtp.host || "";
        settings.smtpUser = settings.smtp.user || "";
        settings.smtpPass = settings.smtp.pass || "";
        settings.smtpPort = settings.smtp.port || "";
      }

      return res.status(200).json({
        success: true,
        settings: settings || {},
      });
    }

    if (req.method === "POST") {
      const {
        contact_email,
        contact_phone,
        office_address,
        smtpHost,
        smtpUser,
        smtpPass,
        smtpPort,
        youtube,
        bonusAmount,
        bonusUserLimit,
        minWithdrawalLimit,
        otpMode,
        RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET,
        RAZORPAY_TEST_KEY_ID,
        RAZORPAY_TEST_KEY_SECRET,
        RAZORPAY_PAYMENT_MODE,
        buyButtonMode,
        qrPaymentVerficationMode,
      } = req.body;

      // Convert flat fields back into nested smtp object
      const payload = {
        contact_email,
        contact_phone,
        office_address,
        youtube: youtube || "",
        bonusAmount: Number(bonusAmount) || 0,
        bonusUserLimit: Number(bonusUserLimit) || 0,
        minWithdrawalLimit: Number(minWithdrawalLimit) || 0,
        otpMode: otpMode || "static",
        RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET,
        RAZORPAY_TEST_KEY_ID,
        RAZORPAY_TEST_KEY_SECRET,
        RAZORPAY_PAYMENT_MODE,
        buyButtonMode: buyButtonMode || "gateway",
        qrPaymentVerficationMode: qrPaymentVerficationMode || "manual",
        smtp: {
          host: smtpHost || "",
          user: smtpUser || "",
          pass: smtpPass || "",
          port: smtpPort || "",
        },
      };

      let settings = await SiteSettings.findOne({});
      if (!settings) {
        settings = new SiteSettings(payload);
      } else {
        Object.assign(settings, payload);
      }
      await settings.save();

      return res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        settings,
      });
    }

    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("Site Settings API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
