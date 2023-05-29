const { Router } = require("express");

const {
  shelfCreateValidationRules,
  shelfUpdateValidationRules,
} = require("../Models/shelf");

const { validate } = require("../Middlewares/validation");

const { authenticate, checkRole } = require("../Middlewares/auth"); // TODO: paths alias import

const {
  addShelf,
  getShelfById,
  deleteShelf,
  updateShelf,
  getAllUserShelves,
} = require("../Controllers/shelf");

const shelf = Router();

shelf
  .route("/shelf")
  .get(authenticate, getAllUserShelves) // must be registered to get all books
  .post(
    authenticate,
    checkRole(["reader"]), // user can get all shelves
    validate(shelfCreateValidationRules),
    addShelf
  );

shelf
  .route("/shelf/:id")
  .get(authenticate, getShelfById)
  .put(
    authenticate,
    checkRole(["reader"]), // user can update state of shelf
    validate(shelfUpdateValidationRules),
    updateShelf
  )
  .delete(authenticate, checkRole(["reader"]), deleteShelf); // ?

module.exports = shelf;
