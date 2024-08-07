const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { PORT } = require("./settings");

const app = express();
const port = PORT || 7777;

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("New Client connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Client joiend room: ${roomId}`);
  });

  socket.on("sendMessage", (message) => {
    io.to(message.roomId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Lettudy Server");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 라우터 설정
const userRouter = require("./routes/usersRouter");
const roomRouter = require("./routes/roomsRouter");
const memberRouter = require("./routes/membersRouter");
const scheduleRouter = require("./routes/shedulesRouter");
const chatRouter = require("./routes/chatsRouter");
const attendanceRouter = require("./routes/attendancesRouter");

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/members", memberRouter);
app.use("/schedules", scheduleRouter);
app.use("/chats", chatRouter);
app.use("/attendances", attendanceRouter);

module.exports = app;
