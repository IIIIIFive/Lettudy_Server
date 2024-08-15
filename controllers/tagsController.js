const { StatusCodes } = require("http-status-codes");
const tagService = require("../services/tagService");

const getTags = async (req, res) => {
  try {
    const roomId = req.roomId;
    const result = await tagService.getTags(roomId);
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = { getTags };
