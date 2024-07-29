const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 7777;

app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
  res.status(200).send("Lettudy Server");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const userRouter = require("./routes/usersRouter");

app.use("/users", userRouter);

module.exports = app;
