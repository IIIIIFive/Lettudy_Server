const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");

userRouter.post("/join", validate([]), userController.join);

userRouter.post("/login", validate([]), userController.login);

userRouter.delete("/quit", verifyToken, userController.deleteUser);

userRouter.post("/check-email", validate([]), userController.checkEmail);

userRouter.get("/mypage", verifyToken, userController.getMyPage);

userRouter.post(
  "/fcmToken",
  validate([]),
  verifyToken,
  userController.updateFcmToken
);

userRouter.delete("/fcmToken", verifyToken, userController.deleteFcmToken);

module.exports = userRouter;
