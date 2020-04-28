const socketio = require("socket.io");
const hri = require("human-readable-ids").hri; // Code own version?

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        console.log("user connected");

        socket.on("createRoom", function(username) {
            var roomId = hri.random();
            socket.join(roomId);

            var room = io.sockets.adapter.rooms[roomId];

            socket.username = username;
            room.usernames = [];
            room.usernames.push(username);

            socket.emit("room created", roomId);
            io.to(roomId).emit("updatePlayerList", room.usernames);

            socket.on("disconnect", function() {
                io.to(roomId).emit("updatePlayerList", room.usernames);
            });
            console.log("user created room with id " + roomId)
        });

        socket.on("attemptRoomJoin", function(username, roomId) {
            // Not elegant. Refactor in future?
            var room = io.sockets.adapter.rooms[roomId];

            try {
                if (room.length >= 1) {
                    if (!(room.usernames.includes(username))) {
                        socket.join(roomId);

                        room.usernames.push(username);
                        socket.username = username;

                        io.to(roomId).emit("updatePlayerList", room.usernames);
                        socket.emit("room join success", room, roomId);

                        console.log(username + " joined room " + roomId);

                        socket.on("disconnect", function() {
                            var index = room.usernames.indexOf(socket.username);
                            if (index !== -1) room.usernames.splice(index, 1);
                            io.to(roomId).emit("updatePlayerList", room.usernames);
                            console.log(socket.username + " disconnected from room " + roomId);
                        });
                    } else {
                        console.log(username + " failed joining room " + roomId + ", username taken");
                        socket.emit("room join failed");
                    }
                }
            } catch(e) {
                socket.emit("room join failed");
                console.log(username + " failed joining room " + roomId + ", room doesn't exist");
            }
       });
    });
}
