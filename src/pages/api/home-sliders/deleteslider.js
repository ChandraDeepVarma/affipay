// pages/api/home-sliders/deleteslider.js
import dbConnect from "@/lib/mongoose";
import HomeSliders from "@/models/HomeSliders";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "HomeSlider ID is required" });
    }

    const deleted = await HomeSliders.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "HomeSlider not found" });
    }

    // Re-sequence displayOrder for remaining providers
    const remainingProviders = await HomeSliders.find({}).sort({
      displayOrder: 1,
    });
    for (let i = 0; i < remainingProviders.length; i++) {
      const provider = remainingProviders[i];
      const newOrder = i + 1;
      if (provider.displayOrder !== newOrder) {
        provider.displayOrder = newOrder;
        await provider.save();
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "HomeSlider deleted successfully" });
  } catch (error) {
    console.error("Delete HomeSlider error:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete HomeSlider", details: error.message });
  }
}
