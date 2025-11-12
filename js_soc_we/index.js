const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// app.get("/", (req, res) => {
//   //   res.send("Hello World from Websockets!");
//   res.sendFile(__dirname + "/public/index.html");
// });
//   we can also use express.static
app.use("/", express.static(__dirname + "/public"));
// app.get

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("new_message", (data) => {
    console.log("Message from client:", data.message);
    // Broadcast the message to all connected clients
    // io.emit("message_received", data.message); to the entire client to send certain thing from the server
    // socket.broadcast.emit("message_received", data.message); to all other clients except the sender
    socket.emit("message_received", data.message);
  });

  //   socket.on("from_client", () => {
  //     console.log(`Receiving the event from the client`);
  //   });

  //   setInterval(() => {
  //     let date = new Date();
  //     let time =
  //       date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  //     socket.emit("from_server", time);
  //   }, 3000);
});
// app.listen
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
//
