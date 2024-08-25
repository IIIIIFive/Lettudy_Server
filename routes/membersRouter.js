const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const {
  createMember,
  getMembersRecord,
  deleteMember,
  updateAlarm,
} = require("../controllers/membersController");
const { createIdChain } = require("../utils/paramValidations");
const { createBooleanChain } = require("../utils/bodyValidations");

const memberRouter = express.Router();

memberRouter.post(
  "/:roomCode",
  validate([createIdChain("roomCode", 6)]),
  verifyToken,
  createMember
);

memberRouter.delete(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  deleteMember
);
memberRouter.get(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  getMembersRecord
);
memberRouter.put(
  "/:roomId/alarm",
  validate([createIdChain("roomId", 36), createBooleanChain("alarm")]),
  verifyToken,
  authorizeUser,
  updateAlarm
);

module.exports = memberRouter;
