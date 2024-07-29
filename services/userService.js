const conn = require("../utils/db");
const userQueries = require("../queries/userQueries");
const { v4: uuidv4 } = require("uuid");
const { generateSalt, hashPassword } = require("../utils/hashedpw");

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
      throw new Error("이메일이 다시 입력해주세요");
    }

    const pw = hashPassword(password, salt);
    if (userData && userData.password == pw) {
      //   const accessToken = createAccessToken(userData.id);

      return {
        message: "로그인 성공",
        userId: userData.id,
        // token: accessToken,
      };
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  join,
  login,
};
