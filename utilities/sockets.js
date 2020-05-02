const socketio = require("socket.io");
const idGen = require("./IDGenerator");

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        socket.emit("serverMessage", "Welcome to duel.wtf!");
        socket.join("global");
        socket.currentRoom = "global";
        socket.username = "Temp" + String(Math.round(Math.random() * 1000));
        socket.emit("changeUsername", socket.username);

        socket.on("createRoom", function() {
            socket.currentRoom = idGen.generateRandomId();
            socket.join(socket.currentRoom);
            socket.leave("global");

            let room = io.sockets.adapter.rooms[socket.currentRoom];

            // Room Variables
            room.connectedSocketData = {
                usernames: [socket.username],
                scores: [0],
            }

            room.cpsGameData = [];

            // Notify client
            console.log("user " + socket.username + " created room with id " + socket.currentRoom);
            socket.emit("confirmRoomCreation", socket.currentRoom);
            io.to(socket.currentRoom).emit("updatePlayerList", room.connectedSocketData);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " connected.");

            // Set up shared listeners
            socket.on("ready", function() { playerReady(socket)});
            socket.on("cpsGameComplete", function(cpsScore) { cpsGame(socket, cpsScore)});

            socket.on("gameStarted", function(selectedGame) {
                console.log(socket.username + " started game " + selectedGame + " in room " + socket.currentRoom);
                room.selectedGame = selectedGame;
                room.playersReady = [];

                io.to(socket.currentRoom).emit("loadGame", selectedGame);
            });

            socket.on("disconnect", function() { onDisconnect(socket, room, true) });
        });

        socket.on("attemptRoomJoin", function(roomId) {
            // Not elegant. Refactor in future?
            try {
                let room = io.sockets.adapter.rooms[roomId];
                if (room.length >= 1) {
                    if (!(room.connectedSocketData.usernames.includes(socket.username))) {
                        socket.join(roomId);
                        socket.leave("global");
                        socket.currentRoom = roomId;

                        room.connectedSocketData.usernames.push(socket.username);
                        room.connectedSocketData.scores.push(0);

                        io.to(roomId).emit("updatePlayerList", room.connectedSocketData.usernames);
                        io.to(roomId).emit("serverMessage", socket.username + " connected.");
                        socket.emit("roomJoinSuccess", room, roomId);

                        console.log(socket.username + " joined room " + roomId);

                        // Set up shared listeners
                        socket.on("ready", function() { playerReady(socket)});
                        socket.on("cpsGameComplete", function(cpsScore) { cpsGame(socket, cpsScore)});
                        socket.on("disconnect", function() { onDisconnect(socket, room, false) });
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

    const onDisconnect = function(socket, room, isHost) {
        // Remove user from connectedSocketData array
        let index = room.connectedSocketData.usernames.indexOf(socket.username);
        if (index !== -1) {
            room.connectedSocketData.usernames.splice(index, 1);
            room.connectedSocketData.scores.splice(index, 1);
        }

        if (isHost) {
            console.log(socket.username + " (host) disconnected from room " + socket.currentRoom + ", closing it.");
            io.to(socket.currentRoom).emit("refreshPage");
        } else {
            console.log(socket.username + " disconnected from room " + socket.currentRoom);
            io.to(socket.currentRoom).emit("updatePlayerList", room.connectedSocketData);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " disconnected.");
        }
    }

    const playerReady = function(socket) {
        let room = io.sockets.adapter.rooms[socket.currentRoom];

        if (!(room.playersReady.includes(socket.username))) {
            room.playersReady.push(socket.username);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " is ready. " + room.playersReady.length + "/" + room.connectedSocketData.usernames.length);
        } else {
            let index = room.playersReady.indexOf(socket.username);
            if (index !== -1) room.playersReady.splice(index, 1);
            io.to(socket.currentRoom).emit("serverMessage", socket.username + " is no longer ready. " + room.playersReady.length + "/" + room.connectedSocketData.usernames.length);
        }

        if (room.playersReady.length == room.length) {
            room.playersReady = [];
            io.to(socket.currentRoom).emit("serverMessage", "All players ready.");
            io.to(socket.currentRoom).emit("allPlayersReady", room.selectedGame);
        }
    }

    const cpsGame = function(socket, cpsCount) {
        let room = io.sockets.adapter.rooms[socket.currentRoom];
        room.cpsGameData = [];
        room.cpsGameData.push({
            username: socket.username,
            socket: socket,
            cpsScore: cpsCount,
        });

        console.log(socket.username + " scored " + cpsCount + " CPS");

        // If all players have completed the game
        if (room.connectedSocketData.usernames.length == room.cpsGameData.length) {
            // Sort the array of game data by the cpsScores inside each object.
            room.cpsGameData.sort(function(a, b) {
                if (a.cpsScore < b.cpsScore) return 1;
                if (a.cpsScore > b.cpsScore) return -1;
                return 0;
            });

            let winner = room.cpsGameData[0];
            // Increase winners score
            room.connectedSocketData.scores[room.connectedSocketData.usernames.indexOf(winner.username)]++;

            io.to(socket.currentRoom).emit("serverMessage", winner.username + " won with " + winner.cpsScore + "CPS");
            io.to(socket.currentRoom).emit("updatePlayerList", room.connectedSocketData);
            io.to(socket.currentRoom).emit("showLobby");
        }
    }
}
