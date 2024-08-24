const express = require("express");
const linkRouter = express.Router();
const linkController = require("../controllers/linksController");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const { createIdChain } = require("../utils/paramValidations");
const {
  createStringWithLimitChain,
  createStringChain,
} = require("../utils/bodyValidations");

linkRouter.post(
  "/:roomId",
  validate([
    createIdChain("roomId", 36),
    createStringWithLimitChain("title", 100),
    createStringChain("link"),
  ]),
  verifyToken,
  authorizeUser,
  linkController.createLink
);

linkRouter.get(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  linkController.getLinks
);

linkRouter.delete(
  "/:roomId/:linkId",
  validate([createIdChain("roomId", 36), createIdChain("linkId", 36)]),
  verifyToken,
  authorizeUser,
  linkController.deleteLink
);

module.exports = linkRouter;
