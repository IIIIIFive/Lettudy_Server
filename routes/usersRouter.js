const express = require("express");
const { verifyToken } = require("../middlewares/auth");
const { validate } = require("../middlewares/validator");
const userController = require("../controllers/usersController");
const {
  createEmailChain,
  createStringWithLimitChain,
  createStringChain,
} = require("../utils/bodyValidations");

const userRouter = express.Router();

userRouter.post(
  "/join",
  validate([
    createEmailChain(),
    createStringWithLimitChain("name", 10),
    createStringChain("password"),
  ]),
  userController.join
);

userRouter.post(
  "/login",
  validate([createEmailChain(), createStringChain("password")]),
  userController.login
);

userRouter.delete("/quit", verifyToken, userController.deleteUser);

userRouter.post(
  "/check-email",
  validate([createEmailChain()]),
  userController.checkEmail
);

userRouter.get("/mypage", verifyToken, userController.getMyPage);

userRouter.post(
  "/fcmToken",
  validate([createStringChain("fcmToken")]),
  verifyToken,
  userController.updateFcmToken
);

userRouter.delete("/fcmToken", verifyToken, userController.deleteFcmToken);

module.exports = userRouter;
