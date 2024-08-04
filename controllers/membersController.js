const { StatusCodes } = require("http-status-codes");
const memberService = require("../services/memberService");

const createMember = async (req, res) => {
  try {
    const userId = req.userId;
    const code = req.params.roomCode;
    const profileNum = await memberService.createMember(userId, code);

    return res.status(StatusCodes.CREATED).json({
      profileNum,
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.message,
    });
  }
};

module.exports = { createMember };
