import dbConnect from '@/lib/mongoose';
import LoginLog from '@/models/LoginLog';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // 🔹 Added pagination params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const totalLogs = await LoginLog.countDocuments();
      const logs = await LoginLog.find()
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(200).json({
        logs,
        total: totalLogs,
        page,
        pages: Math.ceil(totalLogs / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch logs' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
