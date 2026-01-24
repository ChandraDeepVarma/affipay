// src/pages/api/home-sliders/createslider.js
import formidable from "formidable";
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
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    await dbConnect();

    const { fields, files } = await parseForm(req);

    const pick = (k) => (Array.isArray(fields[k]) ? fields[k][0] : fields[k]);

    const doc = {
      image: {
        name: pick("imageName"),
        url: pick("imageUrl"),
      },
      displayOrder: Number(pick("displayOrder") ?? 0),
    };

    //Directly use Contabo S3 URL and name
    if (pick("imageUrl") && pick("imageName")) {
      doc.image = {
        name: pick("imageName"),
        url: pick("imageUrl"),
      };
    }

    console.log("Final doc to insert:", doc);

    const created = await HomeSliders.create(doc);
    console.log("Created document:", created);

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Create Home Slider error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
