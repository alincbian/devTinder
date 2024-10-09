const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userShcema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid password " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is incorrect gender type`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default about of a user!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userShcema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user?._id }, "DEV@Tinder123", {
    expiresIn: "7d",
  });

  return token;
};

userShcema.methods.validatePassword = async function (passwordInputByUser) {
  const passwordHash = this.password;

  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isValidPassword;
};

module.exports = mongoose.model("User", userShcema);
