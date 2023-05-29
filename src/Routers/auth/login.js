const express = require("express");
const loginController = require("../../Controllers/login");

const login = express.Router();

login.route("/auth/login").post(loginController);

module.exports = login;
