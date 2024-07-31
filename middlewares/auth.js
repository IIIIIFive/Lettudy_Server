const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET } = require('../settings');

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer'와 토큰을 분리

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Access token이 필요합니다' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: '유효하지 않은 access token입니다' });
    }
    req.userId = decoded.id; // 토큰에서 사용자 ID를 요청 객체에 추가
    next();
  });
};

module.exports = {
  createAccessToken,
  verifyToken,
};
