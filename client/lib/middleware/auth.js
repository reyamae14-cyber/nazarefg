import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt;

  //check if the token exists & verify it
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          data: false
        });
      }

      req.userId = decodedToken.id;
      next();
    });
  } else {
    return res.status(400).json({
      status: "fail",
      data: false
    });
  }
};

export const headerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
          throw Error("Invalid API authorization key");
        } else {
          next();
        }
      });
    } else {
      throw Error("No authorization token provided");
    }
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message
    });
  }
};

// Middleware wrapper for serverless functions
export const withAuth = (handler) => {
  return async (req, res) => {
    return new Promise((resolve, reject) => {
      requireAuth(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(handler(req, res));
        }
      });
    });
  };
};