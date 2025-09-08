import connectDB from '../../lib/mongodb';
import User from '../../lib/models/userModel';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(400).json({
        status: "fail",
        data: false
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: false,
      message: err.message
    });
  }
}