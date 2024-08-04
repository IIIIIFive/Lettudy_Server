const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { createMember } = require("../controllers/membersController");

const memberRouter = express.Router();

memberRouter.post("/:roomCode", verifyToken, createMember);
//memberRouter.delete("/:roomId", verifyToken);

module.exports = memberRouter;
