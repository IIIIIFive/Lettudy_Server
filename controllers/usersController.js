const userService = require("../services/userService");
const { StatusCodes } = require("http-status-codes");

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
