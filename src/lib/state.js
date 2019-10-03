'use strict';

module.exports = State;

// TODO... this needs to become a factory
function State(config) {
  // todo: args check
  this.name = config.name;
  this.default = config.default ? config.default : false;
  this._events = {}

  this._sockets = {};

  for (let eventName in config.events) {
    // todo verify these functions
    this._events[eventName] = config.events[eventName];
  }

  return this;
}

State.prototype.add = function(socket) {
  // arg check
  if (!this._sockets[socket.id]) {
    this._sockets[socket.id] = socket;
  }

  // bind the socket to state events
  for (let eventName in this._events) {
    socket.on(eventName, this._events[eventName]);
  }
};

State.prototype.remove = function(socket) {
  if (!this._sockets[socket.id]) {
    // socket was never in here
    return;
  }

  for (let eventName in this._events) {
    socket.off(eventName, this._events[eventName]);
  }

  delete this._sockets[socket.id];
}

State.prototype.broadcast = function() {
  for (let socketId in this._sockets) {
    this._sockets[socketId].emit.apply(this._sockets[socketId], arguments);
  }
}
