const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  createRoom,
  getRoomByCode,
  createMember,
  getRooms,
} = require("../controllers/roomsController");
const roomRouter = express.Router();

roomRouter.post("/", verifyToken, createRoom);
roomRouter.get("/:roomCode", verifyToken, getRoomByCode);
roomRouter.post("/:roomCode/member", verifyToken, createMember);
roomRouter.get("/", verifyToken, getRooms);

module.exports = roomRouter;
