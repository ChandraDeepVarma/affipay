import dbConnect from "@/lib/mongoose";
import ContactMessage from "@/models/ContactMessage";

export default async function handler(req, res) {
  await dbConnect();

  // GET ALL CONTACT MESSAGES
  if (req.method === "GET") {
    try {
      const contactMessages = await ContactMessage.find().sort({
        createdAt: -1,
      });
      return res.status(200).json({ success: true, messages: contactMessages });
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // DELETE CONTACT MESSAGE
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "ID is required" });
      }

      await ContactMessage.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Contact message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // METHOD NOT ALLOWED
  return res.status(405).json({ message: "Method not allowed" });
}
