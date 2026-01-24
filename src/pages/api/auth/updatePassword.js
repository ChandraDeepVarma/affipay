import dbConnect from '@/lib/mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { currentPassword, newPassword } = req.body;
    
    // Basic validations
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'New password must be different from current password' });
    }

    // Get admin token from cookies
    let adminToken;
    
    // Parse cookies from the request headers
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        const parsedCookies = parse(cookieHeader);
        adminToken = parsedCookies.admin_token;
    }
    
    if (!adminToken) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized - Not an admin' });
        }

        await dbConnect();

        // Find the admin user
        const user = await User.findOne({ _id: decoded._id, isAdmin: true });
        if (!user) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hash);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);

        // Update the password
        user.hash = hash;
        user.salt = salt;
        await user.save();
        
        // Generate a new token with updated information
        const newToken = jwt.sign(
            { _id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Update the cookie with the new token
        res.setHeader('Set-Cookie', `admin_token=${newToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`);

        return res.status(200).json({ 
            message: 'Password updated successfully',
            token: newToken
        });
    } catch (error) {
        console.error('Password update error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}