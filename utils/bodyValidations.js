const { body } = require("express-validator");

const createEmailChain = () =>
  body("email")
    .notEmpty()
    .withMessage("email 필드는 공란일 수 없습니다.")
    .isEmail()
    .withMessage("email 형식이 아닙니다.");

const createDateChain = () =>
  body("date")
    .notEmpty()
    .withMessage("date 필드는 공란일 수 없습니다.")
    .isDate()
    .withMessage("date 형식이 잘못되었습니다.");

const createTimeChain = () =>
  body("time")
    .notEmpty()
    .withMessage("time 필드는 공란일 수 없습니다.")
    .isTime({ format: "HH:MM" })
    .withMessage("time 형식이 잘못되었습니다.");

const createStringWithLimitChain = (fieldName, limit) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드는 공란일 수 없습니다.`)
    .isString()
    .withMessage(`${fieldName} 필드는 string 타입입니다.`)
    .isLength({ max: limit })
    .withMessage(`${fieldName} 필드는 ${limit}자 이하여야 합니다.`);

const createStringChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드는 공란일 수 없습니다.`)
    .isString()
    .withMessage(`${fieldName} 필드는 string 타입입니다.`);

const createArrayChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드는 공란일 수 없습니다.`)
    .isArray()
    .withMessage(`${fieldName} 필드는 array 타입입니다.`);

const createBooleanChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드는 공란일 수 없습니다.`)
    .isBoolean()
    .withMessage(`${fieldName} 필드는 boolean 타입입니다.`);

const createIdChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드는 공란일 수 없습니다.`)
    .isString()
    .withMessage(`${fieldName} 필드는 string 타입입니다.`)
    .isLength({ min: 36, max: 36 })
    .withMessage(`${fieldName} 필드는 36자입니다.`);

const createUrlChain = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} 필드는 공란일 수 없습니다.`)
    .isURL()
    .withMessage(`URL 형식이 유효하지 않습니다.`);

module.exports = {
  createEmailChain,
  createDateChain,
  createTimeChain,
  createStringWithLimitChain,
  createStringChain,
  createArrayChain,
  createBooleanChain,
  createIdChain,
  createUrlChain,
};
