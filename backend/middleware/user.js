const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json('An authentication token is required');
  }

  try {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.currentUser = decodedToken;
  } catch (error) {
    return res.status(401).json('Session expired. Please re-login to start new session');
  }

  return next();
};

module.exports = { verifyToken };
