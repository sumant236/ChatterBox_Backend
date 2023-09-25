const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
const path = require("path");

dotenv.config();

connectDB();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, console.log(`PORT started on ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 300000,
  cors: { origin: "https://chatter-box-sandy.vercel.app" },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("new message", (newMsgRecieved) => {
    var chat = newMsgRecieved.chat;
    if (!chat.users) {
      return console.log("chat.users is not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == newMsgRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMsgRecieved);
    });
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
