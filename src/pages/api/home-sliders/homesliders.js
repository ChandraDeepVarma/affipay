import dbConnect from "@/lib/mongoose";
import HomeSliders from "@/models/HomeSliders";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const providers = await HomeSliders.find(
        {},
        {
          image: 1,
          displayOrder: 1,
          updatedAt: 1,
        }
      ).sort({ displayOrder: 1 });

      return res.status(200).json({
        success: true,
        homeSliders: providers, // ← FIXED
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch Home Sliders",
        details: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
