// Schema-> blueprint of table

const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  // the id? mongoose by default creates it
  // create - _id
  title: { type: String, required: true },
  author: { type: String, required: true },
  // one to many
  userId : {type : mongoose.Schema.Types.ObjectId, ref: "User", required : true}
});

module.exports = mongoose.model("Books", booksSchema);
//
