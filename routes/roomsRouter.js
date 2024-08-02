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

roomRouter.post("/", verifyToken, createRoom);
roomRouter.get("/:roomCode", verifyToken, getRoomByCode);
roomRouter.post("/:roomCode/member", verifyToken, createMember);
roomRouter.get("/", verifyToken, getRooms);
roomRouter.put("/:roomId/notice", verifyToken, updateNotice);

module.exports = roomRouter;
