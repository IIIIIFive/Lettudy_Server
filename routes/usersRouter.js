const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/usersController");

userRouter.post("/join", userController.join); // 회원가입
userRouter.post("/login", userController.login); // 로그인

module.exports = userRouter;
