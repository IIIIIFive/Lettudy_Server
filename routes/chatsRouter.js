const express = require("express");
const multer = require("multer");
const chatRouter = express.Router();
const chatsController = require("../controllers/chatsController");
const { verifyToken } = require("../middlewares/auth");

const upload = multer();

chatRouter.get("/:roomId", verifyToken, chatsController.getChats); // 채팅 내역 조회
chatRouter.post("/:roomId/message", verifyToken, chatsController.sendMessage); // 채팅 메시지 보내기
chatRouter.post(
  "/:roomId/image",
  verifyToken,
  upload.single("image"),
  chatsController.sendImage
); // 채팅 이미지 보내기
chatRouter.delete(
  "/:roomId/:chatItemId",
  verifyToken,
  chatsController.deleteMessage
); // 채팅 메시지 삭제

module.exports = chatRouter;
