const mongoose = require("mongoose");
const { body, check } = require("express-validator");
const { validateCustomId } = require("../utils/validation");
const { Book } = require("./../Models/book");

const ratingSchema = new mongoose.Schema({
  score: { type: Number, requiried: true, trim: true },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Rating = mongoose.model("Rating", ratingSchema);

const ratingCreateValidationRules = [
  body("score")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Score must be number between 0 and 5"),

  body("book").custom(async (value) => {
    await validateCustomId(Book, value);
  }),
];

const ratingUpdateValidationRules = [
  check("score")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Score must be number between 0 and 5"),

  check("book")
    .optional()
    .custom(async (value) => {
      await validateCustomId(Book, value);
    }),
];

module.exports = {
  Rating,
  ratingCreateValidationRules,
  ratingUpdateValidationRules,
};
