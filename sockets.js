const socketio = require("socket.io");
const hri = require("human-readable-ids").hri; // Code own version?

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        socket.emit("serverMessage", "Welcome to duel.wtf!");
        socket.on("createRoom", function(username) {
            var roomId = hri.random();
            socket.join(roomId);

            var room = io.sockets.adapter.rooms[roomId];

            socket.username = username;
            room.usernames = [username];

            socket.emit("confirmRoomCreation", roomId);
            io.to(roomId).emit("updatePlayerList", room.usernames);
            io.to(roomId).emit("serverMessage", socket.username + " connected.");

            socket.on("gameStarted", function(selectedGame) {
                console.log(socket.username + " started game " + selectedGame + " in room " + roomId);
                io.to(roomId).emit("loadGame", selectedGame);
            });

            socket.on("disconnect", function() {
                var index = room.usernames.indexOf(socket.username);
                if (index !== -1) room.usernames.splice(index, 1);

                io.to(roomId).emit("updatePlayerList", room.usernames);
                io.to(roomId).emit("serverMessage", "Host " + socket.username + " disconnected. The game cannot be started.");
                console.log(socket.username + "(host) disconnected from room " + roomId);
            });
            console.log("user " + socket.username + " created room with id " + roomId);
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
                        io.to(roomId).emit("serverMessage", socket.username + " connected.");
                        socket.emit("roomJoinSuccess", room, roomId);

                        console.log(username + " joined room " + roomId);

                        socket.on("disconnect", function() {
                            var index = room.usernames.indexOf(socket.username);
                            if (index !== -1) room.usernames.splice(index, 1);

                            io.to(roomId).emit("updatePlayerList", room.usernames);
                            io.to(roomId).emit("serverMessage", socket.username + " disconnected.");
                            console.log(socket.username + " disconnected from room " + roomId);
                        });
                    } else {
                        console.log(username + " failed joining room " + roomId + ", username taken");
                        socket.emit("roomJoinFail");
                    }
                }
            } catch(e) {
                socket.emit("roomJoinFail");
                console.log(username + " failed joining room " + roomId + ", room doesn't exist");
            }
       });

       socket.on("chatMessage", function(message, username, roomId) {
           io.to(roomId).emit("chatMessage", message, username);
       });
    });
}
