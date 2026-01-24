import Razorpay from "razorpay";
import dbConnect from "@/lib/mongoose";
import SiteSettings from "@/models/SiteSettings";

export async function getRazorpayInstance() {
  await dbConnect();

  const settings = await SiteSettings.findOne({}).lean();

  if (!settings) {
    throw new Error("Site settings not found");
  }

  let key_id, key_secret;

  if (settings.RAZORPAY_PAYMENT_MODE === "live") {
    key_id = settings.RAZORPAY_KEY_ID;
    key_secret = settings.RAZORPAY_KEY_SECRET;
  } else {
    key_id = settings.RAZORPAY_TEST_KEY_ID;
    key_secret = settings.RAZORPAY_TEST_KEY_SECRET;
  }

  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys missing in DB");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}
