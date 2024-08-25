const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const {
  createRoom,
  getRooms,
  updateNotice,
  getRoom,
} = require("../controllers/roomsController");
const {
  createStringWithLimitChain,
  createArrayChain,
} = require("../utils/bodyValidations");
const { createIdChain } = require("../utils/paramValidations");

const roomRouter = express.Router();

roomRouter.post(
  "/",
  validate([createStringWithLimitChain("title", 10)]),
  verifyToken,
  createRoom
);

roomRouter.get("/", verifyToken, getRooms);

roomRouter.put(
  "/:roomId/notice",
  validate([createIdChain("roomId", 36), createArrayChain("notice")]),
  verifyToken,
  authorizeUser,
  updateNotice
);

roomRouter.get(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  getRoom
);
module.exports = roomRouter;
