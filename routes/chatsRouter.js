const express = require("express");
const multer = require("multer");
const chatRouter = express.Router();
const chatsController = require("../controllers/chatsController");
const { verifyToken } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");

const upload = multer();

chatRouter.get("/:roomId", validate([]), verifyToken, chatsController.getChats);

chatRouter.post(
  "/:roomId/message",
  validate([]),
  verifyToken,
  chatsController.sendMessage
);
module.exports = chatRouter;
