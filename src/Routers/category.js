const { Router } = require("express");

const {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
  getBooksOfCategory
} = require("../Controllers/category");

const { categoryValidationRules } = require("../Models/category");

const { validate } = require("../Middlewares/validation");

const { authenticate, checkRole } = require("../Middlewares/auth");

category = new Router();

category
  .route("/category")
  .get(getAllCategories) //All can get categories
  .post(
    authenticate,
    checkRole(["admin"]), //Admin only can create category
    validate(categoryValidationRules),
    createCategory
  );

category
  .route("/category/:id")
  .get(getBooksOfCategory) //All can get category by id
  .put(
    authenticate,
    checkRole(["admin"]), //Admin only can edit category
    validate(categoryValidationRules),
    updateCategory
  )
  .delete(authenticate, checkRole(["admin"]), deleteCategory); //Admin only can delete category

module.exports = category;
