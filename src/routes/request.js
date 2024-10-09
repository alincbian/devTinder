const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = res.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus?.includes(status))
        return res.status(400).json({ message: "Invalid status type" });

      const toUser = await User.findById(toUserId);

      if (!toUser) return res.status(400).json({ message: "User not found" });

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest)
        return res
          .status(400)
          .json({ message: "Connection Request already exists" });

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.json({
        message: `${res.user.firstName} is ${status} in ${toUser.firstName}`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("Error: " + err?.message);
    }
  }
);

module.exports = requestRouter;
