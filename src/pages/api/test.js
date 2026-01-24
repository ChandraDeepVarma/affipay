import clientPromise from '@/lib/mongodb'; // Make sure the alias '@' is set up in jsconfig.json

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(); // replace with your actual DB name

    const data = await db.collection('users').find({}).limit(10).toArray();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('MongoDB query error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
