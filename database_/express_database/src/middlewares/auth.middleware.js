const { verifyAccesToken } = require("../utils/jwt.util");
const authMiddleware = (req, res, next) => {
  // where do we get the token
  const header = req.headers.authorization;
  // Bearer <some Token>
  // ["Bearer", "some Token"]
  if (!header) {
    res.status(401).json({ message: "Unauthorized user" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = verifyAccesToken(token);
    // {
    //   "id": "68dd70c6c3107889e148970c",
    //   "role": "user",
    //   "iat": 1759342790,
    //   "exp": 1759343690
    // }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
//
