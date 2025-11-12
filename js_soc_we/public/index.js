console.log("Welcome to Websockets with Socket.io");
let socket = io();

// let btn = document.getElementById("btn");
// btn.addEventListener("click", () => {
//   socket.emit("from_client", "Hello from client");
// });
// // the server event is been taken and added
// socket.on("from_server", () => {
//   let div = document.getElementById("from_server");
//   let p = document.createElement("p");
//   p.textContent = "Message from server received";
//   div.appendChild(p);
// });

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  let input = document.getElementById("chat_box");
  let msgList = document.getElementById("msg_list");
  let sendButton = document.getElementById("send");

  sendButton.addEventListener("click", () => {
    let message = input.value;
    // send it to the server
    socket.emit("new_message", { message: message });
    input.value = "";
  });

  socket.on("message_received", (message) => {
    let li = document.createElement("li");
    li.textContent = message;
    document.getElementById("msg_list").appendChild(li);
  });
});
