const { User } = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const loginController = async (req, res, next) => {
  let user;
  const { email, password } = req.body;
  try {
    user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Not Authenticated",
      });
    }
    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const isAdmin = user.role === "admin" ? true : false;
    res.status(200).json({
      status: "success",
      data: {
        token,
        isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginController;
