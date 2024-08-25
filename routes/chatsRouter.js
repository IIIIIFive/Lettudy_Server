const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const chatsController = require("../controllers/chatsController");
const { createIdChain } = require("../utils/paramValidations");
const { createStringChain } = require("../utils/bodyValidations");

const chatRouter = express.Router();

chatRouter.get(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  chatsController.getChats
);

chatRouter.post(
  "/:roomId/message",
  validate([createIdChain("roomId", 36), createStringChain("content")]),
  verifyToken,
  authorizeUser,
  chatsController.sendMessage
);
module.exports = chatRouter;
