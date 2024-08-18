const linkService = require("../services/linkService");
const { StatusCodes } = require("http-status-codes");

// 자료 등록
const createLink = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.roomId;
    const { title, link } = req.body;

    const result = await linkService.createLink(roomId, userId, title, link);

    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 자료 조회
const getLinks = async (req, res) => {
  try {
    const roomId = req.roomId;

    const result = await linkService.getLinks(roomId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

// 자료 삭제
const deleteLink = async (req, res) => {
  try {
    const { linkId } = req.params;

    const result = await linkService.deleteLink(linkId);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createLink,
  getLinks,
  deleteLink,
};
