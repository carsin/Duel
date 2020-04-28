const socketio = require("socket.io");

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("index view", function(socket) {
        console.log("user connected");

        socket.on("room create", function() {
            socket.emit("redirect", "/create");
            console.log("user created room");
        });

        socket.on("room join", function() {
            socket.emit("redirect", "/join");
            console.log("user joining room");
        });
    });
}
