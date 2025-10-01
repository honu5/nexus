const express = require("express");
const router = express.Router();

const BookController = require("../controllers/books.controller");
const authMiddleware = require("../middlewares/auth.middleware");
// api versioning
router.post("/v1/books", authMiddleware, BookController.create);

router.get("/v1/books", BookController.getBooks);

router.get("/v1/books/:id", BookController.getBooksById);

module.exports = router;
//
