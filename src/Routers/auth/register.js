const express = require("express");
const registerUser = require("../../Controllers/register");
const { validate } = require("../../Middlewares/validation");
const { userCreateValidationRules } = require("../../Models/user");

const register = express.Router();

// validate input FullName, email, password
register
  .route("/auth/register")
  .post(validate(userCreateValidationRules), registerUser);

module.exports = register;
