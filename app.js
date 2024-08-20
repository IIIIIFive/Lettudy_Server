const express = require("express");
const http = require("http");
const cors = require("cors");
const { PORT } = require("./settings");
const initSocket = require("./sockets/chatSocket");

const app = express();
const port = PORT || 5000;

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173", "https://lettudy.netlify.app"], // 허용하고자 하는 도메인
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 쿠키를 사용한 인증을 허용
};

app.use(cors(corsOptions));
const server = http.createServer(app);
initSocket(server);

app.get("/", (req, res) => {
  res.status(200).send("Lettudy Server");
});

app.get("/html", (req, res) => {
  res.sendFile(join(__dirname, "/index.html"));
});

// 라우터 설정
const userRouter = require("./routes/usersRouter");
const roomRouter = require("./routes/roomsRouter");
const memberRouter = require("./routes/membersRouter");
const scheduleRouter = require("./routes/shedulesRouter");
const chatRouter = require("./routes/chatsRouter");
const attendanceRouter = require("./routes/attendancesRouter");
const noteRouter = require("./routes/notesRouter");
const tagRouter = require("./routes/tagsRouter");
const linkRouter = require("./routes/linksRouter");
const { join } = require("path");

app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/members", memberRouter);
app.use("/schedules", scheduleRouter);
app.use("/chats", chatRouter);
app.use("/attendances", attendanceRouter);
app.use("/notes", noteRouter);
app.use("/tags", tagRouter);
app.use("/links", linkRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
