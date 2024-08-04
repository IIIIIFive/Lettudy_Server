const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  createRoom,
  getRoomByCode,
  createMember,
  getRooms,
  updateNotice,
} = require("../controllers/roomsController");
const roomRouter = express.Router();

roomRouter.post("/", verifyToken, createRoom); // 방 생성
roomRouter.get("/:roomCode", verifyToken, getRoomByCode);
roomRouter.get("/", verifyToken, getRooms);
roomRouter.put("/:roomId/notice", verifyToken, updateNotice);

module.exports = roomRouter;
