import connectDB from '../../lib/mongodb';
import User from '../../lib/models/userModel';
import jwt from 'jsonwebtoken';

const requireAuth = (req) => {
  const token = req.cookies?.jwt;
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken.id;
};

export default async function handler(req, res) {
  await connectDB();
  
  const { id } = req.query;

  switch (req.method) {
    case 'PATCH':
      try {
        requireAuth(req); // Verify authentication
        
        const user = await User.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        
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
          message: err.message
        });
      }
      break;

    case 'DELETE':
      try {
        requireAuth(req); // Verify authentication
        
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: "User not found"
          });
        }
        
        res.status(204).json({
          status: "success",
          data: null
        });
      } catch (err) {
        res.status(400).json({
          status: "fail",
          message: err.message
        });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}