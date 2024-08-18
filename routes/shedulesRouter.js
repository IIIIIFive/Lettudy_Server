const express = require("express");
const scheduleRouter = express.Router();
const schedulesController = require("../controllers/schedulesController");
const { verifyToken, authorizeUser } = require("../middlewares/auth");

scheduleRouter.post(
  "/",
  verifyToken,
  authorizeUser,
  schedulesController.createSchedule
); // 일정 등록

scheduleRouter.delete(
  "/:roomId/:scheduleId",
  verifyToken,
  authorizeUser,
  schedulesController.deleteSchedule
); // 일정 삭제

scheduleRouter.get(
  "/:roomId",
  verifyToken,
  authorizeUser,
  schedulesController.getSchedule
); // 일정(출석날짜) 조회

module.exports = scheduleRouter;
