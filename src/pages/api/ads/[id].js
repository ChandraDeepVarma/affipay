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
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const ad = await Ad.findById(id);
      if (!ad) {
        return res.status(404).json({ success: false, error: "Ad not found" });
      }
      return res.status(200).json({ success: true, ad });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const {
        title,
        type,
        placement,
        imageUrl,
        websiteLink,
        scriptCode,
        isActive,
      } = req.body;

      const ad = await Ad.findByIdAndUpdate(
        id,
        { title, type, placement, imageUrl, websiteLink, scriptCode, isActive },
        { new: true }
      );

      if (!ad) {
        return res.status(404).json({ success: false, error: "Ad not found" });
      }

      return res.status(200).json({ success: true, ad });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const ad = await Ad.findByIdAndDelete(id);

      if (!ad) {
        return res.status(404).json({ success: false, error: "Ad not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Ad deleted successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "PATCH") {
    // For toggling status
    try {
      const ad = await Ad.findById(id);
      if (!ad) {
        return res.status(404).json({ success: false, error: "Ad not found" });
      }
      ad.isActive = !ad.isActive;
      await ad.save();
      return res.status(200).json({ success: true, isActive: ad.isActive });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
