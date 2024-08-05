const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  createMember,
  getMembersRecord,
} = require("../controllers/membersController");

const memberRouter = express.Router();

memberRouter.post("/:roomCode", verifyToken, createMember); // 멤버로 방 입장하기
//memberRouter.delete("/:roomId", verifyToken, authorizeUser);
memberRouter.get("/:roomId", verifyToken, authorizeUser, getMembersRecord);

module.exports = memberRouter;
