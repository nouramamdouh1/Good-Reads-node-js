const { Router } = require("express");

const notFound = Router();

notFound.route("/*").all((_req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Not Found",
  });
});

module.exports = notFound;
