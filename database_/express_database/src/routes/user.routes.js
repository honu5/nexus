const express = require("express")
const router = express.Router()

const UserController = require("../controllers/user.controller")

// api versioning
router.post("/v1/users/signup", UserController.signup)
router.post("/v1/users/login", UserController.login)

module.exports = router
// 
