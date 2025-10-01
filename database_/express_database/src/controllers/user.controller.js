const UserService = require("../services/user.service");
const { sigupSchema, loginSchema } = require("../validators/user.validator");

class UserController {
  async signup(request, response) {
    try {
      // validation
      const validatedData = sigupSchema.parse(request.body);
      const { accessToken, refreshToken, user } = await UserService.signup(
        validatedData
      );
      // inside the cookie for frontend
      response.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        // secure : true, on https
        sameSite: "strict",
      });
      response.status(201).json({
        accessToken,
        user,
      });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }

  async login(request, response) {
    try {
      // validate
      const validateData = loginSchema.parse(request.body);
      // we will give it for service
      const { accessToken, refreshToken, user } = await UserService.login(
        validateData
      );
      response.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        // secure : true, on https
        sameSite: "strict",
      });
      response.status(201).json({
        accessToken,
        user,
      });
      // give a response
    } catch (error) {
        // unauthorized
      response.status(401).json({ message: error.message });
    }
  }
}
module.exports = new UserController();
//
