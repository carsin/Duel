var socketio = require("socket.io");
var io = socketio();

var socketAPI = {};
socketAPI.io = io;

io.on("connection", function(socket) {
    console.log("user connected");
});

module.exports = socketAPI;
