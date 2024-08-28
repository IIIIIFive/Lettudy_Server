const conn = require("../utils/db");
const userQueries = require("../queries/userQueries");
const roomQueries = require("../queries/roomQueries");
const { v4: uuidv4 } = require("uuid");
const { hashPassword, comparePassword } = require("../utils/hashedpw");
const { createAccessToken } = require("../middlewares/auth");
const CustomError = require("../utils/CustomError");
const { StatusCodes } = require("http-status-codes");
const memberQueries = require("../queries/memberQueries");

const join = async (name, email, password) => {
  try {
    const emailResult = await conn.query(userQueries.getUserByEmail, email);
    const user = emailResult[0][0];

    if (user) {
      throw new CustomError(
        "이미 존재하는 이메일입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    const userId = uuidv4();
    const hashedPassword = await hashPassword(password);

    let values = [userId, name, email, hashedPassword];

    await conn.query(userQueries.createUser, values);

    return {
      message: "회원가입 성공",
    };
  } catch (err) {
    throw err;
  }
};

const login = async (email, password) => {
  try {
    const userResult = await conn.query(userQueries.getUserByEmail, email);
    const userData = userResult[0][0];

    if (!userData) {
      throw new CustomError(
        "이메일을 다시 입력해주세요",
        StatusCodes.UNAUTHORIZED
      );
    }

    const isPasswordValid = await comparePassword(password, userData.password);

    if (!isPasswordValid) {
      throw new CustomError(
        "비밀번호가 일치하지 않습니다",
        StatusCodes.UNAUTHORIZED
      );
    }

    // jwt 발급
    const accessToken = createAccessToken(userData.id);

    return {
      message: "로그인 성공",
      userId: userData.id,
      token: accessToken,
    };
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (userId) => {
  try {
    await conn.query(userQueries.deleteUser, userId);

    return {
      message: "회원 탈퇴 성공",
    };
  } catch (err) {
    throw err;
  }
};

const checkEmail = async (email) => {
  try {
    const emailResult = await conn.query(userQueries.checkEmail, email);
    const { count } = emailResult[0][0];

    if (count) {
      throw new CustomError(
        "이미 존재하는 이메일입니다.",
        StatusCodes.BAD_REQUEST
      );
    }

    return {
      message: "사용 가능한 이메일입니다.",
    };
  } catch (err) {
    throw err;
  }
};

const getMyPage = async (userId) => {
  try {
    const userResult = await conn.query(userQueries.getUserById, userId);
    const user = userResult[0][0];

    const [roomsResult] = await conn.query(roomQueries.getRooms, userId);
    const rooms = roomsResult.map((room) => ({
      roomId: room.id,
      title: room.title,
      alarm: room.alarm === 1,
    }));

    return {
      message: "마이페이지 조회 성공",
      id: userId,
      name: user.name,
      email: user.email,
      rooms,
    };
  } catch (err) {
    throw err;
  }
};

const updateFcmToken = async (userId, fcmToken) => {
  const [updateResult] = await conn.query(userQueries.updateFcmToken, [
    fcmToken,
    userId,
  ]);

  if (updateResult.affectedRows === 0) {
    throw new CustomError("fcm 토큰 등록 실패", StatusCodes.BAD_REQUEST);
  }

  return {
    message: "fcm 토큰 등록 성공",
  };
};

const deleteFcmToken = async (userId) => {
  const [deleteResult] = await conn.query(userQueries.deleteFcmToken, userId);

  if (deleteResult.affectedRows === 0) {
    throw new CustomError("fcm 토큰 삭제 실패", StatusCodes.BAD_REQUEST);
  }

  await conn.query(memberQueries.getAlarmsOff, userId);

  return {
    message: "fcm 토큰 삭제 성공",
  };
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
