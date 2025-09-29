// Schema-> blueprint of table

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // the id? mongoose by default creates it
  // create - _id
  name: { type: String, required: true },
  email: { type: String, required: true , unique : true},
  password: { type: String, required: true },
  // role based auth
  role: {
    type: String,
    enum: ["user", "admin"],
    // a user-defined data type in programming that represents a set of predefined, named constants, allowing a variable to be assigned only one of these distinct values.
    default: "user",
  },
  refresh_token : {type: String}
});

module.exports = mongoose.model("User", userSchema);
//
