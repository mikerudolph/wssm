const socket = require("socket.io-client")("http://localhost:3000");
socket.on("connect", () => console.log("client connected"));
socket.on("disconnect", () => console.log("client disconnected"));
socket.on("event", () => console.log("event happend"));
socket.on("start:game", (message) => console.log(`start:game triggered with message: ${message}`));
