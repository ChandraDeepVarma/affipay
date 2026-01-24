import dbConnect from "@/lib/mongoose";
import Ad from "@/models/Ad";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const ads = await Ad.find().sort({ updatedAt: -1 });
      return res.status(200).json({ success: true, ads });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, type, placement, imageUrl, websiteLink, scriptCode } =
        req.body;

      if (!title || !type || !placement) {
        return res.status(400).json({
          success: false,
          error: "Title, Type, and Placement are required",
        });
      }

      const ad = await Ad.create({
        title,
        type,
        placement,
        imageUrl,
        websiteLink,
        scriptCode,
      });

      return res.status(201).json({ success: true, ad });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
