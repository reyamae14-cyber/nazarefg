import connectDB from '../../lib/mongodb';
import User from '../../lib/models/userModel';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

//error handling
const handleErrors = (err) => {
  //sign up
  if (err.includes("user validation")) {
    let error = { email: "", password: "" };
    if (err.includes("email")) {
      error.email = "Please enter a valid email";
      return error.email;
    }
    error.password = "Minimum of 6 characters required";
    return error.password;
  }

  if (err.includes("duplicate key")) {
    return "This account is already registered";
  }
};

//create jsonwebtoken
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { email, password } = req.body;

    const user = await User.login(email, password);
    const token = createToken(user._id);
    
    // Set cookie
    const cookie = serialize('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge,
      path: '/'
    });
    
    res.setHeader('Set-Cookie', cookie);
    
    res.status(200).json({
      status: "success",
      data: user._id
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
}