const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const {
  createRoom,
  getRoomById,
  createMember,
  getRooms,
} = require("../controllers/roomsController");
const roomRouter = express.Router();

roomRouter.post("/", verifyToken, createRoom);
roomRouter.get("/:roomId", verifyToken, getRoomById);
roomRouter.post("/:roomId/member", verifyToken, createMember);
roomRouter.get("/", verifyToken, getRooms);

module.exports = roomRouter;
