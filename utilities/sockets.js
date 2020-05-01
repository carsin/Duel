const socketio = require("socket.io");
const idGen = require("./IDGenerator");

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        socket.emit("serverMessage", "Welcome to duel.wtf!");
        socket.join("global");
        socket.currentRoom = "global";
        socket.username = "XD" + String(Math.round(Math.random() * 1000));
        socket.emit("changeUsername", socket.username);

        socket.on("createRoom", function() {
            socket.currentRoom = idGen.generateRandomId();
            socket.join(socket.currentRoom);
            socket.leave("global");

            let room = io.sockets.adapter.rooms[socket.currentRoom];

            room.usernames = [socket.username];

            socket.emit("confirmRoomCreation", socket.currentRoom);
            io.to(socket.currentRoom).emit("updatePlayerList", room.usernames);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " connected.");

            socket.on("gameStarted", function(selectedGame) {
                console.log(socket.username + " started game " + selectedGame + " in room " + socket.currentRoom);
                room.selectedGame = selectedGame;

                room.playersReady = [];
                socket.on("ready", function() { playerReady(socket)});

                io.to(socket.currentRoom).emit("loadGame", selectedGame);
            });

            socket.on("disconnect", function() {
                // Remove user from username list
                let index = room.usernames.indexOf(socket.username);
                if (index !== -1) room.usernames.splice(index, 1);

                io.to(socket.currentRoom).emit("updatePlayerList", room.usernames);
                io.to(socket.currentRoom).emit("serverMessage", "Host " + socket.username + " disconnected. The game cannot be started.");
                console.log(socket.username + " (host) disconnected from room " + socket.currentRoom + ", closing it.");
            });
            console.log("user " + socket.username + " created room with id " + socket.currentRoom);
        });

        socket.on("attemptRoomJoin", function(roomId) {
            // Not elegant. Refactor in future?
            try {
                let room = io.sockets.adapter.rooms[roomId];
                if (room.length >= 1) {
                    if (!(room.usernames.includes(socket.username))) {
                        socket.join(roomId);
                        socket.leave("global");
                        socket.currentRoom = roomId;

                        room.usernames.push(socket.username);

                        io.to(roomId).emit("updatePlayerList", room.usernames);
                        io.to(roomId).emit("serverMessage", socket.username + " connected.");
                        socket.emit("roomJoinSuccess", room, roomId);

                        console.log(socket.username + " joined room " + roomId);

                        socket.on("ready", function() { playerReady(socket)});
                        socket.on("disconnect", function() {
                            // Remove user from username list
                            let index = room.usernames.indexOf(socket.username);
                            if (index !== -1) room.usernames.splice(index, 1);

                            io.to(roomId).emit("updatePlayerList", room.usernames);
                            io.to(roomId).emit("serverMessage", socket.username + " disconnected.");
                            console.log(socket.username + " disconnected from room " + roomId);
                        });
                    } else {
                        console.log(socket.username + " failed joining room " + roomId + ", username taken");
                        socket.emit("roomJoinFail");
                    }
                }
            } catch (e) {
                console.log(socket.username + " failed joining room " + roomId + ", room doesn't exist");
                socket.emit("roomJoinFail");
            }
       });

       socket.on("chatMessage", function(message) {
            // Prevent html injection
           message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
           message = message.substring(0, 200);

           io.to(socket.currentRoom).emit("chatMessage", message, socket.username);
           console.log("(" + socket.currentRoom + ") " + socket.username + ": " + message);
       });

       socket.on("setUsername", function(username) {
            username = username.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            if (username.trim() != "" && username.length <= 16) {
                socket.username = username;
            } else {
                socket.to(socket).emit("serverMessage", "Username is empty or more than 16 characters");

            }
       });
    });

    var playerReady = function(socket) {
        let room = io.sockets.adapter.rooms[socket.currentRoom];
        if (!(room.playersReady.includes(socket.username))) {
            room.playersReady.push(socket.username);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " is ready. " + room.playersReady.length + "/" + room.usernames.length);
        } else {
            let index = room.playersReady.indexOf(socket.username);
            if (index !== -1) room.playersReady.splice(index, 1);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " is no longer ready. " + room.playersReady.length + "/" + room.usernames.length);
        }

        if (room.playersReady.length == room.length) {
            io.to(socket.currentRoom).emit("serverMessage", "All players ready.");
            io.to(socket.currentRoom).emit("allPlayersReady", room.selectedGame);
        }
    }

    var cpsGame = function(socket, cpsCount) {
        room = io.sockets.adapter.rooms[socket.currentRoom];

    }
}
