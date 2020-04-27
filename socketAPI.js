var socketio = require("socket.io");
var io = socketio();

var socketAPI = {};
socketAPI.io = io;

io.on("connection", function(socket) {
    console.log("user connected");

    socket.on("disconnect", function(socket) {
        console.log("user disconnected");
    });
});

module.exports = socketAPI;
