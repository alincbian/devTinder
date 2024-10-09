const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middleware/auth");

requestRouter.post("/requestConnection", userAuth, async (req, res) => {
  try {
    console.log("requset connection");
    res.send("request connection");
  } catch (err) {
    res.status(400).send("Error: " + err?.message);
  }
});

module.exports = requestRouter;
