import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Clear the JWT cookie
    const cookie = serialize('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    
    res.setHeader('Set-Cookie', cookie);
    
    res.status(200).json({
      status: "success",
      message: "logged out"
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
}