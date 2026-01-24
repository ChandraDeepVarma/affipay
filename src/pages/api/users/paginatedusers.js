import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();
        
        const { page = 1, limit = 10, search = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build search query - looking for users with bonus points
        let searchQuery = {
            "credits.bonus": { $gt: 0 },
            isDeleted: { $ne: true }
        };

        if (search) {
            searchQuery.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination (including all users with bonus points)
        const totalUsers = await User.countDocuments(searchQuery);
        
        // Get paginated users with bonus points
        const users = await User.find(searchQuery)
            .select('name email credits createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        const totalPages = Math.ceil(totalUsers / limitNum);

        res.status(200).json({
            users,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalUsers,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
                limit: limitNum
            }
        });

    } catch (error) {
        console.error("Error fetching paginated users:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
