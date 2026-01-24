import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db(); // default DB from URI

        // Optional: Ping the DB to make sure it's alive
        await db.command({ ping: 1 });

        res.status(200).json({ message: '✅ MongoDB connected successfully.' });
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        res.status(500).json({ message: '❌ MongoDB connection failed.' });
    }
}
