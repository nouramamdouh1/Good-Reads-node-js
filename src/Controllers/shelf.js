const mongoose = require("mongoose");
const { Shelf } = require("../Models/shelf");
// shelf is a single unit
const addShelf = async (req, res, next) => {
  try {
    // book id + state , auth --> req --> userId
    //TODO: filter shelf
    const newShelf = await Shelf.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json({
      status: "success",
      data: {
        shelf: newShelf,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getShelfById = async (req, res, next) => {
  try {
    const shelves = await Shelf.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "ratings",
          localField: "book",
          foreignField: "book",
          as: "rating",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $lookup: {
          from: "authors",
          localField: "book.author",
          foreignField: "_id",
          as: "book.author",
        },
      },
      {
        $unwind: "$book.author",
      },
    ]);

    if (!shelves || shelves.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Shelf not found",
      });
    }

    const shelf = shelves[0]; // Since we're querying by ID, we expect only one result

    const rating = shelf.rating.filter(
      (rating) => rating.user.toString() === req.userId
    );

    const average =
      shelf.rating.reduce((total, current) => current.score + total, 0) /
      shelf.rating.length;

    const shelfData = {
      ...shelf,
      rating: rating.length > 0 ? rating[0].score : null,
      average,
    };

    res.status(200).json({
      status: "success",
      data: {
        shelf: shelfData,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUserShelves = async (req, res, next) => {
  try {
    // user ali -> id = 0
    // 1. get all shelves that match user id 0 -> [1,2,3]
    // 2. {...shelf, rating[]}
    // 3. populate result -> {book, rating[], ...shelf}
    // require my rating, average rating
    // my rating => rating[].filter by user id
    // average   => rating[].reduce

    const shelves = await Shelf.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "ratings",
          localField: "book",
          foreignField: "book",
          as: "rating",
        },
      },
    ]);

    if (!shelves) {
      return res.status(404).json({
        status: "fail",
        message: "Shelf not Found",
      });
    }

    const resolved = await Shelf.populate(shelves, [
      {
        path: "book",
        select: "name",
        populate: {
          path: "author",
          select: "firstName lastName",
        },
      },
    ]);

    // {book, rating[], ...shelf}
    // 1. iterate over each shelf
    // 2. my rating = filter rating by user id -> [{}] || []
    // 3. average   = current.score + total / n
    // 4. return ...shelf,
    const mapped = resolved.map((shelf) => {
      const rating = shelf.rating.filter((rating) =>
        rating.user.equals(req.userId)
      );

      const average =
        shelf.rating.reduce((total, current) => current.score + total, 0) /
        shelf.rating.length;

      return {
        ...shelf,
        rating: rating.length > 0 ? rating[0].score : null,
        average,
      };
    });

    res.status(200).json({
      status: "success",
      data: {
        shelves: mapped,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateShelf = async (req, res, next) => {
  try {
    const shelf = await Shelf.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!shelf) {
      return res.status(404).json({
        status: "fail",
        message: "Shelf not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        shelf,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteShelf = async (req, res, next) => {
  try {
    const shelf = await Shelf.findByIdAndDelete(req.params.id);
    if (!shelf) {
      return res.status(404).json({
        status: "fail",
        message: "Shelf not Found",
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
  addShelf,
  getShelfById,
  updateShelf,
  deleteShelf,
  getAllUserShelves,
};
