const socketio = require("socket.io");
const hri = require("human-readable-ids").hri;

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        console.log("user connected");

        socket.on("game create", function(usernameInput, selectedGame) {
            console.log(selectedGame + " game created by " + usernameInput + " ID: " + roomId);
        });

        socket.on("room create", function() {
            var roomId = hri.random();
            socket.join(roomId);
            socket.emit("room created", roomId);
            console.log("user created room with id " + roomId)
        });

        socket.on("attemptRoomJoin", function(username, roomId) {
            // Unelegant. Refactor in future?
            try {
                if (io.sockets.adapter.rooms[roomId].length >= 1) {
                    socket.join(roomId);
                    socket.emit("room join success");
                    console.log(username + " joined room " + roomId);
                }
            }
            catch(e) {
                socket.emit("room join failed");
                console.log(username + " failed joining room " + roomId);

            }
       });
    });
}
