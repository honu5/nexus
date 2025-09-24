// your database operations
const Books = require("../models/books.schema");

class BlogRepositry {
  // attributes
  // methods -> DB operations

  async createBook(bookData) {
    return await Books.create(bookData);
  }
  async getBooks() {
    return await Books.find();
  }

  async getBooksbyId(bookId) {
    return await Books.findById(bookId);
  }

  //   update
  // delete
}

module.exports = new BlogRepositry(); // not good
//
