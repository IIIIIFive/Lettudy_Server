const express = require("express");
const linkRouter = express.Router();
const linkController = require("../controllers/linksController");
const { verifyToken, authorizeUser } = require("../middlewares/auth");

linkRouter.post(
  "/:roomId",
  verifyToken,
  authorizeUser,
  linkController.createLink
); // 자료 등록
linkRouter.get("/:roomId", verifyToken, authorizeUser, linkController.getLinks); // 자료 조회
linkRouter.delete(
  "/:roomId/:linkId",
  verifyToken,
  authorizeUser,
  linkController.deleteLink
); // 자료 삭제

module.exports = linkRouter;
