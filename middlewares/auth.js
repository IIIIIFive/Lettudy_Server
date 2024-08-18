const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { JWT_SECRET } = require("../settings");
const { checkRoom } = require("../services/roomService");
const { checkMember } = require("../services/memberService");

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // 'Bearer'와 토큰을 분리

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access token이 필요합니다" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "유효하지 않은 access token입니다" });
    }
    req.userId = decoded.id; // 토큰에서 사용자 ID를 요청 객체에 추가
    next();
  });
};

// 유효한 방인지, 유저가 해당 방의 멤버인지 체크하는 미들웨어
// 요청 객체에 방 ID 추가 (req.roomId)
const authorizeUser = async (req, res, next) => {
  const userId = req.userId;
  const roomId = req.params.roomId || req.body.roomId;

  if (!roomId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "스터디방 id가 필요합니다" });
  }

  const isValidRoomId = await checkRoom(roomId);
  if (!isValidRoomId) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "존재하지 않는 스터디입니다." });
  }

  const isValidMember = await checkMember(userId, roomId);
  if (!isValidMember) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "해당 스터디 멤버가 아닙니다." });
  }

  req.roomId = roomId;
  next();
};

module.exports = {
  createAccessToken,
  verifyToken,
  authorizeUser,
};
