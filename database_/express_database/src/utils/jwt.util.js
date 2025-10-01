const jwt = require("jsonwebtoken");
const config = require("../config/config");
console.log("User private key", process.env.JWT_PRIVATE_KEY);

// accessToken
const generateAccessToken = (user) => {
  // payload - actual data
  // private key
  // expire time
  console.log("User for token", user, config.privateKey);
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
  console.log("Verifying token", token);

  return jwt.verify(token, config.privateKey);
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
