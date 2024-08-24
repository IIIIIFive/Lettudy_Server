const { param, query } = require("express-validator");

const createIdChain = (paramName, limit) =>
  param(paramName)
    .notEmpty()
    .escape()
    .isLength({ min: limit, max: limit })
    .withMessage(`${paramName}가 유효하지 않습니다.`);

const createIsAttendanceChain = () =>
  query("isAttendance")
    .optional()
    .escape()
    .isBoolean()
    .withMessage("isAttendance는 boolean 타입입니다.");

module.exports = {
  createIdChain,
  createIsAttendanceChain,
};
