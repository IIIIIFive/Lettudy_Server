const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  createRoom,
  getRooms,
  updateNotice,
  getRoom,
} = require("../controllers/roomsController");
const roomRouter = express.Router();

roomRouter.post("/", verifyToken, createRoom); // 방 생성
roomRouter.get("/", verifyToken, getRooms); // 가입한 방 조회
roomRouter.put("/:roomId/notice", verifyToken, authorizeUser, updateNotice); // 공지 등록
roomRouter.get("/:roomId", verifyToken, authorizeUser, getRoom);
module.exports = roomRouter;
