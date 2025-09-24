// business logic
const BookRepo = require("../repository/books.repository");

class BlogService {
  async createBook(data) {
    // validation of data
    // validate(data)
    // logic
    
    return await BookRepo.createBook(data);
  }

  async getBooks() {
    return await BookRepo.getBooks();
  }

  async getBooksbyId(id) {
    return await BookRepo.getBooksbyId(id);
  }
}

module.exports = new BlogService();
//
