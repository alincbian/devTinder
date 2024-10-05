const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupApi, validateLoginApi } = require("./utils/validator");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // validate
    validateLoginApi(emailId);

    const user = await User.findOne({ emailId });

    if (!user) throw new Error("Invalid credentials");

    const passwordCompared = await bcrypt.compare(password, user?.password);

    if (passwordCompared) {
      res.send("Login successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

// Find user by emailId

app.get("/user", async (req, res) => {
  const { emailId } = req.body;

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

// Find user by id

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

// Feed users

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users?.length) {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

// Delete user

app.delete("/user", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

// Update user by id

app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    const UPDATE_ALLOWED = ["photoUrl", "gender", "about", "skills", "age"];

    const updateAllowed = Object.keys(data)?.every((item) =>
      UPDATE_ALLOWED?.includes(item)
    );

    if (!updateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills?.length > 10) {
      throw new Error("Skills should not more than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });

    await updatedUser.save();
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err?.message);
  }
});

// update user by email

app.patch("/user/byEmail", async (req, res) => {
  const { emailId } = req.body;
  const data = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ emailId }, data);

    await updatedUser.save();
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err);
  }
});

connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(7777, () => {
      console.log("server is listening on port: 7777...");
    });
  })
  .catch((err) => {
    console.log("DB can not be connected");
  });
