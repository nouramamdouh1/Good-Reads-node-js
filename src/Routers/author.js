const { Router } = require("express");

const author = Router();

const {
  authorValidationRules,
  authorUpdateValidationRules,
} = require("../Models/author");

const {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
} = require("../Controllers/author");

const { validate } = require("../Middlewares/validation");

const { authenticate, checkRole } = require("../Middlewares/auth");

//TODO: Add remaining methods --> post put delete & get by id
author
  .route("/author")
  .get(getAllAuthors) //All can get authors
  .post(
    authenticate, //Admin only can create author
    checkRole(["admin"]),
    validate(authorValidationRules),
    createAuthor
  );

author
  .route("/author/:id")
  .get(getAuthorById) //All can get author by id
  .put(
    authenticate, //Admin only can edit author
    checkRole(["admin"]),
    validate(authorUpdateValidationRules),
    updateAuthor
  )
  .delete(authenticate, checkRole(["admin"]), deleteAuthor); //Admin only can delete author

module.exports = author;
