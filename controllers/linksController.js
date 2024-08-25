const linkService = require("../services/linkService");
const { StatusCodes } = require("http-status-codes");

const createLink = async (req, res) => {
  try {
    const userId = req.userId;
    const roomId = req.roomId;
    const { title, link } = req.body;

    const result = await linkService.createLink(roomId, title, link);

    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

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
