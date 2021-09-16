import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { get_Current_User, user_Disconnect, join_User } from "./dummyuser";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});


var PORT = Number(process.env.PORT || 4000);
var HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//initializing the socket io connection
io.on("connection", (socket:Socket) => {

  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    //* create user
    const p_user = join_User(socket.id, username, roomname);
    console.log(socket.id, "=id");
    socket.join(p_user.room);

    //display a welcome message to the user who have joined a room
    socket.emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `Welcome ${p_user.username}`,
    });

    //displays a joined room message to all other room users except that particular user
    socket.broadcast.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: `${p_user.username} has joined the chat`,
    });
  });

  //user sending message
  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const p_user = get_Current_User(socket.id);

    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  //when the user exits the room
  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const p_user = user_Disconnect(socket.id);

    if (p_user) {
      io.to(p_user.room).emit("message", {
        userId: p_user.id,
        username: p_user.username,
        text: `${p_user.username} has left the room`,
      });
    }
  });
});

app.get("/", (_req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

// server.listen(4000)