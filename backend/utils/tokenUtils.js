const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, TOKEN_EXPIRY } = process.env;

const createToken = (tokenData, tokenKey = ACCESS_TOKEN_SECRET, expiresIn = TOKEN_EXPIRY) => {
  try {
    const token = jwt.sign(tokenData, tokenKey, { expiresIn });
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = { createToken };
