const UserRepository = require("../repository/user.repository");
const bcrpyt = require("bcrypt");
const jwt = require("../utils/jwt.util");
const userRepository = require("../repository/user.repository");
class UserService {
  async signup(userData) {
    // Step1
    const { email, password, name, role } = userData;
    // Step 2
    // We should check on the database
    const existingUser = await UserRepository.findByEmail(email);
    console.log("response of existing user", existingUser);

    if (existingUser) {
      throw new Error("user Already exists");
    }
    // hash the password
    const hashedPassword = await bcrpyt.hash(password, 10);
    // Token creation
    const newUser = userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const accessToken = jwt.generateAccessToken(newUser);
    const refreshToken = jwt.generateRefreshToken(newUser);
    console.log("New refreshTojen", refreshToken);
    
    // newUser.refresh_token = refreshToken;
    // todo update the database with refreshToken
    // await newUser.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name,
        email,
        role,
      },
    };
  }

  //   login
  // authentication middleware
}

module.exports = new UserService();
//
