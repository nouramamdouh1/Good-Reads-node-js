const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../Controllers/user");

const {
  userCreateValidationRules,
  userUpdateValidationRules,
} = require("../Models/user");

const { validate } = require("../Middlewares/validation");

const { authenticate, checkRole } = require("../Middlewares/auth"); // TODO: paths alias import

const user = Router();

user
  .route("/users")
  .get(getAllUsers)
  .post(
    authenticate,
    checkRole(["reader", "admin"]),
    validate(userCreateValidationRules),
    createUser
  );

user
  .route("/users/:id")
  .get(getUserById)
  .put(
    authenticate,
    checkRole(["reader", "admin"]),
    validate(userUpdateValidationRules),
    updateUser
  )
  .delete(authenticate, checkRole(["reader", "admin"]), deleteUser);
module.exports = user;
