import connectDB from '../../lib/mongodb';
import User from '../../lib/models/userModel';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      try {
        const userQuery = await User.find();
        res.status(200).json({
          status: "success",
          result: userQuery.length,
          data: userQuery
        });
      } catch (err) {
        res.status(404).json({
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