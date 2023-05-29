const mongoose = require("mongoose");
const { check, body } = require("express-validator");
const { validateCustomId } = require("../utils/validation");
const { Book } = require("./../Models/book");

//states -> 0 "want to read", 1 "currently reading",
const shelfSchema = new mongoose.Schema({
  state: {
    type: String,
    enum: ["read", "currently reading", "want to read"],
    default: "want to read",
    required: true,
  },
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Shelf = mongoose.model("Shelf", shelfSchema);

const shelfCreateValidationRules = [
  body("state").isString().withMessage("state must be string"),

  body("book").custom(async (value) => {
    await validateCustomId(Book, value);
  }),
];

const shelfUpdateValidationRules = [
  check("state").optional().isString().withMessage("State name must be string"),

  check("book")
    .optional()
    .custom(async (value) => {
      await validateCustomId(Book, value);
    }),
];

module.exports = {
  Shelf,
  shelfCreateValidationRules,
  shelfUpdateValidationRules,
};
