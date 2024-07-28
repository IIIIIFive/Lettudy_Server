const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/usersController");

userRouter.post("/join");
userRouter.post("/login");
