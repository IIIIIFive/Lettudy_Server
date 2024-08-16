const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  getNoteContent,
} = require("../controllers/notesController");

const noteRouter = express.Router();

noteRouter.post("/:roomId", verifyToken, authorizeUser, createNote);
noteRouter.get("/:roomId", verifyToken, authorizeUser, getNotes);
noteRouter.get("/:roomId/:noteId", verifyToken, authorizeUser, getNoteContent);
noteRouter.put("/:noteId", verifyToken, authorizeUser, updateNote);
noteRouter.delete("/:roomId/:noteId", verifyToken, authorizeUser, deleteNote);
module.exports = noteRouter;
