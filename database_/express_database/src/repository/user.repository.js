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

  async updateUser(id, updatedData) {
    return await User.findByIdAndUpdate(id, updatedData, { new: true }); //return the updated document
  }

  //   update
  // delete
}

module.exports = new UserRepository();
//
