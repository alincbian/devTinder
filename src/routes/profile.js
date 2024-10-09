const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middleware/auth");
const {
  validateEditData,
  validateUpdatePasswordApi,
} = require("../utils/validator");

// Profile

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = res?.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

// edit profile

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditData(req);

    const loggedInUser = res.user;

    Object.keys(req.body)?.forEach(
      (item) => (loggedInUser[item] = req.body[item])
    );

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser?.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

// Update Password

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validateUpdatePasswordApi(req);

    const { oldPassword, newPassword } = req.body;

    const loggedInUser = res?.user;

    const isValidOldPassword = await bcrypt.compare(
      oldPassword,
      loggedInUser?.password
    );

    if (!isValidOldPassword) throw new Error("Old password is incorrect!");

    const passwordHashed = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = passwordHashed;

    await loggedInUser.save();

    res.json({ message: "Password updated sucessfully" });
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

module.exports = profileRouter;
