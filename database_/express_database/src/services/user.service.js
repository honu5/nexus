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
    const newUser = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const accessToken = jwt.generateAccessToken(newUser);
    const refreshToken = jwt.generateRefreshToken(newUser);
    console.log("New refreshToken", refreshToken);

    // newUser.refresh_token = refreshToken;
    // todo update the database with refreshToken
    // await newUser.save();
    await UserRepository.updateUser(newUser._id, {
      refresh_token: refreshToken,
    });

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

  async login(userData) {
    // take email and password
    const { email, password } = userData;
    // check whether the user exist
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("User doesn't exist please signup");
    }
    // check the password
    const isCorrect = await bcrpyt.compare(password, user.password);
    if (!isCorrect) {
      throw new Error("Invalid password");
    }
    // give accesstoken and refreshtoken
    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);
    console.log("New refreshToken inside login", refreshToken);
    await UserRepository.updateUser(user._id, {
      refresh_token: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  //   login
  // authentication middleware
}

module.exports = new UserService();
//
