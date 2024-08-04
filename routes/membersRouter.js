const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { createMember } = require("../controllers/membersController");

const memberRouter = express.Router();

memberRouter.post("/:roomCode", verifyToken, createMember); // 멤버로 방 입장하기
//memberRouter.delete("/:roomId", verifyToken);

module.exports = memberRouter;
