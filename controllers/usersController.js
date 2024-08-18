const userService = require("../services/userService");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../utils/CustomError");

// 회원가입
const join = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await userService.join(name, email, password);
    res.status(StatusCodes.CREATED).json(result);
  } catch (err) {
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const updateFcmToken = async (req, res) => {
  try {
    const userId = req.userId;
    const { fcmToken } = req.body;

    if (!fcmToken) {
      throw new CustomError(
        "fcm 토큰이 없습니다. 요청값을 확인해주세요",
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await userService.updateFcmToken(userId, fcmToken);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const deleteFcmToken = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await userService.deleteFcmToken(userId);

    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
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
  updateFcmToken,
  deleteFcmToken,
};
