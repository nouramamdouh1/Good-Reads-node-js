const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const notFound = require("./Routers/notFound");
const error = require("./Middlewares/error");
const user = require("./Routers/user");
const login = require("./Routers/auth/login");
const register = require("./Routers/auth/register");
const { addAdmin } = require("./Models/user");
const category = require("./Routers/category");
const author = require("./Routers/author");
const cors = require("cors");
const book = require("./Routers/book");
const shelf = require("./Routers/shelf");
const rating = require("./Routers/rating");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//register route
app.use(register);

//login route
app.use(login);

//book route
app.use(book);

// user route
app.use(user);

// user route
app.use(shelf);

// user route
app.use(rating);

//category route
app.use(category);

//author route
app.use(author);

// not fount route
app.use(notFound);

// error middleware
app.use(error);

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log("DB Connected");
    addAdmin();
    app.listen(process.env.PORT, () => {
      console.log(`Server started at port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Error." + err));
