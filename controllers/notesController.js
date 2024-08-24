const { StatusCodes } = require("http-status-codes");
const noteService = require("../services/noteService");
const CustomError = require("../utils/CustomError");

const createNote = async (req, res) => {
  try {
    const roomId = req.roomId;
    const { title, content, images, tags } = req.body;

    const result = await noteService.createNote(
      roomId,
      title,
      content,
      images,
      tags
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const createPreSigned = async (req, res) => {
  try {
    const roomId = req.roomId;
    const { fileName } = req.body;
    const result = await noteService.createPreSigned(roomId, fileName);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const roomId = req.roomId;

    const result = await noteService.getNotes(roomId);
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getNoteContent = async (req, res) => {
  try {
    const { noteId } = req.params;
    const result = await noteService.getNoteContent(noteId);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    let { title, content, images, tags } = req.body;

    const result = await noteService.updateNote(
      noteId,
      title,
      content,
      images,
      tags
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const result = await noteService.deleteNote(noteId);
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createNote,
  createPreSigned,
  getNotes,
  updateNote,
  deleteNote,
  getNoteContent,
};
