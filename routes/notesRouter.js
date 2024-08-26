const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getNoteContent,
  createPreSigned,
} = require("../controllers/notesController");
const {
  createIdChain: createIdParamChain,
} = require("../utils/paramValidations");
const {
  createStringWithLimitChain,
  createStringChain,
  createArrayChain,
  createIdChain: createIdBodyChain,
} = require("../utils/bodyValidations");

const noteRouter = express.Router();

noteRouter.post(
  "/:roomId",
  validate([
    createIdParamChain("roomId", 36),
    createStringWithLimitChain("title", 100),
    createStringChain("content"),
    createArrayChain("images"),
    createArrayChain("tags"),
  ]),
  verifyToken,
  authorizeUser,
  createNote
);

noteRouter.post(
  "/:roomId/presigned",
  validate([createIdParamChain("roomId", 36), createStringChain("fileName")]),
  verifyToken,
  authorizeUser,
  createPreSigned
);

noteRouter.get(
  "/:roomId",
  validate([createIdParamChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  getNotes
);

noteRouter.get(
  "/:roomId/:noteId",
  validate([
    createIdParamChain("roomId", 36),
    createIdParamChain("noteId", 36),
  ]),
  verifyToken,
  authorizeUser,
  getNoteContent
);

noteRouter.put(
  "/:noteId",
  validate([
    createIdParamChain("noteId", 36),
    createIdBodyChain("roomId"),
    createStringWithLimitChain("title", 100),
    createStringChain("content"),
    createArrayChain("images"),
    createArrayChain("tags"),
  ]),
  verifyToken,
  authorizeUser,
  updateNote
);

noteRouter.delete(
  "/:roomId/:noteId",
  validate([
    createIdParamChain("roomId", 36),
    createIdParamChain("noteId", 36),
  ]),
  verifyToken,
  authorizeUser,
  deleteNote
);
module.exports = noteRouter;
