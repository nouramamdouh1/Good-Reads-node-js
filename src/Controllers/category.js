const { Category } = require("../Models/category");
const { Book } = require("../Models/book")


const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await Category.find({});

    res.status(200).json({
      status: "success",
      result: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBooksOfCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ success: false, errors: ['Category not found'] });
  }
  const books = await Book.find({ category: categoryId }).populate('category');
  if (!books || books.length === 0) {
    return res.status(404).json({ success: false, errors: ['No books for this category'] });
  }
  res.status(200).json({ success: true, count: books.length, data: books });
};


const createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create({
      ...req.body,
    });
    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: "fail",
        message: "Category not Found",
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

module.exports = {
  getAllCategories,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
  getBooksOfCategory
};
