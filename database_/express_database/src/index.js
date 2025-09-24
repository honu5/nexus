const express = require("express");

const connectDB = require("./config/database");
const environment = require("dotenv");
environment.config();
const config = require("./config/config");
const BookRoutes = require("./routes/books.routes");
const loggerMiddleware = require("./middlewares/logger.middleware")
const app = express();

// middleware
app.use(express.json());
app.use(loggerMiddleware)
app.use("/api", BookRoutes); //router

connectDB();
const port = config.port;

app.get("/", (request, response) => {
  response.send("This book API");
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
//
