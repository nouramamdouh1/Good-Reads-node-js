const { Author } = require("../Models/author");

// TODO: refactoring to use next --> "error middleware"

//create author
const createAuthor = async (req, res, next) => {
  try {
    const newAuthor = await Author.create({
      ...req.body,
    });
    res.status(201).json({
      status: "success",
      data: {
        author: newAuthor,
      },
    });
  } catch (error) {
    next(error);
  }
};

//update author
const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, ...req.body, {
      new: true,
      runValidators: true,
    });

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: "Author not Found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

//delete author
const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: "Author not Found",
      });
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

//getAllAuthors
const getAllAuthors = async (_req, res, next) => {
  try {
    const authors = await Author.find({});

    res.status(200).json({
      status: "success",
      result: authors.length,
      data: {
        authors,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: "Author not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
};
