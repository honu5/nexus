const jwt = require("jsonwebtoken");
const config = require("../config/config");
console.log("User private key", process.env.JWT_PRIVATE_KEY);

// accessToken
const generateAccessToken = (user) => {
  // payload - actual data
  // private key
  // expire time
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    config.privateKey,
    { expiresIn: "15m" }
  );
};
// refreshToken

const generateRefreshToken = (user) => {
  // payload - actual data
  // private key
  // expire time
  return jwt.sign(
    {
      id: user._id,
    },
    config.privateKey,
    { expiresIn: "7d" }
  );
};
// verify Access Token

const verifyAccesToken = (token) => {
  // decode the token
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
};
// verify RefreshToken
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
};
//

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccesToken,
  verifyRefreshToken,
};
