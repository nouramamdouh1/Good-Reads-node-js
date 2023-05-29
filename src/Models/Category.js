const mongoose = require("mongoose");
const { body } = require("express-validator");

const categorySchema = new mongoose.Schema({
  fullname: {
    type: String,
    requiried: true,
    unique: true,
    minLength: 3,
    trim: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

// TODO: add book validation on id
const categoryValidationRules = [
  body("fullname").isString().withMessage("Category name must be string"),
];

module.exports = { Category, categoryValidationRules };
