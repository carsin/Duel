const socketio = require("socket.io");
const hri = require("human-readable-ids").hri;

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        var roomId;
        console.log("user connected");

        socket.on("game create", function(usernameInput, selectedGame) {
            console.log(selectedGame + " game created by " + usernameInput + " ID: " + roomId);
        });

        socket.on("room create", function() {
            roomId = hri.random();
            socket.join(roomId);
            console.log("user created room with id " + roomId)
            socket.emit("room created", roomId);
        });

        socket.on("room join", function() {
            console.log("user joining room");
        });
    });
}
