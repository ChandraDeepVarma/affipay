// src/pages/api/faqs/[id].js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid FAQ ID" });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("faqs");
    const objectId = new ObjectId(id);

    // GET - Fetch a single FAQ
    if (req.method === "GET") {
      const faq = await collection.findOne({ _id: objectId });
      if (!faq) {
        return res.status(404).json({ success: false, message: "FAQ not found" });
      }
      return res.status(200).json({ success: true, faq });
    }

    // PUT - Update a FAQ
    if (req.method === "PUT") {
      const { question, answer, status, display_order } = req.body;

      // Validate required fields
      if (!question || !answer) {
        return res.status(400).json({ success: false, message: "Question and answer are required" });
      }

      const updatedFaq = {
        question,
        answer,
        status: status || "Active",
        display_order: display_order || 0,
        updatedAt: new Date()
      };

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: updatedFaq }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: "FAQ not found" });
      }

      return res.status(200).json({ 
        success: true, 
        message: "FAQ updated successfully", 
        faq: { ...updatedFaq, _id: id }
      });
    }

    // DELETE - Delete a FAQ
    if (req.method === "DELETE") {
      const result = await collection.deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "FAQ not found" });
      }

      return res.status(200).json({ success: true, message: "FAQ deleted successfully" });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("FAQ API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}