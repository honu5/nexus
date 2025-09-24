// major http layer
// request and response

const BooksService = require("../services/books.service");

class BookController {
  async create(request, response) {
    try {
      // query params
      // url params
      // request body

      //we validate the request
      const book = await BooksService.createBook(request.body);
      response.status(201).json(book);
    } catch (error) {
        response.status(400).json({message : error.message})
    }
  }

  async getBooks(request, response) {
        try {
            const allBooks = await BooksService.getBooks()
            response.status(200).json(allBooks);
        } catch (error) {
            response.status(400).json({message : error.message})
        }
  }

  async getBooksById(request, response) {
        try {
            const specificBook = await BooksService.getBooksbyId(request.params.id)
            response.status(200).json(specificBook);
        } catch (error) {
            response.status(400).json({message : error.message})
        }
  }
//   
}

module.exports = new BookController();
//
