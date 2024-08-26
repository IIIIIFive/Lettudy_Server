const express = require("express");
const { verifyToken, authorizeUser } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const {
  updateAttendanceStatus,
  getUserAttendances,
} = require("../controllers/attendancesController");
const {
  createIdChain: createIdParamChain,
} = require("../utils/paramValidations");
const {
  createIdChain: createIdBodyChain,
} = require("../utils/bodyValidations");

const attendanceRouter = express.Router();

attendanceRouter.put(
  "/:roomId",
  validate([
    createIdParamChain("roomId", 36),
    createIdBodyChain("attendanceId"),
  ]),
  verifyToken,
  authorizeUser,
  updateAttendanceStatus
);

attendanceRouter.get(
  "/:roomId",
  validate([createIdParamChain("roomId", 36)]),
  verifyToken,
  authorizeUser,
  getUserAttendances
);

module.exports = attendanceRouter;
