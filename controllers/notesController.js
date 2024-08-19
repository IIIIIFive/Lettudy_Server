const { StatusCodes } = require("http-status-codes");
const noteService = require("../services/noteService");
const CustomError = require("../utils/CustomError");

const createNote = async (req, res) => {
  try {
    const roomId = req.roomId;
    const { title, content, tags } = req.body;

    const result = await noteService.createNote(roomId, title, content, tags);
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
    let { tag, limit, currentPage } = req.query;
    limit = parseInt(limit);
    currentPage = parseInt(currentPage);
    const tags = tag?.split(",") || [];

    if (!limit || !currentPage) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "잘못된 url 형식입니다.",
      });
    }

    const result = await noteService.getNotes(roomId, tags, limit, currentPage);
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
    let { title, content, tags } = req.body;
    if (!title || !content || !tags) {
      throw new CustomError("요청값을 확인해주세요", StatusCodes.BAD_REQUEST);
    }

    const result = await noteService.updateNote(noteId, title, content, tags);
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
