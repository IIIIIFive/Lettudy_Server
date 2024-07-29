const conn = require("../utils/db");
const userQueries = require("../queries/userQueries");
const { v4: uuidv4 } = require("uuid");
const { generateSalt, hashPassword } = require("../utils/hashedpw");
const { createAccessToken } = require("../middlewares/auth");

const join = async (name, email, password) => {
  try {
    const emailResult = await conn.query(userQueries.getUserByEmail, email);
    const user = emailResult[0][0];

    if (user) {
      throw new Error("이미 존재하는 이메일입니다.");
    }

    const userId = uuidv4();
    const salt = await generateSalt();
    const hashedpw = await hashPassword(password, salt);

    let values = [userId, name, email, hashedpw, salt];

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
      throw new Error("이메일을 다시 입력해주세요");
    }

    const hashedPassword = await hashPassword(password, userData.salt);

    if (userData.password !== hashedPassword) {
      throw new Error("비밀번호가 일치하지 않습니다");
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
      return {
        message: "이미 존재하는 이메일입니다.",
      };
    } else {
      return {
        message: "사용 가능한 이메일입니다.",
      };
    }
  } catch (err) {
    throw err;
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const salt = await generateSalt();
    const hashedPw = await hashPassword(newPassword, salt);

    await conn.query(userQueries.updatePassword, [hashedPw, salt, userId]);

    return {
      message: "비밀번호 재설정 성공",
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  join,
  login,
  deleteUser,
  checkEmail,
  resetPassword,
};
