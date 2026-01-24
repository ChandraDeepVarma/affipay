import formidable from "formidable";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/mongoose";
import HomeSliders from "@/models/HomeSliders";

export const config = { api: { bodyParser: false } };

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { fields, files } = await parseForm(req);
    const pick = (k) => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]);

    const id = pick("id");
    if (!id) return res.status(400).json({ error: "Missing HomeSlider ID" });

    const updateData = {
      displayOrder: Number(pick("displayOrder") ?? 0),
    };

    // Handle image via Contabo S3
    const imageUrl = pick("imageUrl");
    const imageName = pick("imageName");
    const existingImageUrl = pick("existingImageUrl");

    if (imageUrl && imageName) {
      // user uploaded/selected new image (or kept same URL+name)
      updateData.image = {
        name: imageName,
        url: imageUrl,
      };
    } else if (existingImageUrl) {
      // user kept old image, only URL known
      updateData.image = {
        name: "existing-image",
        url: existingImageUrl,
      };
    }

    const updated = await HomeSliders.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "HomeSlider not found" });

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update HomeSlider error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
