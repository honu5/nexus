// business logic
const BookRepo = require("../repository/books.repository");

class BlogService {
  async createBook(data, userId) {
    // validation of data
    // validate(data)
    // logic

    return await BookRepo.createBook({ ...data, userId });
  }

  async getBooks(page, limit) {
    //api pagination
    return await BookRepo.getBooks(page, limit);
  }

  async getBooksbyId(id) {
    return await BookRepo.getBooksbyId(id);
  }
}

module.exports = new BlogService();
//
