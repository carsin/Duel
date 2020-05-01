const socketio = require("socket.io");
const idGen = require("./IDGenerator");

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        socket.emit("serverMessage", "Welcome to duel.wtf!");
        socket.join("global");
        socket.on("createRoom", function(username) {
            var roomId = idGen.generateRandomId();
            socket.join(roomId);

            var room = io.sockets.adapter.rooms[roomId];

            socket.username = username;
            room.usernames = [username];
            room.selectedGame;

            socket.emit("confirmRoomCreation", roomId);
            io.to(roomId).emit("updatePlayerList", room.usernames);
            io.to(roomId).emit("serverMessage", socket.username + " connected.");

            socket.on("gameStarted", function(selectedGame) {
                console.log(socket.username + " started game " + selectedGame + " in room " + roomId);
                room.selectedGame = selectedGame;

                room.playersReady = [];
                socket.on("ready", function() { playerReady(socket, roomId)});

                io.to(roomId).emit("loadGame", selectedGame);
            });

            socket.on("disconnect", function() {
                var index = room.usernames.indexOf(socket.username);
                if (index !== -1) room.usernames.splice(index, 1);

                io.to(roomId).emit("updatePlayerList", room.usernames);
                io.to(roomId).emit("serverMessage", "Host " + socket.username + " disconnected. The game cannot be started.");
                console.log(socket.username + " (host) disconnected from room " + roomId + ", closing it.");
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

                        socket.on("ready", function() { playerReady(socket, roomId)});
                        socket.on("disconnect", function() {
                            // Remove user from username list
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
           console.log("(" + roomId + ") " + username + ": " + message);
       });
    });

    var playerReady = function(socket, roomId) {
        var room = io.sockets.adapter.rooms[roomId];
        if (!(room.playersReady.includes(socket.username))) {
            room.playersReady.push(socket.username);
            io.to(roomId).emit("serverMessage", socket.username + " is ready. " + room.playersReady.length + "/" + room.usernames.length);
        } else {
            var index = room.playersReady.indexOf(socket.username);
            if (index !== -1) room.playersReady.splice(index, 1);
            io.to(roomId).emit("serverMessage", socket.username + " is no longer ready. " + room.playersReady.length + "/" + room.usernames.length);
        }

        if (room.playersReady.length == room.length) {
            io.to(roomId).emit("serverMessage", "All players ready.");
            io.to(roomId).emit("allPlayersReady", room.selectedGame);
        }
    }
}
