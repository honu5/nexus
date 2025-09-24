// connecting with db
// to access environmental variables
const mongoose = require("mongoose");

const config = require("./config");


const connectDB = async () => {
  try {
    console.log(`conection url`, config.database_url);
    const connect = await mongoose.connect(config.database_url);
    console.log(`Mongodb connected`);
  } catch (error) {
    console.log(`error when connection mongodb`);
  }
};

module.exports = connectDB;

//
