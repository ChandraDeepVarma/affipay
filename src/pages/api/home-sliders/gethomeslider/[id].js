import dbConnect from "@/lib/mongoose";
import HomeSliders from "@/models/HomeSliders";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid HomeSlider ID",
    });
  }

  if (req.method === "GET") {
    try {
      const homeSlider = await HomeSliders.findById(id);

      if (!homeSlider) {
        return res.status(404).json({
          success: false,
          error: "HomeSlider not found",
        });
      }

      return res.status(200).json({
        success: true,
        homeSlider,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch HomeSlider",
      });
    }
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
