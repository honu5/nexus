// major http layer
// request and response

const BooksService = require("../services/books.service");

class BookController {
  async create(request, response) {
    try {
      // query params
      // url params
      // request body

      //todo we validate the request
      const book = await BooksService.createBook(request.body, request.user.id);
      response.status(201).json(book);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }

  async getBooks(request, response) {
    try {
      // somedomain/dnsfd?fndjs
      const { page = 1, limit = 10 } = request.query;
      const allBooks = await BooksService.getBooks(
        parseInt(page),
        parseInt(limit)
      );
      response.status(200).json(allBooks);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }

  async getBooksById(request, response) {
    try {
      const specificBook = await BooksService.getBooksbyId(request.params.id);
      response.status(200).json(specificBook);
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  }
  //
}

module.exports = new BookController();
//
