const express = require("express");
const scheduleRouter = express.Router();
const schedulesController = require("../controllers/schedulesController");
const { verifyToken } = require("../middlewares/auth");

scheduleRouter.post("/", verifyToken, schedulesController.createSchedule); // 일정 등록
scheduleRouter.delete(
  "/:roomId/:scheduleId",
  verifyToken,
  schedulesController.deleteSchedule
); // 일정 삭제
scheduleRouter.get("/:roomId", verifyToken, schedulesController.getSchedule); // 일정 조회

module.exports = scheduleRouter;
