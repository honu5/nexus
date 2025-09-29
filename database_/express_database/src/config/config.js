const environment = require("dotenv");
environment.config();
const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  privateKey : process.env.JWT_PRIVATE_KEY
};

module.exports = config;
