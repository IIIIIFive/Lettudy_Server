const userService = require("../services/userService");
const { StatusCodes } = require("http-status-codes");

// 회원가입
const join = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await userService.join(name, email, password);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// 로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await userService.login(email, password);
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = {
  join,
  login,
};
