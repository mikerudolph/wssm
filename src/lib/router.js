'use strict';

const State = require("./state");

// todo: this is ugly af
module.exports = function(io) {
  return new Router(io);
};

function Router(io) {
  this._io = io;

  this.states = {};

  this._io.on("connection", (ioSocket) => {
    // check to see if there is a default state yet
    const defaultState = this._defaultState();
    if (defaultState) {
      defaultState.add(ioSocket);
    } else {
      console.log("no default state found to add socket into");
    }

    ioSocket.on("disconnect", () => {
      // handle remove socket from all states
    });
  });
};

Router.prototype._defaultState = function() {
  return Object.values(this.states).find(state => {
    return state.default === true;
  });
};

Router.prototype.state = function(stateObject) {
  console.log("we have defined a new state");
  // todo arg check
  // add a new state to the router
  this.states[stateObject.name] = new State(stateObject);
};

Router.prototype.transition = function(nextState) {
  // todo: make sure this is a valid state
  Object.values(this.states).forEach(state => {
    if (state.name === nextState) {
      return;
    }

    for (let socketId in state._sockets) {
      this.states[nextState].add(state._sockets[socketId]);
      // remove socket from old state
      state.remove(state._sockets[socketId]);
    }
  });
};
