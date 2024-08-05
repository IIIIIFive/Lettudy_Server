const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  createRoom,
  getRoomByCode,
  getRooms,
  updateNotice,
} = require("../controllers/roomsController");
const roomRouter = express.Router();

roomRouter.post("/", verifyToken, createRoom); // 방 생성
roomRouter.get("/:roomCode", verifyToken, getRoomByCode); // 코드로 방 조회 성공
roomRouter.get("/", verifyToken, getRooms); // 가입한 방 조회
roomRouter.put("/:roomId/notice", verifyToken, updateNotice); // 공지 등록

module.exports = roomRouter;
