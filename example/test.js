'use strict';

const app = require("express");
const http = require('http').Server(app);

const io = require('socket.io')(http, {
    serveClient: false,
});

http.listen(3000, () => {
  console.log("listening on port: 3000");
});

const wssm = require("../src/index").Router(io);

wssm.state({
  name: "lobby",
  default: true,
  events: {
    "start:game": () => {
      console.log("start:game event has been fired");
      setTimeout(() => {
        console.log("moving all sockets to next state");

        wssm.transition("game");
      }, 5000);
    }
  }
});

wssm.state({
  name: "game",
  events: {
    "game:begin": () => {
      console.log("game:begin has been fired");
    }
  }
});
