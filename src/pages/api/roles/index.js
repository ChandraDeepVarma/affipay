// src/pages/api/roles/index.js
import dbConnect from "@/lib/mongoose";
import Roles from "@/models/Roles";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  try {
    switch (method) {
      case "GET":
        // Get all roles or a specific role by ID
        if (req.query.id) {
          const role = await Roles.findById(req.query.id);
          if (!role) {
            return res
              .status(404)
              .json({ success: false, error: "Role not found" });
          }
          return res.status(200).json(role);
        } else {
          const roles = await Roles.find({}).sort({ createdAt: 1 });
          return res.status(200).json(roles);
        }

      case "POST":
        // Create a new role
        const { name, roleName } = req.body;

        if (!name || !roleName) {
          return res
            .status(400)
            .json({
              success: false,
              error: "Name and role name are required fields",
            });
        }

        // Check for duplicate name
        const existingName = await Roles.findOne({ name: name.trim() });
        if (existingName) {
          return res
            .status(400)
            .json({
              success: false,
              error: "A person with this name already exists",
            });
        }

        // Check for duplicate role name
        const existingRoleName = await Roles.findOne({
          roleName: roleName.trim(),
        });
        if (existingRoleName) {
          return res
            .status(400)
            .json({ success: false, error: "This role name already exists" });
        }

        const role = await Roles.create({
          name: name.trim(),
          roleName: roleName.trim(),
        });

        return res.status(201).json({ success: true, role });

      case "PUT":
        // Update a role
        if (!req.query.id) {
          return res
            .status(400)
            .json({ success: false, error: "Role ID is required" });
        }

        const { name: updateName, roleName: updateRoleName } = req.body;

        // Check for duplicate name (excluding current role)
        if (updateName) {
          const existingName = await Roles.findOne({
            name: updateName.trim(),
            _id: { $ne: req.query.id },
          });
          if (existingName) {
            return res
              .status(400)
              .json({
                success: false,
                error: "A person with this name already exists",
              });
          }
        }

        // Check for duplicate role name (excluding current role)
        if (updateRoleName) {
          const existingRoleName = await Roles.findOne({
            roleName: updateRoleName.trim(),
            _id: { $ne: req.query.id },
          });
          if (existingRoleName) {
            return res
              .status(400)
              .json({ success: false, error: "This role name already exists" });
          }
        }

        const updatedRole = await Roles.findByIdAndUpdate(
          req.query.id,
          {
            name: updateName?.trim(),
            roleName: updateRoleName?.trim(),
          },
          { new: true, runValidators: true }
        );

        if (!updatedRole) {
          return res
            .status(404)
            .json({ success: false, error: "Role not found" });
        }

        return res.status(200).json({ success: true, role: updatedRole });

      case "DELETE":
        // Delete a role
        if (!req.query.id) {
          return res
            .status(400)
            .json({ success: false, error: "Role ID is required" });
        }

        const deletedRole = await Roles.findByIdAndDelete(req.query.id);

        if (!deletedRole) {
          return res
            .status(404)
            .json({ success: false, error: "Role not found" });
        }

        return res
          .status(200)
          .json({ success: true, message: "Role deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ success: false, error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : String(error) || "Server Error",
    });
  }
}
