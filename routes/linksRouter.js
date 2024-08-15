const express = require("express");
const linkRouter = express.Router();
const linkController = require("../controllers/linksController");
const { verifyToken } = require("../middlewares/auth");

linkRouter.post("/:roomId", verifyToken, linkController.createLink); // 자료 등록
linkRouter.get("/:roomId", verifyToken, linkController.getLinks); // 자료 조회
linkRouter.delete("/:linkId", verifyToken, linkController.deleteLink); // 자료 삭제

module.exports = linkRouter;
