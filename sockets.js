const socketio = require("socket.io");
const hri = require("human-readable-ids").hri;

exports.socketServer = function(app, server) {
    var io = socketio.listen(server);
    io.on("connection", function(socket) {
        console.log("user connected");

        socket.on("game create", function(usernameInput, selectedGame) {
            console.log(selectedGame + " game created by " + usernameInput + " ID: " + hri.random());
        });

        socket.on("room create", function() {
            console.log("user created room");
        });

        socket.on("room join", function() {
            console.log("user joining room");
        });
    });
}
