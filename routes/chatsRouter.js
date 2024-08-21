const express = require("express");
const multer = require("multer");
const chatRouter = express.Router();
const chatsController = require("../controllers/chatsController");
const { verifyToken } = require("../middlewares/auth");

const upload = multer();

chatRouter.get("/:roomId", verifyToken, chatsController.getChats); // 채팅 내역 조회
chatRouter.post("/:roomId/message", verifyToken, chatsController.sendMessage); // 채팅 메시지 보내기

module.exports = chatRouter;
