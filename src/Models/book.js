const mongoose = require("mongoose");
const { body, check } = require("express-validator");
const { validateCustomId } = require("../utils/validation");
const { Author } = require("./author");
const { Category } = require("./category");

const bookSchema = new mongoose.Schema({
	photo: { type: String, required: true },
	name: { type: String, required: true },
	title: { type: String, required: true },
	desc: { type: String, required: true },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Author",
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
});

const Book = mongoose.model("Book", bookSchema); // books --> Book

const bookCreationValidationRules = [
	body("name").isString().withMessage("Book name must be string"),
	body("title").isString().withMessage("Book title must be string"),
	body("desc").isString().withMessage("Book desc must be string"),
	body("photo").isString().withMessage("Book photo must be string"),
	body("author").custom(async (value) => {
		await validateCustomId(Author, value);
	}),
	body("category").custom(async (value) => {
		await validateCustomId(Category, value);
	}),
];

const bookUpdateValidationRules = [
	check("name").optional().isString().withMessage("Book name must be string"),
	check("title").optional().isString().withMessage("Book title must be string"),
	check("desc").optional().isString().withMessage("Book desc must be string"),
	check("photo").optional().isString().withMessage("Book photo must be string"),
	body("author")
		.custom(async (value) => {
			await validateCustomId(Author, value);
		})
		.optional(),
	body("category")
		.custom(async (value) => {
			await validateCustomId(Category, value);
		})
		.optional(),
];

module.exports = {
	Book,
	bookCreationValidationRules,
	bookUpdateValidationRules,
};
