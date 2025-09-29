const UserService = require("../services/user.service");


class UserController {
    async signup(request, response) {
        try {
            // validation
            const {accessToken, refreshToken, user} = await UserService.signup(request.body)
            // inside the cookie for frontend
            //todo httponly add the refreshToken
            response.status(201).json({
                accessToken,
                user
            })
            
        } catch (error) {
            response.status(400).json(
               { message : error.message}
            )
        }
    }
}
module.exports = new UserController()
//
