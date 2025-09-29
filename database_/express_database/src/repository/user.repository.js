const User = require("../models/user.schema");

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email: email });
  }
  async findAllUsers() {
    return await User.find();
  }

  //   update
  // delete
}

module.exports = new UserRepository();
//
