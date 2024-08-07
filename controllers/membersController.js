const { StatusCodes } = require("http-status-codes");
const memberService = require("../services/memberService");
const roomService = require("../services/roomService");

const createMember = async (req, res) => {
  try {
    const userId = req.userId;
    const code = req.params.roomCode;
    const result = await roomService.createMember(userId, code);

    return res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getMembersRecord = async (req, res) => {
  try {
    const roomId = req.roomId;
    const result = await memberService.getMembersRecord(roomId);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = { createMember, getMembersRecord };
