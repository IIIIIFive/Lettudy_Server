const express = require("express");
const scheduleRouter = express.Router();
const schedulesController = require("../controllers/schedulesController");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");

scheduleRouter.post(
  "/",
  validate([]),
  verifyToken,
  authorizeUser,
  schedulesController.createSchedule
);

scheduleRouter.delete(
  "/:roomId/:scheduleId",
  validate([]),
  verifyToken,
  authorizeUser,
  schedulesController.deleteSchedule
); // 일정 삭제

scheduleRouter.get(
  "/:roomId",
  validate([]),
  verifyToken,
  authorizeUser,
  schedulesController.getSchedule
); // 일정(출석날짜) 조회

module.exports = scheduleRouter;
