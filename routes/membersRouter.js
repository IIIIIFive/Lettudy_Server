const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  createMember,
  getMembersRecord,
  deleteMember,
  updateAlarm,
} = require("../controllers/membersController");
const { validate } = require("../middlewares/validator");

const memberRouter = express.Router();

memberRouter.post("/:roomCode", validate([]), verifyToken, createMember);

memberRouter.delete(
  "/:roomId",
  validate([]),
  verifyToken,
  authorizeUser,
  deleteMember
);
memberRouter.get(
  "/:roomId",
  validate([]),
  verifyToken,
  authorizeUser,
  getMembersRecord
);
memberRouter.put(
  "/:roomId/alarm",
  validate([]),
  verifyToken,
  authorizeUser,
  updateAlarm
);

module.exports = memberRouter;
