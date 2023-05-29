const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body, check } = require("express-validator");

// TODO: --> add confirm password field and validation
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "reader"],
    default: "reader",
  },
});

// is exist + role

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

const userCreateValidationRules = [
  body("fullname").isString().withMessage("Full name must be a string"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

const userUpdateValidationRules = [
  check("fullname")
    .optional()
    .isString()
    .withMessage("Full name must be a string"),
  check("email").optional().isEmail().withMessage("Invalid email address"),
  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

const addAdmin = async () => {
  try {
    // Check if admin user already exists
    const adminExists = await User.exists({ role: "admin" });

    if (adminExists) {
      console.log("Admin user already exists. Skipping creation.");
      return;
    }

    // Create the admin user
    const adminUser = new User({
      fullname: "Admin User",
      email: "admin@admin.com",
      password: "Admin123",
      role: "admin",
    });

    // Save the admin user to the database
    await adminUser.save();

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

module.exports = {
  User,
  userCreateValidationRules,
  userUpdateValidationRules,
  addAdmin,
};
