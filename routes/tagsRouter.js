const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { getTags } = require("../controllers/tagsController");
const { validate } = require("../middlewares/validator");
const { createIdChain } = require("../utils/paramValidations");

const tagRouter = express.Router();

tagRouter.get(
  "/:roomId",
  validate([createIdChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  getTags
);

module.exports = tagRouter;
