const { StatusCodes } = require("http-status-codes");
const memberService = require("../services/memberService");

const createMember = async (req, res) => {
  try {
    const userId = req.userId;
    const code = req.params.roomCode;
    const result = await memberService.createMember(userId, code);

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

const deleteMember = async (req, res) => {
  try {
    const roomId = req.roomId;
    const userId = req.userId;
    const result = await memberService.deleteMember(userId, roomId);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(res.statusCode || 500).json({
      message: err.message,
    });
  }
};

const updateAlarm = async (req, res) => {
  try {
    const roomId = req.roomId;
    const userId = req.userId;
    let { alarm } = req.body;

    alarm = alarm ? 1 : 0;

    const result = await memberService.updateAlarm(userId, roomId, alarm);

    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(res.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = { createMember, getMembersRecord, deleteMember, updateAlarm };
