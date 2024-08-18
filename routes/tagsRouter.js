const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { getTags } = require("../controllers/tagsController");

const tagRouter = express.Router();

tagRouter.get("/:roomId", verifyToken, authorizeUser, getTags);

module.exports = tagRouter;
