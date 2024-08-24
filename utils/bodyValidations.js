const { body } = require("express-validator");

const createEmailChain = () =>
  body("email")
    .notEmpty()
    .withMessage("email 필드 필요")
    .escape()
    .isEmail()
    .withMessage("email 형식이 아닙니다.");

const createDateChain = () =>
  body("date")
    .notEmpty()
    .withMessage("date 필드 필요")
    .escape()
    .isDate()
    .withMessage("date 형식이 잘못되었습니다.");

const createTimeChain = () =>
  body("time")
    .notEmpty()
    .withMessage("time 필드 필요")
    .escape()
    .isTime({ format: "HH:MM" })
    .withMessage("time 형식이 잘못되었습니다.");

const createStringWithLimitChain = (fieldName, limit) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드 필요`)
    .escape()
    .isString()
    .withMessage(`${fieldName}: string 타입입니다.`)
    .isLength({ max: limit })
    .withMessage(`${fieldName} 10자 이상일 수 없습니다.`);

const createStringChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드 필요`)
    .escape()
    .isString()
    .withMessage(`${fieldName}: string 타입입니다.`);

const createArrayChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드 필요`)
    .escape()
    .isArray()
    .withMessage(`${fieldName}: array 타입입니다.`);

const createBooleanChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드 필요`)
    .escape()
    .isBoolean()
    .withMessage(`${fieldName}: boolean 타입입니다.`);

const createIdChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드 필요`)
    .escape()
    .isString()
    .withMessage(`${fieldName}: string 타입입니다.`)
    .isLength(36)
    .withMessage(`${fieldName}는 36자입니다.`);

module.exports = {
  createEmailChain,
  createDateChain,
  createTimeChain,
  createStringWithLimitChain,
  createStringChain,
  createArrayChain,
  createBooleanChain,
  createIdChain,
};
