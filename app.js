const express = require("express");
const cors = require("cors");
const { PORT } = require("./settings");

const app = express();
const port = PORT || 7777;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Lettudy Server");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 라우터 설정
const userRouter = require("./routes/usersRouter");
const roomRouter = require("./routes/roomsRouter");

app.use("/users", userRouter);
app.use("/rooms", roomRouter);

module.exports = app;
