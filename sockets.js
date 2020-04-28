const socketio = require("socket.io");
const hri = require("human-readable-ids").hri; // Code own version?

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        console.log("user connected");

        socket.on("createRoom", function(username) {
            var roomId = hri.random();
            socket.join(roomId);
            socket.username = username;
            io.sockets.adapter.rooms[roomId].usernames = [];
            io.sockets.adapter.rooms[roomId].usernames.push(username);
            console.log(io.sockets.adapter.rooms[roomId]);
            socket.emit("room created", roomId);
            console.log("user created room with id " + roomId)
        });

        socket.on("attemptRoomJoin", function(username, roomId) {
            // Not elegant. Refactor in future?
            try {
                if (io.sockets.adapter.rooms[roomId].length >= 1) {
                    if (!(io.sockets.adapter.rooms[roomId].usernames.includes(username))) {
                        socket.join(roomId);
                        socket.emit("room join success");
                        console.log(username + " joined room " + roomId);
                    } else {
                        console.log(username + " failed joining room " + roomId + ", username taken");
                    }
                }
            } catch(e) {
                socket.emit("room join failed");
                console.log(username + " failed joining room " + roomId + ", room doesn't exist");
            }
       });
    });
}
