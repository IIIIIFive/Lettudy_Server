const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const schedulesController = require("../controllers/schedulesController");
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

const scheduleRouter = express.Router();

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
);

scheduleRouter.get(
  "/:roomId",
  validate([createIdParamChain("roomId", 36), createIsAttendanceChain()]),
  verifyToken,
  authorizeUser,
  schedulesController.getSchedule
);

module.exports = scheduleRouter;
