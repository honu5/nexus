// your database operations
const Books = require("../models/books.schema");

class BlogRepositry {
  // attributes
  // methods -> DB operations

  async createBook(bookData) {
    return await Books.create(bookData);
  }
  async getBooks(page, limit) {
    // page 3 , limit 100
    // 201 - 300
    //200

    // page 4 , limit 100
    // 301 - 320
    // 300
    const offset = (page - 1) * limit;
    const books = await Books.find().skip(offset).limit(limit);
    const total = await Books.countDocuments();
    return { books, total, page, limit };
  }

  async getBooksbyId(bookId) {
    return await Books.findById(bookId);
  }

  //   update
  // delete
}

module.exports = new BlogRepositry(); // not good
//
