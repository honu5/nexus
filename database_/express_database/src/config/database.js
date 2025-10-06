// connecting with db
// to access environmental variables
const mongoose = require("mongoose");

const config = require("./config");

const connectDB = async () => {
  try {
    console.log(`conection url`, config.database_url);
    const connect = await mongoose.connect(
      // "mongodb://127.0.0.1:27018/bookdb"
      // todo
      // "mongodb://root:bookdbpassword@localhost:27017/bookdb?authSource=admin"
      "mongodb://root:bookdbpassword@localhost:27018/bookdb?authSource=admin"
    );
    console.log(`Mongodb connected`);
  } catch (error) {
    console.log(`error when connection mongodb`);
  }
};

module.exports = connectDB;

//
