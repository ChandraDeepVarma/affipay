// src/pages/api/faqs/index.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("faqs");

    // GET - Fetch all FAQs
    if (req.method === "GET") {
      const faqs = await collection.find({}).sort({ display_order: 1 }).toArray();
      return res.status(200).json({ success: true, faqs });
    }

    // POST - Create a new FAQ
    if (req.method === "POST") {
      const { question, answer, status, display_order } = req.body;

      // Validate required fields
      if (!question || !answer) {
        return res.status(400).json({ success: false, message: "Question and answer are required" });
      }

      const newFaq = {
        question,
        answer,
        status: status || "Active",
        display_order: display_order || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newFaq);
      return res.status(201).json({ 
        success: true, 
        message: "FAQ created successfully", 
        faq: { ...newFaq, _id: result.insertedId } 
      });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error) {
    console.error("FAQ API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}