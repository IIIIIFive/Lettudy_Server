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

// 회원탈퇴
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await userService.deleteUser(userId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// 이메일 중복확인
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.checkEmail(email);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// 마이페이지 회원 조회
const getMyPage = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await userService.getMyPage(userId);

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
  deleteUser,
  checkEmail,
  getMyPage,
};
