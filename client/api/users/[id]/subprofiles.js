import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/userModel';
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
    case 'GET':
      try {
        requireAuth(req);
        
        const user = await User.findById(id);
        
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: "User not found"
          });
        }
        
        res.status(200).json({
          status: "success",
          data: user.subProfile
        });
      } catch (err) {
        res.status(400).json({
          status: "fail",
          message: err.message
        });
      }
      break;

    case 'POST':
      try {
        requireAuth(req);
        
        const user = await User.findById(id);
        
        if (!user) {
          return res.status(404).json({
            status: "fail",
            message: "User not found"
          });
        }
        
        // Create new subprofile
        const newProfile = {
          id: user.subProfile.length,
          name: req.body.name,
          img: req.body.img,
          isProfile: true,
          watchList: []
        };
        
        user.subProfile.push(newProfile);
        await user.save();
        
        res.status(201).json({
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

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}