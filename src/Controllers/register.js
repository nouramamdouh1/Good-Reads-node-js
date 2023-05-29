const { User } = require("../Models/user");

const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await User.findOne({ email }); //projection

    if (existing) {
      return res.status(201).json({
        status: "fail",
        message: "Email already registered",
      });
    }

    const newUser = await User.create({
      ...req.body,
      role: "reader",
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = registerUser;
