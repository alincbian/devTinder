const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const { validateSignupApi, validateLoginApi } = require("../utils/validator");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate signup data
    validateSignupApi(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await newUser.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

// Login API

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // validate
    validateLoginApi(emailId);

    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.send("Login successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successfully");
});

module.exports = authRouter;
