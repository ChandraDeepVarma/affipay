// src/pages/api/users/creditdebitamount.js
import dbConnect from "@/lib/mongoose";
import Customer from "@/models/Customer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbConnect();
  console.log("req.query", req.query);
  try {
    const { search } = req.query;
    console.log("search", search);
    if (!search || search.trim() === "") {
      return res.status(400).json({ message: "Search term is required" });
    }
    // Detect if search is a number (phone) or text (name)
    // let query = {};
    // if (/^\d+$/.test(search)) {
    //   // Exact phone match
    //   query = { phone: search, isDeleted: false };
    // } else {
    //   // Exact name match (case-insensitive)
    //   query = {
    //     email: { $regex: `^${search}$`, $options: "i" },
    //     isDeleted: false,
    //   };
    // }
    let search_query = "";
    if (search.includes("@")) {
      search_query = "email";
    } else {
      search_query = "phone";
    }
    console.log("query", search_query);
    const users = await Customer.find({ [search_query]: search });
    console.log("users", users);
    if (!users.length) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}
