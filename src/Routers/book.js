const { Router } = require("express");

const book = Router();

const {
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  addBook,
} = require("../Controllers/book");

const {
  bookCreationValidationRules,
  bookUpdateValidationRules,
} = require("./../Models/book");

const { validate } = require("../Middlewares/validation");

const { authenticate, checkRole } = require("../Middlewares/auth");

book
  .route("/book")
  .get(getAllBooks) //All can get Books
  .post(
    authenticate,
    checkRole(["admin"]), //Admin only can create book
    validate(bookCreationValidationRules),
    addBook
  );

book
  .route("/book/:id")
  .get(getBookById) //All can get Books by id
  .put(
    authenticate,
    checkRole(["admin"]), //Admin only can edit book
    validate(bookUpdateValidationRules),
    updateBook
  )
  .delete(authenticate, checkRole(["admin"]), deleteBook); //Admin only can delete book

module.exports = book;
