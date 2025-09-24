const logger = (request, response, next) => {
  console.log(`${new Date()} Request ${request.method}`);
  next();
};
module.exports = logger;
//
