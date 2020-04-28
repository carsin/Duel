const socketio = require("socket.io");

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        console.log("user connected");

        socket.on("room create", function() {
            console.log("user created room");
        });

        socket.on("room join", function() {
            console.log("user joining room");
        });
    });
}
