import connectDB from '../../lib/mongodb';
import ProfileIcon from '../../lib/models/profileIconModel';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const profileIcons = await ProfileIcon.find();
    
    res.status(200).json({
      status: "success",
      data: profileIcons
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
}