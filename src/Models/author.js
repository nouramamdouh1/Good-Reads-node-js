const mongoose = require("mongoose");
const { body, check } = require("express-validator");

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
  },
});

const Author = mongoose.model("Author", authorSchema);

// TODO: add book validation on id
const authorValidationRules = [
  body("firstName").isString().withMessage("Author name must be string"),
  body("lastName").isString().withMessage("Author name must be string"),
];

const authorUpdateValidationRules = [
  check("firstName")
    .optional()
    .isString()
    .withMessage("Author name must be string"),
  check("lastName")
    .optional()
    .isString()
    .withMessage("Author name must be string"),
];

module.exports = { Author, authorValidationRules, authorUpdateValidationRules };
