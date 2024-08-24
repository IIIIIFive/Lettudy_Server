const express = require("express");
const scheduleRouter = express.Router();
const schedulesController = require("../controllers/schedulesController");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const {
  createIdChain: createIdParamChain,
  createIsAttendanceChain,
} = require("../utils/paramValidations");
const {
  createIdChain: createIdBodyChain,
  createStringWithLimitChain,
  createDateChain,
  createTimeChain,
  createBooleanChain,
} = require("../utils/bodyValidations");

scheduleRouter.post(
  "/",
  validate([
    createIdBodyChain("roomId"),
    createStringWithLimitChain("title", 100),
    createDateChain(),
    createTimeChain(),
    createBooleanChain("isAttendance"),
  ]),
  verifyToken,
  authorizeUser,
  schedulesController.createSchedule
);

scheduleRouter.delete(
  "/:roomId/:scheduleId",
  validate([
    createIdParamChain("roomId", 36),
    createIdParamChain("scheduleId", 36),
  ]),
  verifyToken,
  authorizeUser,
  schedulesController.deleteSchedule
); // 일정 삭제

scheduleRouter.get(
  "/:roomId",
  validate([createIdParamChain("roomId", 36), createIsAttendanceChain()]),
  verifyToken,
  authorizeUser,
  schedulesController.getSchedule
); // 일정(출석날짜) 조회

module.exports = scheduleRouter;
