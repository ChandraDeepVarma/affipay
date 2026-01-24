// src/models/Roles.js
import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Person's name, e.g. "Kathryn Murphy"
    },
    roleName: {
        type: String,
        required: true, // Role name, e.g. "Manager", "Team Lead"
    }
}, { timestamps: true });

export default mongoose.models.Roles
    || mongoose.model('Roles', RoleSchema);
