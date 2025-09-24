const express = require("express");

// We can implement REST APIs
const app = express();

// port
const PORT = 7777;

//? middleware
app.use(express.json());

// database
let books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
  },
  {
    id: 2,
    title: "Harry Potter",
    author: "J.Rowling",
  },
];

// get method
// for reading from the database
//        resource   http
app.get("/books", (request, response) => {
  response.status(200).json(books);
});

// create a book
app.post("/books", (request, response) => {
  const { title, author } = request.body;
  // every condition -> Frontend, backend
  // we haven't done validation
  const newBook = {
    id: books.length + 1,
    title: title, //mistake
    author: author, //mistake
  };
  console.log(`Previous Book`, books);
  books.push(newBook);
  console.log(`Current book`, books);
  response.status(201).json({
    message: "Saved successfully inside the database",
  });
});

// PUT, PATCH, DELETE
app.listen(PORT, () => {
  console.log(`Server started`);
});
//
