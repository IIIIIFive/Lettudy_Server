const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/auth");

userRouter.post("/join", userController.join); // 회원가입
userRouter.post("/login", userController.login); // 로그인
userRouter.delete("/quit", verifyToken, userController.deleteUser); // 회원탈퇴 (토큰 검증)
userRouter.post("/check-email", userController.checkEmail); // 이메일중복확인
userRouter.get("/mypage", verifyToken, userController.getMyPage); // 마이페이지 회원 조회
userRouter.post("/fcmToken", verifyToken, userController.updateFcmToken);
userRouter.delete("/fcmToken", verifyToken, userController.deleteFcmToken);

module.exports = userRouter;
