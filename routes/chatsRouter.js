const express = require("express");
const chatRouter = express.Router();
const chatsController = require("../controllers/chatsController");
const { verifyToken } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const { createIdChain } = require("../utils/paramValidations");
const { createStringChain } = require("../utils/bodyValidations");

chatRouter.get(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  chatsController.getChats
);

chatRouter.post(
  "/:roomId/message",
  validate([createIdChain("roomId", 36), createStringChain("content")]),
  verifyToken,
  chatsController.sendMessage
);
module.exports = chatRouter;
