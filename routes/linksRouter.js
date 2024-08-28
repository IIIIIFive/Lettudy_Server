const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const linkController = require("../controllers/linksController");
const { createIdChain } = require("../utils/paramValidations");
const {
  createStringWithLimitChain,
  createUrlChain,
} = require("../utils/bodyValidations");

const linkRouter = express.Router();

linkRouter.post(
  "/:roomId",
  validate([
    createIdChain("roomId", 36),
    createStringWithLimitChain("title", 100),
    createUrlChain("link"),
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
