const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  createRoom,
  getRooms,
  updateNotice,
  getRoom,
} = require("../controllers/roomsController");
const { validate } = require("../middlewares/validator");

const roomRouter = express.Router();

roomRouter.post("/", validate([]), verifyToken, createRoom);

roomRouter.get("/", verifyToken, getRooms);

roomRouter.put(
  "/:roomId/notice",
  validate([]),
  verifyToken,
  authorizeUser,
  updateNotice
);

roomRouter.get("/:roomId", validate([]), verifyToken, authorizeUser, getRoom);
module.exports = roomRouter;
